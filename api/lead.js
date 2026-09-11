// Vercel Serverless Function — recebe o formulário do site e dispara o lead
// no WhatsApp do dono via WhatsApp Cloud API (Meta). Roda no servidor:
// o número e o token NUNCA vão para o navegador do visitante.
//
// Configure em Vercel -> Settings -> Environment Variables:
//   WHATSAPP_TOKEN     - token de acesso permanente da app (System User token)
//   WHATSAPP_PHONE_ID  - Phone number ID do remetente (Cloud API)
//   WHATSAPP_TO        - número que recebe os leads, com código do país. Ex.: 5511999999999
//   WHATSAPP_TEMPLATE  - nome do template aprovado (padrão: novo_lead)
//   WHATSAPP_LANG      - idioma do template (padrão: pt_BR)

var GRAPH_VERSION = "v21.0";

// Normaliza um valor para uso como parâmetro de template do WhatsApp:
// sem quebras de linha / tabs / espaços múltiplos (senão a API rejeita).
function clean(value, max) {
  return String(value == null ? "" : value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max || 900);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // O corpo pode chegar como objeto (Vercel parseia JSON) ou como string.
  var data = req.body;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (e) { data = {}; }
  }
  data = data || {};

  // Honeypot anti-spam: campo invisível preenchido = bot. Finge sucesso e ignora.
  if (clean(data.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  var nome = clean(data.nome, 120);
  var empresa = clean(data.empresa, 120) || "-";
  var email = clean(data.email, 160);
  var mensagem = clean(data.mensagem, 900) || "-";

  if (!nome || !email) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }

  var token = process.env.WHATSAPP_TOKEN;
  var phoneId = process.env.WHATSAPP_PHONE_ID;
  var to = process.env.WHATSAPP_TO;
  var template = process.env.WHATSAPP_TEMPLATE || "novo_lead";
  var lang = process.env.WHATSAPP_LANG || "pt_BR";

  if (!token || !phoneId || !to) {
    console.error("[lead] variáveis de ambiente do WhatsApp ausentes");
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

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
            { type: "text", text: nome },
            { type: "text", text: empresa },
            { type: "text", text: email },
            { type: "text", text: mensagem }
          ]
        }
      ]
    }
  };

  try {
    var r = await fetch(
      "https://graph.facebook.com/" + GRAPH_VERSION + "/" + phoneId + "/messages",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    var result = await r.json().catch(function () { return {}; });

    if (!r.ok) {
      // Log fica só no servidor (Vercel logs); o cliente recebe erro genérico.
      console.error("[lead] erro WhatsApp API:", r.status, JSON.stringify(result));
      return res.status(502).json({ ok: false, error: "send_failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] exceção ao enviar:", err && err.message);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
};
