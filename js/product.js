const t = {
  en: {
    eyebrow: "Our Products",
    title: "Premium Products<br>From Indonesia",
    desc: "Carefully sourced, expertly processed, and prepared for international markets.",
    label: "Product Catalogue",
    heading: "Our Finest Products",

    onionLabel: "Onions",
    onionTitle: "Premium Indonesian Onions",
    onionDesc:
      "Selected Indonesian onions, carefully sorted and prepared for wholesale and food-service customers.",

    fishLabel: "Fishes",
    fishTitle: "Premium Seafood",
    fishDesc:
      "Carefully sourced fresh and frozen seafood from Indonesia, prepared to meet international quality standards.",

    all: "All",
    fish: "Fish",
    shellfish: "Shellfish",

    tuna:
      "Sashimi-grade tuna with clean taste and delicate texture. Available fresh and frozen.",

    snapper:
      "Premium WGGS and fillet, carefully processed and prepared for export customers.",

    octopus:
      "Frozen octopus flower, baby octopus and other premium cuts prepared for worldwide customers.",

    mahi:
      "Firm white flesh, mild flavor, and carefully trimmed cuts for food-service applications.",

    king:
      "Meaty white flesh with rich flavor, suitable for grilling, frying, baking and food service.",

    grouper:
      "Firm, moist white flesh with delicate flavor. Available as hand-trimmed fillet.",

    quote: "Add to Cart",

    ctaey: "Ready to Order?",
    ctatitle: "Let's Build Your Supply.",
    ctadesc:
      "Tell us your product, quantity, specification and destination. Our team will help prepare the right supply solution.",
    contact: "Get in Touch",
  },

  id: {
    eyebrow: "Produk Kami",
    title: "Produk Premium<br>Dari Indonesia",
    desc:
      "Bersumber secara bertanggung jawab, diproses secara profesional, dan disiapkan untuk pasar internasional.",
    label: "Katalog Produk",
    heading: "Produk Terbaik Kami",

    onionLabel: "Bawang",
    onionTitle: "Bawang Indonesia Premium",
    onionDesc:
      "Bawang Indonesia pilihan yang disortir dan disiapkan untuk kebutuhan wholesale dan food-service.",

    fishLabel: "Ikan",
    fishTitle: "Seafood Premium",
    fishDesc:
      "Seafood fresh dan frozen pilihan dari Indonesia yang disiapkan untuk memenuhi standar kualitas internasional.",

    all: "Semua",
    fish: "Ikan",
    shellfish: "Seafood",

    tuna:
      "Tuna grade sashimi dengan rasa bersih dan tekstur lembut. Tersedia fresh dan frozen.",

    snapper:
      "WGGS dan fillet premium yang diproses dengan teliti untuk kebutuhan ekspor.",

    octopus:
      "Gurita flower beku, baby octopus, dan potongan premium lainnya untuk pelanggan global.",

    mahi:
      "Daging putih yang firm dengan rasa ringan dan potongan yang diproses untuk food-service.",

    king:
      "Daging putih yang tebal dengan rasa kaya, cocok untuk grill, goreng, panggang, dan food-service.",

    grouper:
      "Daging putih yang lembut dan firm dengan rasa delicat. Tersedia dalam bentuk fillet.",

    quote: "Tambah ke Keranjang",

    ctaey: "Siap Memesan?",
    ctatitle: "Mari Bangun Pasokan Anda.",
    ctadesc:
      "Beritahu produk, jumlah, spesifikasi, dan tujuan pengiriman Anda. Tim kami siap membantu.",
    contact: "Hubungi Kami",
  },
};

const PRODUCT_DESC_LIMIT = 14;

function escapeProductText(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderProductDescriptions() {
    const lang = localStorage.getItem("product-lang") || "en";
    const readMore = lang === "id" ? "Baca Selengkapnya" : "Read More";
    const readLess = lang === "id" ? "Lebih Sedikit" : "Read Less";

    document.querySelectorAll("[data-product-desc-en]").forEach(p => {
        const fullText = lang === "id" ? p.dataset.productDescId : p.dataset.productDescEn;
        const words = fullText.trim().split(/\s+/);
        const expanded = p.dataset.expanded === "true";

        if (words.length <= PRODUCT_DESC_LIMIT || expanded) {
            p.innerHTML = escapeProductText(fullText);
            if (words.length > PRODUCT_DESC_LIMIT) {
                p.insertAdjacentHTML("beforeend", ` <button type="button" class="read-more-btn" onclick="toggleProductDescription(this)">${readLess}</button>`);
            }
        } else {
            p.innerHTML = escapeProductText(words.slice(0, PRODUCT_DESC_LIMIT).join(" ")) + `… <button type="button" class="read-more-btn" onclick="toggleProductDescription(this)">${readMore}</button>`;
        }
    });
}

function toggleProductDescription(button) {
    const p = button.closest("[data-product-desc-en]");
    if (!p) return;
    p.dataset.expanded = p.dataset.expanded !== "true" ? "true" : "false";
    renderProductDescriptions();
}

function openPreview(el) {
    const card = el.closest(".product");
    const titleEl = card?.querySelector("[data-product-name-en]");
    const descEl = card?.querySelector("[data-product-desc-en]");
    const lang = localStorage.getItem("product-lang") || "en";
    const title = titleEl ? (lang === "id" ? titleEl.dataset.productNameId : titleEl.dataset.productNameEn) : "Product";
    const desc = descEl ? (lang === "id" ? descEl.dataset.productDescId : descEl.dataset.productDescEn) : "";
    const modalImg = document.getElementById("previewImage");

    modalImg.src = el.dataset.image;
    modalImg.alt = title;
    document.getElementById("previewTitle").innerText = title;
    document.getElementById("previewDescription").innerText = desc;
}
function setLanguage(l) { setLang(l); }

function setLang(l) {
    document.querySelectorAll("[data-k]").forEach(e => e.innerHTML = t[l][e.dataset.k]);
    document.querySelectorAll("[data-cart-add-label]").forEach(e => e.innerText = t[l].quote);
    document.querySelectorAll(".lang-switch button").forEach(btn => {
        btn.classList.toggle("active", btn.id.endsWith(l.toUpperCase()));
    });
    localStorage.setItem("product-lang", l);
    document.querySelectorAll(".load-more-btn").forEach(button => {
        updateLoadMoreButton(button.dataset.category, button);
    });

    const nameLabel = document.querySelector('label[for="customerName"]');
    const noteLabel = document.querySelector('label[for="customerNote"]');
    const nameInput = document.getElementById("customerName");
    const noteInput = document.getElementById("customerNote");

    if (nameLabel) nameLabel.innerText = l === "id" ? "Nama / Perusahaan" : "Name / Company";
    if (noteLabel) noteLabel.innerText = l === "id" ? "Catatan" : "Notes";
    if (nameInput) nameInput.placeholder = l === "id" ? "Nama atau perusahaan Anda" : "Your name or company";
    if (noteInput) noteInput.placeholder = l === "id"
        ? "Spesifikasi, tujuan pengiriman, dll."
        : "Specification, destination, etc.";


    document.querySelectorAll("[data-product-name-en]").forEach(e => { e.innerText = l === "id" ? e.dataset.productNameId : e.dataset.productNameEn; });
    document.querySelectorAll("[data-product-desc-en]").forEach(e => { e.innerText = l === "id" ? e.dataset.productDescId : e.dataset.productDescEn; e.dataset.expanded = "false"; });
    renderProductDescriptions();
    document.querySelectorAll("[data-cart-nav-label]").forEach(e => e.textContent = l === "id" ? "Keranjang" : "Cart");
    updateCartCount();
    renderCart();
}
function filterProducts(cat, b) { document.querySelectorAll(".filter button").forEach(x => x.classList.remove("active")); b.classList.add("active"); document.querySelectorAll(".product-item").forEach(x => x.style.display = cat === "all" || x.classList.contains(cat) ? "" : "none") }
setLang(localStorage.getItem("product-lang") || "en");
initLoadMore();
renderProductDescriptions();