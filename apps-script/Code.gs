const SPREADSHEET_ID = "1j-oGhJgNkPT2yksqdGdg0l_UXDalsPqzmbse7RyzgCU";
const STAGED_ORDER_PREFIX = "payu-order:";
const STAGED_ORDER_TTL_SECONDS = 6 * 60 * 60;

const SHEETS = {
  Checkout: ["orderId", "submittedAt", "paymentStatus", "paymentId", "paymentOrderId", "paymentSignature", "customerName", "email", "phone", "pincode", "houseFlatBuildingNumber", "areaStreetLocality", "cityDistrict", "state", "landmark", "productName", "quantity", "basePrice", "discountAmount", "couponApplied", "couponCode", "finalPrice", "image"],
  ComboDeals: ["submittedAt", "orderId", "paymentStatus", "paymentId", "paymentOrderId", "paymentSignature", "dealName", "comboItems", "currentPrice", "originalPrice", "discountPercent", "name", "mobile", "alternateMobile", "pincode", "houseFlatBuildingNumber", "areaStreetLocality", "cityDistrict", "state", "landmark"],
  Reviews: ["submittedAt", "productName", "name", "email", "rating", "review"],
};

function initializeSheets() {
  createMissingSheets();
}

function doGet(e) {
  if ((e.parameter || {}).action === "createPayUCheckout") return handleCreatePayUCheckout(e);
  return jsonResponse({ ok: true, message: "Local Garden Apps Script is running" });
}

function doPost(e) {
  try {
    const callbackAction = (e.parameter && e.parameter.action) || "";
    if (callbackAction === "payuCallback") return handlePayUCallback(e);
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const action = data.action || "";

    if (action === "stagePayUOrder") return stagePayUOrder(data);

    // Reviews are not payment orders and can still be written immediately.
    if (data.sheetName !== "Reviews") {
      throw new Error("Orders must be staged and written only after a verified PayU callback.");
    }
    createMissingSheets();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    if (!rows.length) throw new Error("Missing rows.");
    appendRows("Reviews", rows);
    return jsonResponse({ ok: true, sheetName: "Reviews", count: rows.length });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  }
}

function stagePayUOrder(data) {
  try {
    const sheetName = String(data.sheetName || "");
    const rows = Array.isArray(data.rows) ? data.rows : [];
    const payment = data.payment || {};
    const txnid = String(payment.txnid || "");
    const amount = Number(payment.amount || 0);

    if (!SHEETS[sheetName] || sheetName === "Reviews") throw new Error("Invalid payment sheet.");
    if (!txnid || !Number.isFinite(amount) || amount <= 0 || !rows.length) throw new Error("Invalid staged order.");
    if (!payment.firstname || !payment.email || !payment.productinfo) throw new Error("Missing payment details.");
    if (rows.some((row) => String(row.orderId || "") !== txnid || String(row.paymentOrderId || "") !== txnid)) {
      throw new Error("Order rows do not match the PayU transaction ID.");
    }

    const stagedOrder = {
      sheetName,
      rows,
      createdAt: Date.now(),
      payment: {
        txnid,
        amount: amount.toFixed(2),
        productinfo: String(payment.productinfo),
        firstname: String(payment.firstname),
        email: String(payment.email),
        phone: String(payment.phone || ""),
        udf1: String(payment.udf1 || ""),
        udf2: String(payment.udf2 || ""),
      },
    };
    const serialized = JSON.stringify(stagedOrder);
    if (serialized.length > 8500) throw new Error("Order is too large to process. Please reduce cart items and try again.");

    const properties = PropertiesService.getScriptProperties();
    cleanupExpiredStagedOrders(properties);
    properties.setProperty(STAGED_ORDER_PREFIX + txnid, serialized);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: error.message });
  }
}

function handleCreatePayUCheckout(e) {
  const callbackName = String((e.parameter || {}).callback || "");
  try {
    if (!/^[a-zA-Z0-9_.$]+$/.test(callbackName)) throw new Error("Invalid callback name");
    const txnid = String(e.parameter.txnid || "");
    const stagedOrder = getStagedOrder(txnid);
    if (!stagedOrder) throw new Error("Order details expired. Please return to checkout and try again.");

    const key = getScriptProperty("PAYU_MERCHANT_KEY");
    const salt = getScriptProperty("PAYU_MERCHANT_SALT");
    const mode = getScriptProperty("PAYU_MODE").toLowerCase();
    if (!key || !salt) throw new Error("Missing PayU merchant configuration.");
    const callbackUrl = ScriptApp.getService().getUrl();
    if (!callbackUrl) throw new Error("Deploy this Apps Script as a Web App first.");

    const p = stagedOrder.payment;
    const formData = {
      key, txnid: p.txnid, amount: p.amount, productinfo: p.productinfo,
      firstname: p.firstname, email: p.email, phone: p.phone,
      surl: callbackUrl + "?action=payuCallback", furl: callbackUrl + "?action=payuCallback",
      udf1: p.udf1, udf2: p.udf2, udf3: "", udf4: "", udf5: "",
    };
    const hashString = `${key}|${p.txnid}|${p.amount}|${p.productinfo}|${p.firstname}|${p.email}|${p.udf1}|${p.udf2}|||||||||${salt}`;
    formData.hash = sha512Hex(hashString);
    return jsonpResponse(callbackName, { ok: true, actionUrl: mode === "live" ? "https://secure.payu.in/_payment" : "https://test.payu.in/_payment", formData });
  } catch (error) {
    return jsonpResponse(callbackName || "callback", { ok: false, message: error.message });
  }
}

function handlePayUCallback(e) {
  try {
    const response = e.parameter || {};
    const txnid = String(response.txnid || "");
    if (!verifyPayUResponse(response)) throw new Error("Payment hash verification failed.");

    const isSuccess = String(response.status || "").toLowerCase() === "success";
    const stagedOrder = getStagedOrder(txnid);
    if (!stagedOrder) {
      if (isSuccess && hasRecordedTransaction(txnid)) return redirectToWebsite(true, "Payment completed successfully.");
      throw new Error("Order details were not found. Please contact support with transaction ID " + txnid + ".");
    }
    verifyCallbackMatchesStagedOrder(response, stagedOrder);

    if (isSuccess) {
      appendVerifiedOrder(stagedOrder, response);
    }
    PropertiesService.getScriptProperties().deleteProperty(STAGED_ORDER_PREFIX + txnid);
    return redirectToWebsite(isSuccess, isSuccess ? "Payment completed successfully." : "Payment was unsuccessful or cancelled.");
  } catch (error) {
    return redirectToWebsite(false, "Unable to verify payment: " + error.message);
  }
}

function verifyCallbackMatchesStagedOrder(response, stagedOrder) {
  const p = stagedOrder.payment;
  if (String(response.key || "") !== getScriptProperty("PAYU_MERCHANT_KEY")) throw new Error("Merchant key mismatch.");
  if (String(response.txnid || "") !== p.txnid || String(response.udf2 || "") !== p.udf2) throw new Error("Transaction mismatch.");
  if (Number(response.amount || 0).toFixed(2) !== p.amount) throw new Error("Payment amount mismatch.");
}

function verifyPayUResponse(response) {
  const salt = getScriptProperty("PAYU_MERCHANT_SALT");
  if (!salt || !response.hash) return false;
  const additionalCharges = String(response.additionalCharges || response.additional_charges || "");
  const base = `${salt}|${response.status || ""}||||||${response.udf5 || ""}|${response.udf4 || ""}|${response.udf3 || ""}|${response.udf2 || ""}|${response.udf1 || ""}|${response.email || ""}|${response.firstname || ""}|${response.productinfo || ""}|${response.amount || ""}|${response.txnid || ""}|${response.key || ""}`;
  const reverseHash = additionalCharges ? `${additionalCharges}|${base}` : base;
  return sha512Hex(reverseHash).toLowerCase() === String(response.hash).toLowerCase();
}

function appendVerifiedOrder(stagedOrder, response) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (hasRecordedTransaction(response.txnid)) return;
    createMissingSheets();
    const rows = stagedOrder.rows.map((row) => ({
      ...row, paymentStatus: "PAID", paymentId: String(response.mihpayid || ""),
      paymentOrderId: String(response.txnid), paymentSignature: String(response.hash || ""),
    }));
    appendRows(stagedOrder.sheetName, rows);
  } finally {
    lock.releaseLock();
  }
}

function hasRecordedTransaction(txnid) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ["Checkout", "ComboDeals"].some((sheetName) => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return false;
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const column = headers.indexOf("paymentOrderId") + 1;
    return column > 0 && sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues().some((row) => String(row[0]) === String(txnid));
  });
}

function getStagedOrder(txnid) {
  const properties = PropertiesService.getScriptProperties();
  const key = STAGED_ORDER_PREFIX + txnid;
  const raw = properties.getProperty(key);
  if (!raw) return null;
  const stagedOrder = JSON.parse(raw);
  if (Date.now() - Number(stagedOrder.createdAt || 0) > STAGED_ORDER_TTL_SECONDS * 1000) {
    properties.deleteProperty(key);
    return null;
  }
  return stagedOrder;
}

function cleanupExpiredStagedOrders(properties) {
  const now = Date.now();
  Object.keys(properties.getProperties()).forEach((key) => {
    if (!key.startsWith(STAGED_ORDER_PREFIX)) return;
    try {
      const stagedOrder = JSON.parse(properties.getProperty(key));
      if (now - Number(stagedOrder.createdAt || 0) > STAGED_ORDER_TTL_SECONDS * 1000) properties.deleteProperty(key);
    } catch (error) {
      properties.deleteProperty(key);
    }
  });
}

function createMissingSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach((sheetName) => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);
    if (sheet.getLastRow() === 0) sheet.appendRow(SHEETS[sheetName]);
  });
}

function appendRows(sheetName, rows) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const values = rows.map((row) => buildRow(sheetName, row));
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
}

function buildRow(sheetName, row) {
  const fields = SHEETS[sheetName];
  return fields.map((field) => row[field] || "");
}

function redirectToWebsite(isSuccess, message) {
  const url = getScriptProperty(isSuccess ? "PAYU_SUCCESS_URL" : "PAYU_FAILURE_URL");
  if (!url) return HtmlService.createHtmlOutput(`<h2>${escapeHtml(message)}</h2>`);
  const safeUrl = escapeHtml(url);
  const statusColor = isSuccess ? "#198754" : "#dc3545";
  const buttonText = isSuccess ? "Continue shopping" : "Return to checkout";
  const orderText = isSuccess ? "Your order has been placed." : "Your payment was not completed. Please try again.";
  const statusIcon = isSuccess
    ? `<svg class="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="status-circle" cx="26" cy="26" r="23"/><path class="status-mark" fill="none" stroke="${statusColor}" stroke-width="4" d="M14 27l7 7 16-16"/></svg>`
    : `<svg class="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="status-circle" cx="26" cy="26" r="23"/><path class="status-mark" fill="none" stroke="${statusColor}" stroke-width="4" d="M17 17l18 18M35 17L17 35"/></svg>`;
  const confettiScript = isSuccess
    ? `<script>(function(){var colors=['#198754','#ffc107','#0dcaf0','#dc3545','#6610f2'];for(var i=0;i<60;i++){var el=document.createElement('div');el.className='confetti';el.style.left=Math.random()*100+'vw';el.style.background=colors[Math.floor(Math.random()*colors.length)];el.style.animationDuration=(2+Math.random()*2)+'s';el.style.animationDelay=(Math.random()*.5)+'s';document.body.appendChild(el);setTimeout((function(node){return function(){node.remove();};})(el),4500);}})();</script>`
    : "";

  return HtmlService.createHtmlOutput(`
    <!doctype html><html><head><base target="_top"><meta charset="utf-8"><style>
      body{font-family:Arial,sans-serif;text-align:center;padding:48px;overflow:hidden}
      .status-icon{width:70px;height:70px;display:block;margin:0 auto 16px}
      .status-circle{fill:none;stroke:${statusColor};stroke-width:4}
      .status-mark{stroke-linecap:round}
      .confetti{position:fixed;top:-10px;width:8px;height:8px;border-radius:2px;opacity:.9;animation:fall linear forwards}
      @keyframes fall{to{transform:translateY(110vh) rotate(360deg);opacity:0}}
    </style></head><body>
      ${statusIcon}<h2>${escapeHtml(message)}</h2><p>${orderText}</p>
      <a href="${safeUrl}" target="_top" style="display:inline-block;padding:12px 20px;background:${statusColor};color:#fff;text-decoration:none;border-radius:6px;font-weight:600">${buttonText}</a>
      ${confettiScript}
    </body></html>`);
}

function getScriptProperty(name) { return PropertiesService.getScriptProperties().getProperty(name) || ""; }
function sha512Hex(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, value, Utilities.Charset.UTF_8).map((byte) => ("0" + (byte < 0 ? byte + 256 : byte).toString(16)).slice(-2)).join(""); }
function jsonpResponse(callback, data) { return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`).setMimeType(ContentService.MimeType.JAVASCRIPT); }
function jsonResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
