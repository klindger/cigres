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
const breadcrumbEl = document.getElementById('breadcrumbMunicipio');
const descricaoEl = document.getElementById('municipioDescricao');
const siteInfoEl = document.getElementById('siteMunicipioInfo');
const prefeitoNomeEl = document.getElementById('prefeitoNome');
const enderecoEl = document.getElementById('prefeituraEndereco');
const emailEl = document.getElementById('prefeituraEmailInfo');
const telefoneEl = document.getElementById('prefeituraTelefoneInfo');
const marcaEl = document.getElementById('municipioMarca');

function getMunicipioId() {
  return new URLSearchParams(window.location.search).get('id');
}

function fillText(element, value, fallback) {
  element.textContent = value && value.trim() ? value.trim() : fallback;
}

function renderSiteInfo(municipio) {
  const website = municipio.website || municipio.prefeitura;

  if (!website) {
    siteInfoEl.textContent = 'Site em atualização.';
    return;
  }

  siteInfoEl.innerHTML = '';

  const link = document.createElement('a');
  link.href = website;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'official-link';
  link.textContent = website;

  siteInfoEl.appendChild(link);
}

function getPrefeitoNome(municipio) {
  return municipio.prefeito && municipio.prefeito.trim()
    ? municipio.prefeito.trim()
    : '-';
}

function renderMissing() {
  document.title = 'Município não encontrado | CIGRES';
  nomeEl.textContent = 'Município não encontrado';
  breadcrumbEl.textContent = 'Indisponível';
  descricaoEl.textContent = 'Não foi possível localizar os dados desse município na base local.';
  fillText(prefeitoNomeEl, '', '-');
  fillText(enderecoEl, '', 'Endereço em atualização.');
  fillText(emailEl, '', 'E-mail em atualização.');
  fillText(telefoneEl, '', 'Telefone em atualização.');
  marcaEl.src = '/src/assets/logo.png';
  marcaEl.alt = 'Brasão indisponível';
  siteInfoEl.textContent = 'Site em atualização.';
}

async function loadMunicipioData() {
  const response = await fetch('/municipios/Detalhes/Componentes/Data/dados-municipios.json');

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
    breadcrumbEl.textContent = municipio.nome;
    descricaoEl.textContent = municipio.descricao || '';
    fillText(prefeitoNomeEl, getPrefeitoNome(municipio), '-');
    fillText(enderecoEl, municipio.endereco, 'Endereço em atualização.');
    fillText(emailEl, municipio.email, 'E-mail em atualização.');
    fillText(telefoneEl, municipio.telefone, 'Telefone em atualização.');
    renderSiteInfo(municipio);

    marcaEl.src = BRASOES_MUNICIPIOS[municipio.codigo] || '/src/assets/logo.png';
    marcaEl.alt = `Brasão de ${municipio.nome}`;
  } catch (error) {
    console.error(error);
    renderMissing();
  }
}

document.addEventListener('DOMContentLoaded', initMunicipioPage);
