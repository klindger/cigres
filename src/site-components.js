const componentStyles = `
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 28px rgba(15, 46, 27, 0.06);
  }

  .container-wide {
    width: min(100% - 32px, 1380px);
    margin: 0 auto;
  }

  .navbar {
    padding: 0;
  }

  .navbar > .container-wide {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 112px;
    gap: 28px;
  }

  .navbar-brand {
    margin: 0;
    padding: 0;
    flex: 0 0 auto;
  }

  .brand-image {
    width: clamp(220px, 23vw, 328px);
    height: auto;
  }

  .navbar-toggler {
    border: 0;
    padding: 0.35rem 0.55rem;
    color: var(--verde-900, #0a5a34);
    box-shadow: none;
  }

  .navbar-toggler:focus {
    box-shadow: none;
  }

  .navbar-collapse {
    flex-grow: 0;
    align-items: center;
    gap: 30px;
  }

  .navbar-nav {
    gap: 14px;
    align-items: center;
  }

  .nav-link {
    position: relative;
    padding: 0.4rem 0.35rem;
    color: var(--texto, #1e2b24);
    font-size: 1rem;
    font-weight: 500;
    transition: color 0.25s ease;
  }

  .nav-link:hover,
  .nav-link:focus,
  .nav-link.active {
    color: var(--verde-800, #0d6a3a);
  }

  .nav-link.active::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 42px;
    height: 2px;
    border-radius: 999px;
    transform: translateX(-50%);
    background: var(--verde-500, #289345);
  }

  .footer {
    position: relative;
    width: 100vw;
    min-height: 240px;
    margin-top: -94px;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
    color: #fff;
    background: #fff;
  }

  .footer-wave {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    object-fit: fill;
    object-position: center bottom;
    pointer-events: none;
    user-select: none;
  }

  .footer-wave-label-0 {
    z-index: 0;
  }

  .footer-wave-label-1 {
    z-index: 1;
  }

  .footer-wave-label-2 {
    z-index: 2;
  }

  .footer-content {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    min-height: 240px;
    padding: 128px 20px 24px;
    text-align: center;
  }

  .footer-content p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.65;
    font-weight: 500;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.16);
  }

  @media (max-width: 991px) {
    .site-header {
      position: relative;
    }

    .navbar > .container-wide {
      min-height: 94px;
      padding: 18px 0;
    }

    .navbar-collapse {
      padding: 20px 0 6px;
    }

    .navbar-nav {
      align-items: flex-start;
    }

    .nav-link.active::after {
      left: 0;
      transform: none;
      bottom: -4px;
    }
  }

  @media (max-width: 767px) {
    .footer {
      min-height: 190px;
      margin-top: -64px;
    }

    .footer-content {
      min-height: 190px;
      padding: 98px 16px 22px;
    }
  }
`;

function injectComponentStyles() {
  if (document.getElementById("site-components-style")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "site-components-style";
  style.textContent = componentStyles;
  document.head.append(style);
}

function navLink(label, href, key, active) {
  const activeClass = key === active ? " active" : "";
  return `<li class="nav-item"><a class="nav-link${activeClass}" href="${href}">${label}</a></li>`;
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    injectComponentStyles();

    const active = this.getAttribute("active") || "";

    this.innerHTML = `
      <header class="site-header">
        <nav class="navbar navbar-expand-lg">
          <div class="container-wide">
            <a class="navbar-brand" href="/" aria-label="CIGRES">
              <img src="/src/logoextensa.png" class="brand-image" alt="CIGRES - Consórcio de Gestão de Resíduos Sólidos de Alagoas">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir menu">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="menuPrincipal">
              <ul class="navbar-nav mb-3 mb-lg-0">
                ${navLink("Início", "/", "home", active)}
                ${navLink("O Consórcio", "/consorcio", "consorcio", active)}
                ${navLink("Municípios", "/municipios", "municipios", active)}
                ${navLink("Serviços", "/#servicos", "servicos", active)}
                ${navLink("Transparência", "/transparencia", "transparencia", active)}
                ${navLink("Notícias", "/#noticias", "noticias", active)}
                ${navLink("Contato", "/#contato", "contato", active)}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    injectComponentStyles();

    this.innerHTML = `
      <footer class="footer">
        <img class="footer-wave footer-wave-label-0" src="/src/wave%20(2).svg" alt="" aria-hidden="true">
        <img class="footer-wave footer-wave-label-1" src="/src/wave%20(1).svg" alt="" aria-hidden="true">
        <img class="footer-wave footer-wave-label-2" src="/src/wave.svg" alt="" aria-hidden="true">

        <div class="footer-content">
          <p>
            CIGRES - Consórcio de Gestão de Resíduos Sólidos de Alagoas<br>
            © 2024 Todos os direitos reservados.
          </p>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
