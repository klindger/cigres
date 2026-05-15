let MUNICIPIOS_ALAGOAS = {};
const MUNICIPIOS_SCRIPT_URL = document.currentScript?.src || new URL('municipios/script.js', document.baseURI).href;
const MUNICIPIOS_BASE_URL = new URL('./', MUNICIPIOS_SCRIPT_URL);
const SITE_BASE_URL = new URL('../', MUNICIPIOS_SCRIPT_URL);

const MUNICIPIO_ROUTES = {
  '2700706': 'Batalha',
  '2700904': 'Belo-Monte',
  '2701209': 'Cacimbinhas',
  '2701803': 'Carneiros',
  '2702504': 'Dois-Riachos',
  '2703403': 'Jacare-Dos-Homens',
  '2703700': 'Jaramataia',
  '2704401': 'Major-Isidoro',
  '2704609': 'Maravilha',
  '2705408': 'Monteiropolis',
  '2705705': 'Olho-dAgua-das-Flores',
  '2706000': 'Olivenca',
  '2706208': 'Palestina',
  '2706406': 'Pao-de-Acucar',
  '2708006': 'Santana-do-Ipanema',
  '2708402': 'Sao-Jose-da-Tapera',
  '2708956': 'Senador-Rui-Palmeira',
};

const MUNICIPIO_COLORS = {
  '2700706': '#5b8f29',
  '2700904': '#0f766e',
  '2701209': '#b45309',
  '2701803': '#7c3aed',
  '2702504': '#c2410c',
  '2703403': '#1d4ed8',
  '2703700': '#be123c',
  '2704401': '#0f4c81',
  '2704609': '#4d7c0f',
  '2705408': '#7e22ce',
  '2705705': '#0369a1',
  '2706000': '#b91c1c',
  '2706208': '#15803d',
  '2706406': '#9a3412',
  '2708006': '#4338ca',
  '2708402': '#a21caf',
  '2708956': '#854d0e',
};

const INACTIVE_STYLE = {
  color: 'rgba(255, 255, 255, 0.72)',
  weight: 0.9,
  fillColor: '#d3ddd6',
  fillOpacity: 0.52,
};

const HOVER_DELAY_MS = 260;

const resetViewButton = document.getElementById('resetViewButton');

let map;
let geojsonLayer;
let initialBounds = null;
let pendingHoverTimeout = null;

function getActiveBounds() {
  const activeLayers = [];

  geojsonLayer.eachLayer((layer) => {
    if (isMunicipioAtivo(layer.feature.properties.codarea)) {
      activeLayers.push(layer);
    }
  });

  return L.featureGroup(activeLayers).getBounds();
}

function isMunicipioAtivo(code) {
  return Boolean(MUNICIPIOS_ALAGOAS[code]);
}

function getPresentationUrl(code) {
  const route = MUNICIPIO_ROUTES[code];
  return route
    ? new URL(`Detalhes/pages/${route}/`, MUNICIPIOS_BASE_URL).href
    : MUNICIPIOS_BASE_URL.href;
}

function getActiveStyle(code) {
  const color = MUNICIPIO_COLORS[code] || '#289345';

  return {
    color: 'rgba(255, 255, 255, 0.86)',
    weight: 1.1,
    fillColor: color,
    fillOpacity: 0.82,
  };
}

function styleFeature(feature) {
  const code = feature.properties.codarea;
  return isMunicipioAtivo(code) ? getActiveStyle(code) : INACTIVE_STYLE;
}

function highlightLayer(layer) {
  layer.setStyle({
    color: '#ffffff',
    weight: 2.1,
    fillOpacity: 0.96,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetLayerStyle(layer) {
  const code = layer.feature.properties.codarea;

  if (!isMunicipioAtivo(code)) {
    layer.setStyle(INACTIVE_STYLE);
    return;
  }

  geojsonLayer.resetStyle(layer);
}

function clearPendingHover() {
  if (pendingHoverTimeout) {
    window.clearTimeout(pendingHoverTimeout);
    pendingHoverTimeout = null;
  }
}

function openPresentation(code) {
  if (!isMunicipioAtivo(code)) {
    return;
  }

  window.open(getPresentationUrl(code), '_blank', 'noopener,noreferrer');
}

function bindMunicipioEvents(feature, layer) {
  const code = feature.properties.codarea;

  if (!isMunicipioAtivo(code)) {
    return;
  }

  const metadata = MUNICIPIOS_ALAGOAS[code];
  layer.bindTooltip(metadata.nome, {
    permanent: true,
    direction: 'center',
    className: 'municipio-label',
  });

  layer.on({
    mouseover: () => {
      geojsonLayer.eachLayer((item) => resetLayerStyle(item));
      highlightLayer(layer);
      clearPendingHover();
      pendingHoverTimeout = window.setTimeout(() => {
        pendingHoverTimeout = null;
      }, HOVER_DELAY_MS);
    },
    mouseout: () => {
      clearPendingHover();
      resetLayerStyle(layer);
    },
    click: () => {
      clearPendingHover();
      openPresentation(code);
    },
  });
}

function createMap() {
  map = L.map('alagoas-map', {
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: false,
    minZoom: 7,
    maxZoom: 11,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    opacity: 0.32,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
}

async function loadGeoJson() {
  const response = await fetch(new URL('alagoas-municipios.geojson', MUNICIPIOS_BASE_URL));

  if (!response.ok) {
    throw new Error('Não foi possível carregar o GeoJSON dos municípios.');
  }

  return response.json();
}

async function loadMunicipiosData() {
  const response = await fetch(new URL('municipios/Detalhes/Componentes/Data/dados-municipios.json', SITE_BASE_URL));

  if (!response.ok) {
    throw new Error('Não foi possível carregar a base dos municípios.');
  }

  const items = await response.json();
  MUNICIPIOS_ALAGOAS = Object.fromEntries(
    items.map((item) => [
      item.codigo,
      {
        nome: item.nome,
        prefeitura: item.website || item.prefeitura || '#',
        route: MUNICIPIO_ROUTES[item.codigo] || null,
      },
    ])
  );
}

async function initMunicipiosMap() {
  try {
    await loadMunicipiosData();
    createMap();
    const geojson = await loadGeoJson();

    geojsonLayer = L.geoJSON(geojson, {
      style: styleFeature,
      onEachFeature: bindMunicipioEvents,
    }).addTo(map);

    initialBounds = getActiveBounds();
    map.fitBounds(initialBounds, { padding: [16, 16] });
    map.zoomIn(1);
    map.setMaxBounds(initialBounds.pad(0.08));
    map.whenReady(() => map.invalidateSize());
  } catch (error) {
    console.error(error);
  }
}

function resetFocusedMunicipio() {
  clearPendingHover();

  if (geojsonLayer) {
    geojsonLayer.eachLayer((layer) => resetLayerStyle(layer));
  }
}

resetViewButton.addEventListener('click', () => {
  if (map && initialBounds) {
    map.fitBounds(initialBounds, { padding: [16, 16] });
  }
});

window.addEventListener('pageshow', () => {
  resetFocusedMunicipio();
});

document.addEventListener('DOMContentLoaded', initMunicipiosMap);
