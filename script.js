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

  /* Contact form — composes an e-mail (no backend needed) */
  var CONTACT_EMAIL = "contato@nexfin.systems"; // TODO: troque pelo seu e-mail real ou plugue um serviço de formulário
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
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setNote("Informe um e-mail válido.", "err");
        return;
      }

      var subject = "Contato via site — " + nome + (empresa ? " (" + empresa + ")" : "");
      var body =
        "Nome: " + nome + "\n" +
        "Empresa: " + (empresa || "-") + "\n" +
        "E-mail: " + email + "\n\n" +
        "Mensagem:\n" + (mensagem || "-");

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setNote("Abrindo seu e-mail… um especialista responderá em breve.", "ok");
      form.reset();
    });
  }

  function setNote(msg, type) {
    if (!note) return;
    note.textContent = msg;
    note.className = "cta__note " + (type || "");
  }
})();
