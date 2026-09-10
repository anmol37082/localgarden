'use client';

export const GOOGLE_SHEETS_WEB_APP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbyoWYRGNMGdFqDndWyZSsWkdeFQ_URqSrgGOA31K_FU4pdrjMO7lkPgFNAoaS_2h4CdQg/exec";

function createCallbackName() {
  return `__lg_apps_script_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function submitRowsToGoogleSheet({ sheetName, rows }) {
  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    return { ok: false, skipped: true, reason: 'Missing NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL' };
  }

  const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      sheetName,
      rows,
    }),
  });

  return { ok: true, response };
}

export function createPayUCheckout({
  amount,
  txnid,
  productinfo,
  firstname,
  email,
  phone,
  udf1 = "",
  udf2 = "",
}) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PayU checkout can only run in the browser."));
  }

  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL"));
  }

  return new Promise((resolve, reject) => {
    const callbackName = createCallbackName();
    const url = new URL(GOOGLE_SHEETS_WEB_APP_URL);

    url.searchParams.set("action", "createPayUCheckout");
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("txnid", txnid);
    url.searchParams.set("productinfo", productinfo);
    url.searchParams.set("firstname", firstname);
    url.searchParams.set("email", email);
    url.searchParams.set("phone", phone);
    url.searchParams.set("udf1", udf1);
    url.searchParams.set("udf2", udf2);

    const cleanup = () => {
      if (window[callbackName]) {
        delete window[callbackName];
      }

      const script = document.getElementById(callbackName);
      if (script) {
        script.remove();
      }
    };

    window[callbackName] = (payload) => {
      cleanup();

      if (!payload || payload.ok === false) {
        reject(new Error(payload?.message || "Failed to prepare PayU checkout."));
        return;
      }

      resolve(payload);
    };

    const script = document.createElement("script");
    script.id = callbackName;
    script.src = url.toString();
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error("Failed to load PayU checkout response."));
    };

    document.body.appendChild(script);
  });
}

export function redirectToPayUCheckout({ actionUrl, formData }) {
  if (!actionUrl || !formData) {
    throw new Error("Invalid PayU checkout response.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.style.display = "none";

  Object.entries(formData).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value ?? "");
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
