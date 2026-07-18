const https = require('https');
const fs = require('fs');

const wbUrl = 'https://api.worldbank.org/v2/country?format=json&per_page=350';
const gitUrl = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';
const outputPath = 'c:\\Users\\Lenovo\\Documents\\World-Explorer\\src\\app\\countries-data.ts';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function merge() {
  try {
    console.log('Fetching datasets...');
    const [wbResponse, gitCountries] = await Promise.all([
      fetchJson(wbUrl),
      fetchJson(gitUrl)
    ]);

    const wbCountries = wbResponse[1];
    
    // Index gitCountries by 2-letter code
    const gitMap = {};
    gitCountries.forEach(c => {
      if (c.cca2) {
        gitMap[c.cca2.toLowerCase()] = c;
      }
    });

    const countriesMap = {};
    wbCountries.forEach((c) => {
      if (c.iso2Code) {
        const codeKey = c.iso2Code.toLowerCase();
        const gitData = gitMap[codeKey] || {};

        // Format currencies
        let currenciesStr = '';
        if (gitData.currencies) {
          currenciesStr = Object.values(gitData.currencies)
            .map(curr => curr.symbol ? `${curr.name} (${curr.symbol})` : curr.name)
            .join(', ');
        }

        // Format languages
        let languagesStr = '';
        if (gitData.languages) {
          languagesStr = Object.values(gitData.languages).join(', ');
        }

        countriesMap[codeKey] = {
          id: c.id,
          iso2Code: c.iso2Code,
          name: c.name,
          region: {
            id: c.region ? c.region.id : '',
            iso2code: c.region ? c.region.iso2code : '',
            value: c.region ? c.region.value : ''
          },
          adminregion: {
            id: c.adminregion ? c.adminregion.id : '',
            iso2code: c.adminregion ? c.adminregion.iso2code : '',
            value: c.adminregion ? c.adminregion.value : ''
          },
          incomeLevel: {
            id: c.incomeLevel ? c.incomeLevel.id : '',
            iso2code: c.incomeLevel ? c.incomeLevel.iso2code : '',
            value: c.incomeLevel ? c.incomeLevel.value : ''
          },
          lendingType: {
            id: c.lendingType ? c.lendingType.id : '',
            iso2code: c.lendingType ? c.lendingType.iso2code : '',
            value: c.lendingType ? c.lendingType.value : ''
          },
          capitalCity: c.capitalCity || (gitData.capital && gitData.capital.length > 0 ? gitData.capital[0] : ''),
          longitude: c.longitude || (gitData.latlng && gitData.latlng.length > 1 ? gitData.latlng[1].toString() : ''),
          latitude: c.latitude || (gitData.latlng && gitData.latlng.length > 0 ? gitData.latlng[0].toString() : ''),
          // Merged fields
          flag: gitData.flag || '',
          flagUrl: `https://flagcdn.com/w320/${codeKey}.png`,
          currencies: currenciesStr,
          languages: languagesStr,
          subregion: gitData.subregion || '',
          area: gitData.area || 0,
          borders: gitData.borders || []
        };
      }
    });

    const fileContent = `export interface CountryData {
  id: string;
  iso2Code: string;
  name: string;
  region: { id: string; iso2code: string; value: string };
  adminregion: { id: string; iso2code: string; value: string };
  incomeLevel: { id: string; iso2code: string; value: string };
  lendingType: { id: string; iso2code: string; value: string };
  capitalCity: string;
  longitude: string;
  latitude: string;
  // Merged fields
  flag: string;
  flagUrl: string;
  currencies: string;
  languages: string;
  subregion: string;
  area: number;
  borders: string[];
}

export const COUNTRIES_DATA: Record<string, CountryData> = ${JSON.stringify(countriesMap, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);
    console.log('Successfully regenerated merged countries-data.ts with', Object.keys(countriesMap).length, 'countries.');

  } catch (err) {
    console.error('Error during merge process:', err);
  }
}

merge();
