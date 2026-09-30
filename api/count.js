// Vercel 中轉站：網頁呼叫 /api/count?month=YYYY-MM，由這裡帶金鑰去呼叫 777444
// 金鑰放在 Vercel 環境變數 DETECT_API_KEY，不會出現在網頁裡
module.exports = async (req, res) => {
  if (req.method !== 'GET') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false, error: 'GET only' })); }
  const key = process.env.DETECT_API_KEY;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (!key) { res.statusCode = 500; return res.end(JSON.stringify({ ok: false, error: 'Vercel 未設定環境變數 DETECT_API_KEY' })); }
  const month = /^\d{4}-\d{2}$/.test(req.query && req.query.month || '') ? req.query.month : '';
  const url = 'https://777444-production.up.railway.app/api/detect/play-push-summary' + (month ? '?month=' + month : '');
  try {
    const r = await fetch(url, { headers: { 'x-api-key': key }, redirect: 'manual' });
    const text = await r.text();
    res.statusCode = r.status;
    return res.end(text || JSON.stringify({ ok: false, error: 'HTTP ' + r.status }));
  } catch (e) {
    res.statusCode = 502;
    return res.end(JSON.stringify({ ok: false, error: '中轉站連不到 777444：' + (e && e.message || e) }));
  }
};
