const DEFAULT_PREFEITO_IMAGE = '/municipios/Detalhes/Componentes/assets/boneco.svg';
const MUNICIPIO_DATA_URL = '/municipios/Detalhes/Componentes/Data/dados-municipios.json';

let municipioDataPromise;

function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function valueOrFallback(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

async function loadMunicipioData() {
  if (!municipioDataPromise) {
    municipioDataPromise = fetch(MUNICIPIO_DATA_URL, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados dos municípios.');
        }

        return response.json();
      });
  }

  return municipioDataPromise;
}

class MunicipioDetalhePage extends HTMLElement {
  static get observedAttributes() {
    return [
      'codigo',
      'nome',
      'descricao',
      'website',
      'prefeito',
      'telefone',
      'email',
      'endereco',
      'prefeito-src',
      'prefeito-alt',
      'emblema-src',
      'emblema-alt',
    ];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    const codigo = valueOrFallback(this.getAttribute('codigo'), '');

    if (codigo) {
      this.renderFromCode(codigo);
      return;
    }

    this.renderFromAttributes();
  }

  async renderFromCode(codigo) {
    const renderToken = Symbol('municipio-render');
    this._renderToken = renderToken;

    try {
      const municipios = await loadMunicipioData();
      if (this._renderToken !== renderToken) {
        return;
      }

      const municipio = municipios.find((item) => item.codigo === codigo);
      if (!municipio) {
        this.renderFromAttributes();
        return;
      }

      this.renderMunicipio(municipio);
    } catch (error) {
      console.error(error);
      if (this._renderToken === renderToken) {
        this.renderFromAttributes();
      }
    }
  }

  renderFromAttributes() {
    this.renderMunicipio({
      nome: valueOrFallback(this.getAttribute('nome'), 'Município'),
      descricao: valueOrFallback(this.getAttribute('descricao'), ''),
      website: valueOrFallback(this.getAttribute('website'), ''),
      prefeito: valueOrFallback(this.getAttribute('prefeito'), 'Nome do prefeito a ser informado.'),
      telefone: valueOrFallback(this.getAttribute('telefone'), 'Dados a serem informados.'),
      email: valueOrFallback(this.getAttribute('email'), 'Dados a serem informados.'),
      endereco: valueOrFallback(this.getAttribute('endereco'), 'Dados a serem informados.'),
      prefeito_src: valueOrFallback(this.getAttribute('prefeito-src'), DEFAULT_PREFEITO_IMAGE),
      prefeito_alt: valueOrFallback(this.getAttribute('prefeito-alt'), `Imagem padrão de prefeito de ${valueOrFallback(this.getAttribute('nome'), 'Município')}`),
      emblema_src: valueOrFallback(this.getAttribute('emblema-src'), ''),
      emblema_alt: valueOrFallback(this.getAttribute('emblema-alt'), `Símbolo de ${valueOrFallback(this.getAttribute('nome'), 'Município')}`),
    });
  }

  renderMunicipio(municipio) {
    const nome = valueOrFallback(municipio.nome, 'Município');
    const descricao = valueOrFallback(municipio.descricao, '');
    const website = valueOrFallback(municipio.website || municipio.prefeitura, '');
    const prefeito = valueOrFallback(municipio.prefeito, 'Nome do prefeito a ser informado.');
    const telefone = valueOrFallback(municipio.telefone, 'Dados a serem informados.');
    const email = valueOrFallback(municipio.email, 'Dados a serem informados.');
    const endereco = valueOrFallback(municipio.endereco, 'Dados a serem informados.');
    const prefeitoSrc = valueOrFallback(municipio.prefeito_src, DEFAULT_PREFEITO_IMAGE);
    const prefeitoAlt = valueOrFallback(
      municipio.prefeito_alt,
      `Imagem padrão de prefeito de ${nome}`
    );
    const emblemaSrc = valueOrFallback(municipio.emblema_src, '');
    const emblemaAlt = valueOrFallback(municipio.emblema_alt, `Símbolo de ${nome}`);

    this.innerHTML = `
      <main class="municipio-detalhe-page">
        <section class="municipio-detalhe-section">
          <div class="container-wide">
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
              <a href="/">Início</a>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
              <a href="/municipios/">Municípios</a>
              <i class="bi bi-chevron-right" aria-hidden="true"></i>
              <span>${escapeAttr(nome)}</span>
            </nav>

            <div class="hero-grid">
              <div class="detail-main-column">
                <div class="detail-header">
                  <h1>${escapeAttr(nome)}</h1>
                  ${descricao ? `<p>${escapeAttr(descricao)}</p>` : ''}
                </div>

                <div class="details-stack">
                  <section class="detail-section">
                    <span class="eyebrow">Prefeito</span>
                    <p class="role-label">${escapeAttr(prefeito).replaceAll('\n', '<br>')}</p>
                    <figure class="prefeito-card">
                      <img class="prefeito-image" src="${escapeAttr(prefeitoSrc)}" alt="${escapeAttr(prefeitoAlt)}">
                    </figure>
                  </section>

                  <section class="detail-section">
                    <span class="eyebrow">Informações oficiais</span>
                    <h2>Contato</h2>
                    <dl class="contact-list">
                      <div>
                        <dt><i class="bi bi-telephone"></i> Telefone</dt>
                        <dd>${escapeAttr(telefone).replaceAll('\n', '<br>')}</dd>
                      </div>
                      <div>
                        <dt><i class="bi bi-envelope"></i> E-mail</dt>
                        <dd>${escapeAttr(email).replaceAll('\n', '<br>')}</dd>
                      </div>
                      <div>
                        <dt><i class="bi bi-globe2"></i> Site oficial</dt>
                        <dd>
                          ${
                            website
                              ? `<a class="official-link" href="${escapeAttr(website)}" target="_blank" rel="noopener noreferrer">${escapeAttr(website)}</a>`
                              : 'Dados a serem informados.'
                          }
                        </dd>
                      </div>
                    </dl>

                    <div class="section-divider"></div>

                    <h2>Endereço</h2>
                    <p>${escapeAttr(endereco).replaceAll('\n', '<br>')}</p>
                  </section>
                </div>
              </div>

              ${
                emblemaSrc
                  ? `<aside class="identity-card">
                      <span class="identity-accent" aria-hidden="true"></span>
                      <div class="identity-frame">
                        <img class="identity-image" src="${escapeAttr(emblemaSrc)}" alt="${escapeAttr(emblemaAlt)}">
                      </div>
                    </aside>`
                  : `<aside class="identity-card identity-card--placeholder" aria-label="Brasão ou bandeira indisponível">
                      <div class="identity-frame identity-frame--placeholder">
                        <span class="placeholder-na">N/A</span>
                      </div>
                    </aside>`
              }
            </div>
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define('municipio-detalhe-page', MunicipioDetalhePage);
