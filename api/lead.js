// Vercel Serverless Function — recebe o formulário do site e envia o lead
// por E-MAIL para o dono, via FormSubmit (grátis, sem chave de API).
// O visitante nunca vê o e-mail de destino (a chamada é feita no servidor).
//
// Primeira submissão: o FormSubmit envia um e-mail de ATIVAÇÃO para o
// endereço abaixo — basta clicar em "Activate Form" uma vez. Depois disso,
// todos os leads chegam por e-mail.

var LEAD_EMAIL = "nextfin.systems@gmail.com";

// Trim + limite de tamanho, preservando o conteúdo (e-mail aceita quebras de linha).
function clean(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max || 2000);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

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
  var mensagem = clean(data.mensagem, 2000) || "-";

  if (!nome || !email) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }

  var payload = {
    Nome: nome,
    Empresa: empresa,
    "E-mail": email,
    Mensagem: mensagem,
    _subject: "Novo lead pelo site NexFin — " + nome + (empresa !== "-" ? " (" + empresa + ")" : ""),
    _template: "table",
    _captcha: "false"
  };

  try {
    var r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(LEAD_EMAIL), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    var body = await r.json().catch(function () { return {}; });

    // FormSubmit devolve {success:true|"true", message:...}
    var ok = r.ok && body && (body.success === true || body.success === "true");
    if (!ok) {
      console.error("[lead] erro FormSubmit:", r.status, JSON.stringify(body));
      return res.status(502).json({ ok: false, error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] exceção ao enviar:", err && err.message);
    return res.status(502).json({ ok: false, error: "send_failed" });
  }
};
