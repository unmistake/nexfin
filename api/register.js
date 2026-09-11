// TEMPORÁRIO — registra o número da Cloud API (corrige o erro 133010
// "Account not registered"). Usa o token do ambiente (nunca exposto ao cliente).
// Chame uma vez: GET /api/register?pin=395128  — depois este arquivo é removido.

module.exports = async function handler(req, res) {
  var token = process.env.WHATSAPP_TOKEN;
  var phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  var pin = (req.query && req.query.pin) || "395128";
  if (!/^\d{6}$/.test(String(pin))) {
    return res.status(400).json({ ok: false, error: "pin_must_be_6_digits" });
  }

  try {
    var r = await fetch(
      "https://graph.facebook.com/v21.0/" + phoneId + "/register",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messaging_product: "whatsapp", pin: String(pin) })
      }
    );
    var body = await r.json().catch(function () { return {}; });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status, body: body });
  } catch (err) {
    return res.status(502).json({ ok: false, error: String(err && err.message) });
  }
};
