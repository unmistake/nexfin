# NexFin Systems — Landing Page

Landing page moderna e futurística da **NexFin Systems** — infraestrutura financeira para ecossistemas.

> _Tecnologia que constrói novos horizontes. Soluções financeiras sob medida, para um mundo sem fronteiras._

Site estático (HTML + CSS + JavaScript, sem build), com tema dark futurista na identidade da marca (gradiente esmeralda → ciano), layout totalmente responsivo, animações de scroll e mockup de dashboard financeiro.

## 🗂 Estrutura

```
.
├── index.html      # Página única com todas as seções
├── styles.css      # Design system e estilos (tema dark, glassmorphism)
├── script.js       # Nav, menu mobile, reveal on scroll, FAQ, formulário
├── assets/
│   ├── logo.svg     # Marca "N" (montanha/horizonte) em gradiente
│   └── favicon.svg  # Favicon
├── vercel.json      # Configuração de deploy (headers/cache)
└── README.md
```

## 🚀 Rodar localmente

Qualquer servidor estático serve. Exemplos:

```bash
# Python
python -m http.server 5177
# ou Node
npx serve .
```

Depois abra `http://localhost:5177`.

## ☁️ Deploy (Vercel)

O projeto é 100% estático — a Vercel detecta e publica automaticamente.

- **Via GitHub:** importe o repositório em [vercel.com/new](https://vercel.com/new) e faça o deploy (sem configuração adicional).
- **Via CLI:** `npx vercel --prod`

## 📥 Leads no WhatsApp (função serverless)

O formulário de contato envia os dados para a função serverless [`api/lead.js`](api/lead.js)
(rodando na Vercel), que dispara uma mensagem no **WhatsApp** do dono via
**WhatsApp Cloud API (Meta)**. O visitante vê apenas *"Formulário enviado ✅"* — o número
e o token ficam no servidor, nunca no navegador.

### Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `WHATSAPP_TOKEN` | ✅ | Token de acesso permanente da app (System User token) |
| `WHATSAPP_PHONE_ID` | ✅ | *Phone number ID* do remetente (Cloud API) |
| `WHATSAPP_TO` | ✅ | Número que recebe os leads, com código do país. Ex.: `5511999999999` |
| `WHATSAPP_TEMPLATE` | — | Nome do template aprovado (padrão: `novo_lead`) |
| `WHATSAPP_LANG` | — | Idioma do template (padrão: `pt_BR`) |

Depois de salvar as variáveis, faça um **Redeploy** para aplicá-las.

### Template do WhatsApp

Crie no *WhatsApp Manager* um template (categoria **Utility**) chamado `novo_lead`, idioma
`pt_BR`, com **4 variáveis** no corpo, por exemplo:

```
🔔 Novo lead pelo site NexFin

Nome: {{1}}
Empresa: {{2}}
E-mail: {{3}}
Mensagem: {{4}}
```

A função preenche `{{1..4}}` com nome, empresa, e-mail e mensagem (já higienizados).

## ✏️ Personalização rápida

- **E-mail exibido:** `nextfin.systems@gmail.com` (rodapé e mensagem de fallback em [`script.js`](script.js)).
- **Métricas da seção de estatísticas:** ajuste os números em `index.html` (bloco `.stats`) para os dados reais da operação.
- **Cores/gradiente:** variáveis CSS em `:root` no topo de [`styles.css`](styles.css).
- **Textos e seções:** todo o conteúdo está em `index.html`.

## 🔗 Referências de marca

- Instagram: [@nexfin.systems](https://www.instagram.com/nexfin.systems/)

---

© NexFin Systems.
