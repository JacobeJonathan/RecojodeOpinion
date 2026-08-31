const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!APPS_SCRIPT_URL) {
    return res.status(500).json({
      ok: false,
      error: "Falta la variable APPS_SCRIPT_URL en Vercel."
    });
  }

  try {
    const isGet = req.method === "GET";

    const body = isGet
      ? undefined
      : (
          typeof req.body === "string"
            ? req.body
            : JSON.stringify(req.body || {})
        );

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: isGet ? "GET" : "POST",
      headers: isGet
        ? {}
        : {
            "Content-Type": "application/json;charset=utf-8"
          },
      body,
      redirect: "follow"
    });

    const text = await upstream.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      return res.status(502).json({
        ok: false,
        error: "Apps Script no devolvió JSON.",
        upstreamStatus: upstream.status,
        upstreamPreview: text.slice(0, 300)
      });
    }

    return res
      .status(upstream.ok ? 200 : 502)
      .json(data);

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message || String(error)
    });

  }
}
