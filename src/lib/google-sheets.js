'use client';

export const GOOGLE_SHEETS_WEB_APP_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEB_APP_URL ??
  "https://script.google.com/macros/s/AKfycbxyISwgv8MJAfs4bc1BIWt__CgT8sS7Z1CnkMYvC5nWeEyDwaf70UA_2mupSZ3fF0GZVA/exec";

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
