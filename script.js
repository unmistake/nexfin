/* ============================================================
   NexFin Systems — interactions
   ============================================================ */
(function () {
  "use strict";

  /* Current year in footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky nav shadow on scroll */
  var nav = document.querySelector(".nav");
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay") || 0;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, Number(delay));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* FAQ — close others when one opens (accordion behaviour) */
  var faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* Contato — entrega o lead no WhatsApp (com e-mail como alternativa) */
  var CONTACT_EMAIL = "nextfin.systems@gmail.com";

  // WhatsApp que recebe os leads. Somente dígitos, com código do país + DDD.
  // Ex.: Brasil (55) + DDD (11) + número -> "5511999999999".
  // Enquanto estiver vazio, o formulário envia por e-mail.
  var WHATSAPP_NUMBER = "";

  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = (form.nome.value || "").trim();
      var email = (form.email.value || "").trim();
      var empresa = (form.empresa.value || "").trim();
      var mensagem = (form.mensagem.value || "").trim();

      if (!nome || !email) {
        setNote("Preencha nome e e-mail para continuar.", "err");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNote("Informe um e-mail válido.", "err");
        return;
      }

      // Lead formatado como mensagem
      var lead =
        "Olá! Vim pelo site da NexFin 👋\n\n" +
        "*Novo lead*\n" +
        "*Nome:* " + nome + "\n" +
        "*Empresa:* " + (empresa || "-") + "\n" +
        "*E-mail:* " + email + "\n\n" +
        "*Mensagem:*\n" + (mensagem || "-");

      if (WHATSAPP_NUMBER) {
        window.open(
          "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lead),
          "_blank",
          "noopener"
        );
        setNote("Abrindo o WhatsApp com a sua mensagem pronta…", "ok");
      } else {
        var subject = "Novo lead via site — " + nome + (empresa ? " (" + empresa + ")" : "");
        window.location.href =
          "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lead.replace(/\*/g, ""));
        setNote("Abrindo seu e-mail… retornaremos em breve.", "ok");
      }
      form.reset();
    });
  }

  function setNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = "cta__note " + (type || "");
  }
})();
