export default async function handler(req, res) {
  const API_KEY = process.env.TRAFFICSO1_API_KEY || "cf5e995ca4e04a2e9980c49b1683593b";
  const CREATE_API_BASE = "https://manager.trafficso1.com/api/cong-khai/tao-lien-ket?apikey=cf5e995ca4e04a2e9980c49b1683593b&url=";

  const targetUrl = (req.query.url || "").toString().trim();
  if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
    return res.status(400).json({ ok: false, error: "Thiếu hoặc sai tham số url đích." });
  }

  const endpoint = `${CREATE_API_BASE}?apikey=${encodeURIComponent(API_KEY)}&url=${encodeURIComponent(targetUrl)}`;

  try {
    const upstream = await fetch(endpoint, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://manager.trafficso1.com/",
        "Origin": "https://manager.trafficso1.com"
      }
    });

    const rawText = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      parsed = rawText;
    }

    return res.status(200).json({
      ok: true,
      status: upstream.status,
      raw: rawText,
      data: parsed
    });
  } catch (err) {
    return res.status(502).json({
      ok: false,
      error: err && err.message ? err.message : "Lỗi kết nối tới API Traffic so1."
    });
  }
}
