const fs = require('fs');
const path = require('path');

const mapHtmlPath = path.join(__dirname, '..', 'src', 'app', 'map', 'map.html');
const maritimeHtmlPath = path.join(__dirname, '..', 'src', 'app', 'maritime', 'maritime.html');

console.log('Reading map.html...');
const mapContent = fs.readFileSync(mapHtmlPath, 'utf8');

// Extract all <path d="..." name="..." id="..."/> lines
const pathRegex = /<path\s+d="([^"]+)"\s+name="([^"]+)"\s+id="([^"]+)"\s*\/>/g;
let match;
let countryPaths = [];

while ((match = pathRegex.exec(mapContent)) !== null) {
  const d = match[1];
  const name = match[2].replace(/"/g, '&quot;');
  const nameClean = match[2].replace(/'/g, "\\'");
  const id = match[3];

  countryPaths.push(
    `                    <path d="${d}" name="${name}" id="${id}" class="maritime-country-path" (mouseenter)="onCountryHover('${nameClean}')" (mouseleave)="onCountryLeave()" (click)="selectCountry('${id}', '${nameClean}')" />`
  );
}

console.log(`Extracted ${countryPaths.length} world country vector paths with click & hover listeners!`);

const maritimeContent = fs.readFileSync(maritimeHtmlPath, 'utf8');

// Replace <g class="continents-layer"> block
const continentsBlockRegex = /<!-- DETAILED REAL-TIME SVG WORLD MAP LAYER [\s\S]*?<\/g>/;

const newContinentsBlock = `<!-- DETAILED REAL-TIME SVG WORLD MAP LAYER (256 WORLD COUNTRIES) -->
                <g class="continents-layer">
${countryPaths.join('\n')}
                </g>`;

if (continentsBlockRegex.test(maritimeContent)) {
  const updatedMaritime = maritimeContent.replace(continentsBlockRegex, newContinentsBlock);
  fs.writeFileSync(maritimeHtmlPath, updatedMaritime, 'utf8');
  console.log('Successfully updated interactive SVG world map with country clicks into maritime.html!');
} else {
  console.error('Could not find continents-layer placeholder in maritime.html');
}
