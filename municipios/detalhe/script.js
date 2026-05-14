const prefeitoPlaceholder = '/municipios/assets/prefeito-placeholder.svg';
const brasaoPlaceholder = '/municipios/assets/brasao-placeholder.svg';

const BRASOES_MUNICIPIOS = {
  '2700706': '/src/assets/batalha.png',
  '2700904': '/src/assets/beloM.png',
  '2701209': '/src/assets/Cacimbinha.avif',
  '2702504': '/src/assets/doisRiachos.png',
  '2703403': '/src/assets/Jacare%CC%81.png',
  '2704401': '/src/assets/majorIzi.png',
  '2704609': '/src/assets/maravilha.jpg',
  '2706406': '/src/assets/paoDA.avif',
  '2708006': '/src/assets/SantanaIpanema.png',
  '2708402': '/src/assets/saoJose.avif',
  '2708956': '/src/assets/senadorRui.png',
};

const nomeEl = document.getElementById('municipioNome');
const descricaoEl = document.getElementById('municipioDescricao');
const siteLinkEl = document.getElementById('siteMunicipioLink');
const mapsLinkEl = document.getElementById('mapsMunicipioLink');
const prefeitoNomeEl = document.getElementById('prefeitoNome');
const prefeitoImagemEl = document.getElementById('prefeitoImagem');
const brasaoImagemEl = document.getElementById('brasaoImagem');
const enderecoEl = document.getElementById('prefeituraEndereco');
const emailEl = document.getElementById('prefeituraEmail');
const telefoneEl = document.getElementById('prefeituraTelefone');

function getMunicipioId() {
  return new URLSearchParams(window.location.search).get('id');
}

function disableLink(element) {
  element.classList.add('disabled');
  element.setAttribute('aria-disabled', 'true');
  element.href = '#';
}

function enableLink(element, href) {
  element.classList.remove('disabled');
  element.setAttribute('aria-disabled', 'false');
  element.href = href;
}

function fillText(element, value, fallback) {
  element.textContent = value && value.trim() ? value.trim() : fallback;
}

function renderMissing() {
  document.title = 'Município não encontrado | CIGRES';
  nomeEl.textContent = 'Município não encontrado';
  descricaoEl.textContent = 'Não foi possível localizar os dados desse município na base local.';
  fillText(prefeitoNomeEl, '', '-');
  fillText(enderecoEl, '', '-');
  fillText(emailEl, '', '-');
  fillText(telefoneEl, '', '-');
  prefeitoImagemEl.src = prefeitoPlaceholder;
  brasaoImagemEl.src = brasaoPlaceholder;
  disableLink(siteLinkEl);
  disableLink(mapsLinkEl);
}

async function loadMunicipioData() {
  const response = await fetch('/municipios/municipios-dados.json');

  if (!response.ok) {
    throw new Error('Não foi possível carregar a base dos municípios.');
  }

  return response.json();
}

async function initMunicipioPage() {
  const municipioId = getMunicipioId();

  if (!municipioId) {
    renderMissing();
    return;
  }

  try {
    const municipios = await loadMunicipioData();
    const municipio = municipios.find((item) => item.codigo === municipioId);

    if (!municipio) {
      renderMissing();
      return;
    }

    document.title = `${municipio.nome} | CIGRES`;
    nomeEl.textContent = municipio.nome;
    descricaoEl.textContent = 'Dados institucionais da prefeitura, contato oficial e localização do município.';
    fillText(prefeitoNomeEl, municipio.prefeito, '-');
    fillText(enderecoEl, municipio.endereco, '-');
    fillText(emailEl, municipio.email, '-');
    fillText(telefoneEl, municipio.telefone, '-');

    prefeitoImagemEl.src = municipio.prefeito_imagem || prefeitoPlaceholder;
    prefeitoImagemEl.alt = municipio.prefeito
      ? `Imagem do prefeito de ${municipio.nome}`
      : `Imagem genérica para ${municipio.nome}`;

    brasaoImagemEl.src = BRASOES_MUNICIPIOS[municipio.codigo] || brasaoPlaceholder;
    brasaoImagemEl.alt = `Brasão de ${municipio.nome}`;

    if (municipio.website || municipio.prefeitura) {
      enableLink(siteLinkEl, municipio.website || municipio.prefeitura);
    } else {
      disableLink(siteLinkEl);
    }

    if (municipio.maps) {
      enableLink(mapsLinkEl, municipio.maps);
    } else {
      disableLink(mapsLinkEl);
    }
  } catch (error) {
    console.error(error);
    renderMissing();
  }
}

document.addEventListener('DOMContentLoaded', initMunicipioPage);
