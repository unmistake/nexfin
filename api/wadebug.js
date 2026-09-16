// TEMPORÁRIO — diagnóstico de entrega. Envia o template e devolve a resposta
// crua da Graph API (message id, contacts/wa_id, erros). Removido depois.

module.exports = async function handler(req, res) {
  var token = process.env.WHATSAPP_TOKEN;
  var phoneId = process.env.WHATSAPP_PHONE_ID;
  var to = process.env.WHATSAPP_TO;
  var template = process.env.WHATSAPP_TEMPLATE || "novo_lead";
  var lang = process.env.WHATSAPP_LANG || "pt_BR";

  var payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: template,
      language: { code: lang },
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
    return res.status(200).json({
      httpStatus: r.status,
      ok: r.ok,
      sentTo: to,
      lang: lang,
      template: template,
      phoneId: phoneId,
      response: body
    });
  } catch (err) {
    return res.status(500).json({ error: String(err && err.message) });
  }
};
