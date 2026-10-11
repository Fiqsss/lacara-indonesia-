(function () {
  const path = window.location.pathname.toLowerCase();
  const isProductPage = path.endsWith("/product.html");
  const page = isProductPage
    ? "products"
    : window.location.hash === "#about"
      ? "about"
      : window.location.hash === "#contact"
        ? "contact"
        : "home";
  const base = new URL("../../", document.currentScript.src);
  const logo = new URL("img/logo/logo.png", base).href;
  const home = new URL("index.html", base).href;
  const about = new URL("index.html#about", base).href;
  const products = new URL("product.html", base).href;
  const contact = new URL("index.html#contact", base).href;

  document.querySelectorAll(".navbar, .mobile-nav, .mobile-nav-backdrop").forEach(function (element) {
    element.remove();
  });

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top theme-light" aria-label="Main navigation">
      <div class="container py-2">
        <a class="navbar-brand brand logo-brand" href="${home}" aria-label="LACARA Indonesia">
          <img src="${logo}" width="180" height="44" alt="LACARA Indonesia">
        </a>
        <button class="navbar-toggler border-0 shadow-none" type="button" aria-controls="mobileNav" aria-expanded="false" aria-label="Open menu">
          <i class="bi bi-list fs-2" aria-hidden="true"></i>
        </button>
        <div class="collapse navbar-collapse" id="desktopNav">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li class="nav-item"><a class="nav-link${page === "home" ? " active" : ""}" href="${home}"${page === "home" ? ' aria-current="page"' : ""}>Home</a></li>
            <li class="nav-item"><a class="nav-link${page === "about" ? " active" : ""}" href="${about}"${page === "about" ? ' aria-current="page"' : ""}>About Us</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle${page === "products" ? " active" : ""}" href="${products}" role="button" data-bs-toggle="dropdown" aria-expanded="false"${page === "products" ? ' aria-current="page"' : ""}>Products</a>
              <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                <li><a class="dropdown-item" href="${products}#bawang">Food Products &amp; Condiments</a></li>
                <li><a class="dropdown-item" href="${products}#fishes">Seafood &amp; Marine Products</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link${page === "contact" ? " active" : ""}" href="${contact}"${page === "contact" ? ' aria-current="page"' : ""}>Contact Us</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="offcanvas offcanvas-end mobile-nav theme-light" id="mobileNav" tabindex="-1" aria-hidden="true" aria-label="Mobile navigation">
      <div class="offcanvas-header">
        <a class="brand logo-brand mobile-logo-brand" href="${home}" aria-label="LACARA Indonesia"><img src="${logo}" width="180" height="44" alt="LACARA Indonesia"></a>
        <button class="btn-close" type="button" aria-label="Close menu"></button>
      </div>
      <div class="offcanvas-body">
        <div class="mobile-menu">
          <a class="${page === "home" ? "active" : ""}" href="${home}">Home</a>
          <a class="${page === "about" ? "active" : ""}" href="${about}">About Us</a>
          <button class="mobile-product-toggle${page === "products" ? " active" : ""}" type="button" aria-expanded="false">
            <span>Products</span><i class="bi bi-chevron-down" aria-hidden="true"></i>
          </button>
          <div class="mobile-product-sub" id="mobileProductSub">
            <a href="${products}#bawang">Food Products &amp; Condiments</a>
            <a href="${products}#fishes">Seafood &amp; Marine Products</a>
          </div>
          <a class="${page === "contact" ? "active" : ""}" href="${contact}">Contact Us</a>
        </div>
      </div>
    </div>
    <div class="mobile-nav-backdrop theme-light" id="mobileNavBackdrop" aria-hidden="true"></div>
  `;
  const header = wrapper.firstElementChild;
  header.dataset.sharedHeader = "true";
  const mobileNav = header.nextElementSibling;
  const backdrop = mobileNav.nextElementSibling;
  document.body.prepend(backdrop);
  document.body.prepend(mobileNav);
  document.body.prepend(header);

  const menuButton = header.querySelector(".navbar-toggler");
  const closeButton = mobileNav.querySelector(".btn-close");
  const productButton = mobileNav.querySelector(".mobile-product-toggle");
  const productSubmenu = mobileNav.querySelector(".mobile-product-sub");

  function closeMenu() {
    mobileNav.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    backdrop.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-nav-open");
  }
  window.closeMobileNav = closeMenu;

  menuButton.addEventListener("click", function () {
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
    backdrop.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("mobile-nav-open", open);
  });
  closeButton.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  productButton.addEventListener("click", function () {
    const expanded = productButton.getAttribute("aria-expanded") !== "true";
    productButton.setAttribute("aria-expanded", String(expanded));
    productButton.classList.toggle("expanded", expanded);
    productSubmenu.classList.toggle("open", expanded);
  });
  mobileNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
})();
