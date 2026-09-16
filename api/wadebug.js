// TEMPORÁRIO — diagnóstico de entrega. Envia um template e devolve a resposta
// crua da Graph API. Query: ?tpl=hello_world|novo_lead  &to=<numero opcional>
// Removido depois.

module.exports = async function handler(req, res) {
  var token = process.env.WHATSAPP_TOKEN;
  var phoneId = process.env.WHATSAPP_PHONE_ID;
  var to = (req.query && req.query.to) || process.env.WHATSAPP_TO;
  var tpl = (req.query && req.query.tpl) || "novo_lead";

  var payload;
  if (tpl === "hello_world") {
    payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: { name: "hello_world", language: { code: "en_US" } }
    };
  } else {
    payload = {
      messaging_product: "whatsapp",
      to: to,
      type: "template",
      template: {
        name: tpl,
        language: { code: (req.query && req.query.lang) || process.env.WHATSAPP_LANG || "pt_BR" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: "Diagnostico" },
              { type: "text", text: "Diagnostico" },
              { type: "text", text: "diag@nexfin.systems" },
              { type: "text", text: "teste de entrega" }
            ]
          }
        ]
      }
    };
  }

  try {
    var r = await fetch(
      "https://graph.facebook.com/v21.0/" + phoneId + "/messages",
      {
        method: "POST",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    var body = await r.json().catch(function () { return {}; });
    return res.status(200).json({ httpStatus: r.status, ok: r.ok, sentTo: to, tpl: tpl, response: body });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message) });
  }
};
