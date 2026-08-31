const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

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

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!APPS_SCRIPT_URL) {

    return res.status(500).json({
      ok: false,
      error: "Falta APPS_SCRIPT_URL en Vercel."
    });

  }

  try {

    const body =
      req.method === "POST"
        ? (
            typeof req.body === "string"
              ? req.body
              : JSON.stringify(req.body || {})
          )
        : undefined;


    const response =
      await fetch(
        APPS_SCRIPT_URL,
        {
          method:
            req.method === "GET"
              ? "GET"
              : "POST",

          headers:
            req.method === "GET"
              ? {}
              : {
                  "Content-Type":
                    "application/json"
                },

          body:
            body,

          redirect:
            "follow"
        }
      );


    const text =
      await response.text();


    let data;


    try {

      data =
        JSON.parse(
          text
        );

    } catch (error) {

      return res.status(502).json({

        ok: false,

        error:
          "Apps Script no devolvió JSON.",

        respuesta:
          text.substring(
            0,
            300
          )

      });

    }


    return res
      .status(
        response.ok
          ? 200
          : 502
      )
      .json(
        data
      );


  } catch (error) {

    return res.status(500).json({

      ok: false,

      error:
        error.message ||
        String(error)

    });

  }

};
