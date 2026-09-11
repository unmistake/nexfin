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

## ✏️ Personalização rápida

- **E-mail de contato do formulário:** altere `CONTACT_EMAIL` em [`script.js`](script.js). Para receber os envios de forma automática, plugue um serviço como Formspree, Basin ou uma rota serverless.
- **Métricas da seção de estatísticas:** ajuste os números em `index.html` (bloco `.stats`) para os dados reais da operação.
- **Cores/gradiente:** variáveis CSS em `:root` no topo de [`styles.css`](styles.css).
- **Textos e seções:** todo o conteúdo está em `index.html`.

## 🔗 Referências de marca

- Instagram: [@nexfin.systems](https://www.instagram.com/nexfin.systems/)

---

© NexFin Systems.
