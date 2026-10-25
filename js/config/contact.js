(function (global) {
  const CONTACT = Object.freeze({
    whatsappDisplay: "+62 857-1312-5762",
    whatsappNumber: "6285713125762",
    whatsappBase: "https://wa.me/6285713125762",
    email: "sales@lacarafoodindonesia.com"
  });

  function buildWhatsAppLink(message) {
    return message
      ? `${CONTACT.whatsappBase}?text=${encodeURIComponent(message)}`
      : CONTACT.whatsappBase;
  }

  global.CONTACT = CONTACT;
  global.buildWhatsAppLink = buildWhatsAppLink;

  function applyContactLinks() {
    document.querySelectorAll("[data-whatsapp-message]").forEach(function (link) {
      link.href = buildWhatsAppLink(link.dataset.whatsappMessage);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Chat on WhatsApp at ${CONTACT.whatsappDisplay}`);
    });

    document.querySelectorAll("[data-contact-whatsapp-display]").forEach(function (link) {
      link.href = buildWhatsAppLink();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Chat on WhatsApp at ${CONTACT.whatsappDisplay}`);
      const label = link.querySelector("[data-contact-number]");
      if (label) label.textContent = CONTACT.whatsappDisplay;
    });

    document.querySelectorAll("[data-contact-phone]").forEach(function (link) {
      link.href = `tel:+${CONTACT.whatsappNumber}`;
      link.textContent = CONTACT.whatsappDisplay;
    });

    document.querySelectorAll("[data-contact-email]").forEach(function (link) {
      link.href = `mailto:${CONTACT.email.toLowerCase()}`;
      link.textContent = CONTACT.email;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyContactLinks, { once: true });
  } else {
    applyContactLinks();
  }
})(window);
