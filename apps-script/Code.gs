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
  if ((e.parameter || {}).action === "trackOrder") return handleTrackOrder(e);
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
    return redirectToWebsite(isSuccess, isSuccess ? "Payment completed successfully." : "Payment was unsuccessful or cancelled.", txnid, isSuccess ? { name: stagedOrder.payment.firstname, phone: stagedOrder.payment.phone } : null);
  } catch (error) {
    return redirectToWebsite(false, "Unable to verify payment: " + error.message);
  }
}

function handleTrackOrder(e) {
  const callback = String((e.parameter || {}).callback || "callback");
  try {
    if (!/^[a-zA-Z0-9_.$]+$/.test(callback)) throw new Error("Invalid callback name.");
    const orderId = String(e.parameter.orderId || "").trim();
    const phone = normalizePhone(e.parameter.phone);
    if (!orderId || !phone) throw new Error("Enter your order ID and mobile number.");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    for (const sheetName of ["Checkout", "ComboDeals"]) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) continue;
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
      const records = rows.map((row) => headers.reduce((record, key, index) => ({ ...record, [key]: row[index] }), {}));
      const matches = records.filter((record) => String(record.paymentOrderId) === orderId && normalizePhone(record.phone || record.mobile) === phone);
      if (matches.length) return jsonpResponse(callback, { ok: true, order: { orderId, type: sheetName, status: matches[0].paymentStatus, name: matches[0].customerName || matches[0].name, phone: matches[0].phone || matches[0].mobile, placedAt: matches[0].submittedAt, items: matches.map((record) => record.productName || record.dealName).filter(Boolean) } });
    }
    throw new Error("No paid order found with these details.");
  } catch (error) {
    return jsonpResponse(callback, { ok: false, message: error.message });
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

function redirectToWebsite(isSuccess, message, orderId, orderDetails) {
  let url = getScriptProperty(isSuccess ? "PAYU_SUCCESS_URL" : "PAYU_FAILURE_URL");
  if (isSuccess && orderId) url += (url.includes("?") ? "&" : "?") + "orderId=" + encodeURIComponent(orderId);
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
  const detailsBlock = isSuccess && orderId
    ? `<section class="order-details"><div class="details-top"><span class="paid-badge">PAYMENT VERIFIED</span><span class="details-note">Order confirmed</span></div><div class="order-label">Your order ID</div><div class="order-id"><code id="order-id">${escapeHtml(orderId)}</code><button type="button" onclick="copyOrderId()">Copy ID</button></div><div class="customer-details"><div><span>Customer name</span><strong>${escapeHtml(orderDetails?.name || "—")}</strong></div><div><span>Mobile number</span><strong>${escapeHtml(orderDetails?.phone || "—")}</strong></div></div><p class="warning"><b>Important:</b> Order ID sirf ek baar show hogi. Isse copy karke safe jagah par rakh lijiye.</p></section><script>function copyOrderId(){var text=document.getElementById('order-id').textContent;var button=document.querySelector('.order-id button');function done(){button.textContent='Copied';setTimeout(function(){button.textContent='Copy ID';},1800);}if(navigator.clipboard){navigator.clipboard.writeText(text).then(done);}else{var input=document.createElement('textarea');input.value=text;document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();done();}}</script>`
    : "";

  return HtmlService.createHtmlOutput(`
    <!doctype html><html><head><base target="_top"><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{font-family:Arial,sans-serif;text-align:center;padding:48px 20px;overflow-x:hidden;color:#183d31;background:linear-gradient(145deg,#f5fcf7,#fff)}
      h2{margin:0;font-size:28px;letter-spacing:-.03em}body>p{margin:10px 0 0;color:#66756d}
      .status-icon{width:74px;height:74px;display:block;margin:0 auto 17px}
      .status-circle{fill:none;stroke:${statusColor};stroke-width:4}
      .status-mark{stroke-linecap:round}
      .order-details{max-width:470px;margin:28px auto 0;padding:22px;border:1px solid #d7e8dd;border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 14px 34px rgba(20,90,69,.1);text-align:left}
      .details-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:21px}.paid-badge{padding:6px 9px;border-radius:99px;background:#e5f6ea;color:#187044;font-size:10px;font-weight:800;letter-spacing:.08em}.details-note{color:#76857c;font-size:12px;font-weight:600}
      .order-label{font-size:11px;color:#748279;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
      .order-id{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0 21px;padding:12px 13px;border:1px solid #dbe9df;border-radius:10px;background:#f6fbf7}
      code{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px;font-weight:800;color:#145a45}.order-id button{flex:0 0 auto;border:0;border-radius:7px;padding:8px 11px;background:#1f7a5f;color:#fff;font-size:12px;font-weight:800;cursor:pointer}
      .customer-details{display:grid;grid-template-columns:1fr 1fr;gap:12px}.customer-details div{display:grid;gap:5px;padding:12px;border-radius:10px;background:#f8faf8}.customer-details span{color:#7a8880;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.customer-details strong{color:#28483a;font-size:14px;word-break:break-word}
      .warning{margin:16px 0 0;padding:12px;border-left:3px solid #e6ae28;border-radius:7px;background:#fff8e4;color:#765100;font-size:12px;line-height:1.55}.continue-button{display:inline-block;margin-top:25px;box-shadow:0 8px 18px rgba(31,122,95,.2)}
      .confetti{position:fixed;top:-10px;width:8px;height:8px;border-radius:2px;opacity:.9;animation:fall linear forwards}
      @keyframes fall{to{transform:translateY(110vh) rotate(360deg);opacity:0}}
      @media(max-width:480px){body{padding:34px 14px}.order-details{padding:17px}.customer-details{grid-template-columns:1fr}.order-id{align-items:stretch;flex-direction:column}.order-id button{width:100%}}
    </style></head><body>
      ${statusIcon}<h2>${escapeHtml(message)}</h2><p>${orderText}</p>
      ${detailsBlock}
      <a href="${safeUrl}" target="_top" class="continue-button" style="padding:12px 20px;background:${statusColor};color:#fff;text-decoration:none;border-radius:6px;font-weight:600">${buttonText}</a>
      ${confettiScript}
    </body></html>`);
}

function getScriptProperty(name) { return PropertiesService.getScriptProperties().getProperty(name) || ""; }
function sha512Hex(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, value, Utilities.Charset.UTF_8).map((byte) => ("0" + (byte < 0 ? byte + 256 : byte).toString(16)).slice(-2)).join(""); }
function jsonpResponse(callback, data) { return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`).setMimeType(ContentService.MimeType.JAVASCRIPT); }
function jsonResponse(data) { return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); }
function escapeHtml(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function normalizePhone(value) { return String(value || "").replace(/\D/g, "").slice(-10); }
