(function (global) {
  function normalizeText(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function singleLine(value) {
    return normalizeText(value).replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
  }

  function buildQuotationMessage(formData, items, options) {
    const data = formData || {};
    const products = Array.isArray(items) ? items : [];
    const plainText = Boolean(options && options.plainText);
    const company = singleLine(data.company);
    const email = singleLine(data.email);
    const condition = singleLine(data.condition) === "Other"
      ? singleLine(data.conditionOther)
      : singleLine(data.condition);
    const additionalRequirements = normalizeText(data.requirements) || "-";
    const heading = function (text) { return plainText ? text : "*" + text + "*"; };
    const productLines = products.length
      ? products.map(function (item, index) {
        return (index + 1) + ". " + singleLine(item.name) + " (x" + Number(item.qty || 1) + ")";
      })
      : ["-"];
    const lines = [];

    if (plainText) {
      lines.push("From buyer: " + company, "Reply to: " + email, "");
    }

    lines.push(
      heading("REQUEST FOR QUOTATION"),
      "LACARA Indonesia",
      "",
      heading("Buyer Information"),
      "Company / Buyer: " + company,
      "Email: " + email,
      "",
      heading("Products Requested"),
      ...productLines,
      "",
      heading("Order Details"),
      "Condition: " + condition,
      "Quantity: " + singleLine(data.quantity) + " " + singleLine(data.unit),
      "Specifications: " + normalizeText(data.specifications),
      "",
      heading("Shipping"),
      "Destination Type: " + singleLine(data.destinationType),
      "Port / Airport / City: " + singleLine(data.destination),
      "",
      heading("Additional Requirements"),
      additionalRequirements,
      "",
      "Thank you. Please advise availability, pricing, and shipping arrangements."
    );

    return lines.join("\n");
  }

  // TODO: Automatic sending with the buyer as Reply-To requires EmailJS/Formspree or a backend.
  function sendQuotationEmail(data) {
    const recipient = global.CONTACT.email.toLowerCase();
    const subject = "Request for Quotation - " + singleLine(data.company);
    const body = buildQuotationMessage(data, data.items, { plainText: true });
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailto = "mailto:" + recipient + "?subject=" + encodedSubject + "&body=" + encodedBody;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(global.navigator.userAgent);

    return {
      url: isMobile
        ? mailto
        : "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(recipient) +
          "&su=" + encodedSubject + "&body=" + encodedBody,
      mailto: mailto
    };
  }

  global.buildQuotationMessage = buildQuotationMessage;
  global.sendQuotationEmail = sendQuotationEmail;
})(window);
