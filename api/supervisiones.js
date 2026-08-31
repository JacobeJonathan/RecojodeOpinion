const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  process.env.WEB_APP_URL;

module.exports = async function handler(req, res) {

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS"
  );

  if (
    req.method === "OPTIONS"
  ) {
    return res.status(204).end();
  }

  if (
    !APPS_SCRIPT_URL
  ) {

    return res
      .status(500)
      .json({

        ok: false,

        error:
          "Falta APPS_SCRIPT_URL en Vercel."

      });

  }

  try {

    const isGet =
      req.method === "GET";

    let body;

    if (!isGet) {

      body =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(
              req.body || {}
            );

    }

    const upstream =
      await fetch(
        APPS_SCRIPT_URL,
        {

          method:
            isGet
              ? "GET"
              : "POST",

          headers:
            isGet
              ? {}
              : {
                  "Content-Type":
                    "text/plain;charset=utf-8"
                },

          body:
            isGet
              ? undefined
              : body,

          redirect:
            "follow"

        }
      );

    const text =
      await upstream.text();

    let data;

    try {

      data =
        JSON.parse(
          text
        );

    } catch (error) {

      return res
        .status(502)
        .json({

          ok: false,

          error:
            "Apps Script no devolvió JSON.",

          upstreamStatus:
            upstream.status,

          upstreamPreview:
            text.substring(
              0,
              500
            )

        });

    }

    return res
      .status(
        upstream.ok
          ? 200
          : 502
      )
      .json(
        data
      );

  } catch (error) {

    return res
      .status(500)
      .json({

        ok: false,

        error:
          error.message ||
          String(error)

      });

  }

};
