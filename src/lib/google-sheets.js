'use client';

export const GOOGLE_SHEETS_WEB_APP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbxyISwgv8MJAfs4bc1BIWt__CgT8sS7Z1CnkMYvC5nWeEyDwaf70UA_2mupSZ3fF0GZVA/exec";

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

export function createRazorpayOrder({ amount, currency = "INR", receiptId }) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay order creation can only run in the browser."));
  }

  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    return Promise.reject(new Error("Missing NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL"));
  }

  return new Promise((resolve, reject) => {
    const callbackName = createCallbackName();
    const url = new URL(GOOGLE_SHEETS_WEB_APP_URL);

    url.searchParams.set("action", "createOrder");
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("currency", currency);
    if (receiptId) {
      url.searchParams.set("receiptId", receiptId);
    }

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
        reject(new Error(payload?.message || "Failed to create Razorpay order."));
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
      reject(new Error("Failed to load Razorpay order response."));
    };

    document.body.appendChild(script);
  });
}
