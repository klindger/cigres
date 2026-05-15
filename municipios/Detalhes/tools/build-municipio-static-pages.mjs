import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const detalhesDir = path.resolve(__dirname, '..');
const pagesDir = path.join(detalhesDir, 'pages');
const dataPath = path.join(detalhesDir, 'Componentes', 'Data', 'dados-municipios.json');

const pages = [
  { code: '2700706', route: 'Batalha' },
  { code: '2700904', route: 'Belo-Monte' },
  { code: '2701209', route: 'Cacimbinhas' },
  { code: '2701803', route: 'Carneiros' },
  { code: '2702504', route: 'Dois-Riachos' },
  { code: '2703403', route: 'Jacare-Dos-Homens' },
  { code: '2703700', route: 'Jaramataia' },
  { code: '2704401', route: 'Major-Isidoro' },
  { code: '2704609', route: 'Maravilha' },
  { code: '2705408', route: 'Monteiropolis' },
  { code: '2705705', route: 'Olho-dAgua-das-Flores' },
  { code: '2706000', route: 'Olivenca' },
  { code: '2706208', route: 'Palestina' },
  { code: '2706406', route: 'Pao-de-Acucar' },
  { code: '2708006', route: 'Santana-do-Ipanema' },
  { code: '2708402', route: 'Sao-Jose-da-Tapera' },
  { code: '2708956', route: 'Senador-Rui-Palmeira' },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildMunicipioPage({ code, nome }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(nome)} | CIGRES</title>
  <meta name="description" content="Apresentação institucional de ${escapeHtml(nome)}.">

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="/municipios/Detalhes/Componentes/style.css">

  <script defer src="/src/componentes/site-components.js"></script>
  <script defer src="/municipios/Detalhes/Componentes/page-component.js"></script>
</head>
<body>
  <div class="page-shell">
    <site-header active="municipios"></site-header>

    <municipio-detalhe-page codigo="${escapeHtml(code)}"></municipio-detalhe-page>

    <site-footer></site-footer>
  </div>
</body>
</html>
`;
}

async function main() {
  const municipios = JSON.parse(await readFile(dataPath, 'utf8'));
  const byCode = new Map(municipios.map((item) => [item.codigo, item]));

  for (const page of pages) {
    const municipio = byCode.get(page.code);
    if (!municipio) {
      throw new Error(`Município não encontrado na base: ${page.code}`);
    }

    const dir = path.join(pagesDir, page.route);
    await mkdir(dir, { recursive: true });

    const html = buildMunicipioPage({
      code: page.code,
      nome: municipio.nome,
    });

    await writeFile(path.join(dir, 'index.html'), html, 'utf8');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
