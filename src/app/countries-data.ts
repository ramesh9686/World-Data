export interface CountryData {
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

export const COUNTRIES_DATA: Record<string, CountryData> = {
  "aw": {
    "id": "ABW",
    "iso2Code": "AW",
    "name": "Aruba",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Oranjestad",
    "longitude": "-70.0167",
    "latitude": "12.5167",
    "flag": "🇦🇼",
    "flagUrl": "https://flagcdn.com/w320/aw.png",
    "currencies": "Aruban florin (ƒ)",
    "languages": "Dutch, Papiamento",
    "subregion": "Caribbean",
    "area": 180,
    "borders": []
  },
  "zh": {
    "id": "AFE",
    "iso2Code": "ZH",
    "name": "Africa Eastern and Southern",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zh.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "af": {
    "id": "AFG",
    "iso2Code": "AF",
    "name": "Afghanistan",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Kabul",
    "longitude": "69.1761",
    "latitude": "34.5228",
    "flag": "🇦🇫",
    "flagUrl": "https://flagcdn.com/w320/af.png",
    "currencies": "Afghan afghani (؋)",
    "languages": "Dari, Pashto, Turkmen",
    "subregion": "Southern Asia",
    "area": 652230,
    "borders": [
      "IRN",
      "PAK",
      "TKM",
      "UZB",
      "TJK",
      "CHN"
    ]
  },
  "a9": {
    "id": "AFR",
    "iso2Code": "A9",
    "name": "Africa",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/a9.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "zi": {
    "id": "AFW",
    "iso2Code": "ZI",
    "name": "Africa Western and Central",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zi.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ao": {
    "id": "AGO",
    "iso2Code": "AO",
    "name": "Angola",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Luanda",
    "longitude": "13.242",
    "latitude": "-8.81155",
    "flag": "🇦🇴",
    "flagUrl": "https://flagcdn.com/w320/ao.png",
    "currencies": "Angolan kwanza (Kz)",
    "languages": "Portuguese",
    "subregion": "Middle Africa",
    "area": 1246700,
    "borders": [
      "COG",
      "COD",
      "ZMB",
      "NAM"
    ]
  },
  "al": {
    "id": "ALB",
    "iso2Code": "AL",
    "name": "Albania",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Tirane",
    "longitude": "19.8172",
    "latitude": "41.3317",
    "flag": "🇦🇱",
    "flagUrl": "https://flagcdn.com/w320/al.png",
    "currencies": "Albanian lek (L)",
    "languages": "Albanian",
    "subregion": "Southeast Europe",
    "area": 28748,
    "borders": [
      "MNE",
      "GRC",
      "MKD",
      "UNK"
    ]
  },
  "ad": {
    "id": "AND",
    "iso2Code": "AD",
    "name": "Andorra",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Andorra la Vella",
    "longitude": "1.5218",
    "latitude": "42.5075",
    "flag": "🇦🇩",
    "flagUrl": "https://flagcdn.com/w320/ad.png",
    "currencies": "Euro (€)",
    "languages": "Catalan",
    "subregion": "Southern Europe",
    "area": 468,
    "borders": [
      "FRA",
      "ESP"
    ]
  },
  "1a": {
    "id": "ARB",
    "iso2Code": "1A",
    "name": "Arab World",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/1a.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ae": {
    "id": "ARE",
    "iso2Code": "AE",
    "name": "United Arab Emirates",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Abu Dhabi",
    "longitude": "54.3705",
    "latitude": "24.4764",
    "flag": "🇦🇪",
    "flagUrl": "https://flagcdn.com/w320/ae.png",
    "currencies": "United Arab Emirates dirham (د.إ)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 83600,
    "borders": [
      "OMN",
      "SAU"
    ]
  },
  "ar": {
    "id": "ARG",
    "iso2Code": "AR",
    "name": "Argentina",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Buenos Aires",
    "longitude": "-58.4173",
    "latitude": "-34.6118",
    "flag": "🇦🇷",
    "flagUrl": "https://flagcdn.com/w320/ar.png",
    "currencies": "Argentine peso ($)",
    "languages": "Guaraní, Spanish",
    "subregion": "South America",
    "area": 2780400,
    "borders": [
      "BOL",
      "BRA",
      "CHL",
      "PRY",
      "URY"
    ]
  },
  "am": {
    "id": "ARM",
    "iso2Code": "AM",
    "name": "Armenia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Yerevan",
    "longitude": "44.509",
    "latitude": "40.1596",
    "flag": "🇦🇲",
    "flagUrl": "https://flagcdn.com/w320/am.png",
    "currencies": "Armenian dram (֏)",
    "languages": "Armenian",
    "subregion": "Western Asia",
    "area": 29743,
    "borders": [
      "AZE",
      "GEO",
      "IRN",
      "TUR"
    ]
  },
  "as": {
    "id": "ASM",
    "iso2Code": "AS",
    "name": "American Samoa",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Pago Pago",
    "longitude": "-170.691",
    "latitude": "-14.2846",
    "flag": "🇦🇸",
    "flagUrl": "https://flagcdn.com/w320/as.png",
    "currencies": "United States dollar ($)",
    "languages": "English, Samoan",
    "subregion": "Polynesia",
    "area": 199,
    "borders": []
  },
  "ag": {
    "id": "ATG",
    "iso2Code": "AG",
    "name": "Antigua and Barbuda",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Saint John's",
    "longitude": "-61.8456",
    "latitude": "17.1175",
    "flag": "🇦🇬",
    "flagUrl": "https://flagcdn.com/w320/ag.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 442,
    "borders": []
  },
  "au": {
    "id": "AUS",
    "iso2Code": "AU",
    "name": "Australia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Canberra",
    "longitude": "149.129",
    "latitude": "-35.282",
    "flag": "🇦🇺",
    "flagUrl": "https://flagcdn.com/w320/au.png",
    "currencies": "Australian dollar ($)",
    "languages": "English",
    "subregion": "Australia and New Zealand",
    "area": 7692024,
    "borders": []
  },
  "at": {
    "id": "AUT",
    "iso2Code": "AT",
    "name": "Austria",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Vienna",
    "longitude": "16.3798",
    "latitude": "48.2201",
    "flag": "🇦🇹",
    "flagUrl": "https://flagcdn.com/w320/at.png",
    "currencies": "Euro (€)",
    "languages": "Austro-Bavarian German",
    "subregion": "Central Europe",
    "area": 83871,
    "borders": [
      "CZE",
      "DEU",
      "HUN",
      "ITA",
      "LIE",
      "SVK",
      "SVN",
      "CHE"
    ]
  },
  "az": {
    "id": "AZE",
    "iso2Code": "AZ",
    "name": "Azerbaijan",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Baku",
    "longitude": "49.8932",
    "latitude": "40.3834",
    "flag": "🇦🇿",
    "flagUrl": "https://flagcdn.com/w320/az.png",
    "currencies": "Azerbaijani manat (₼)",
    "languages": "Azerbaijani, Russian",
    "subregion": "Western Asia",
    "area": 86600,
    "borders": [
      "ARM",
      "GEO",
      "IRN",
      "RUS",
      "TUR"
    ]
  },
  "bi": {
    "id": "BDI",
    "iso2Code": "BI",
    "name": "Burundi",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Bujumbura",
    "longitude": "29.3639",
    "latitude": "-3.3784",
    "flag": "🇧🇮",
    "flagUrl": "https://flagcdn.com/w320/bi.png",
    "currencies": "Burundian franc (Fr)",
    "languages": "French, Kirundi",
    "subregion": "Eastern Africa",
    "area": 27834,
    "borders": [
      "COD",
      "RWA",
      "TZA"
    ]
  },
  "b4": {
    "id": "BEA",
    "iso2Code": "B4",
    "name": "East Asia & Pacific (IBRD-only countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "b7": {
    "id": "BEC",
    "iso2Code": "B7",
    "name": "Europe & Central Asia (IBRD-only countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b7.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "be": {
    "id": "BEL",
    "iso2Code": "BE",
    "name": "Belgium",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Brussels",
    "longitude": "4.36761",
    "latitude": "50.8371",
    "flag": "🇧🇪",
    "flagUrl": "https://flagcdn.com/w320/be.png",
    "currencies": "Euro (€)",
    "languages": "German, French, Dutch",
    "subregion": "Western Europe",
    "area": 30528,
    "borders": [
      "FRA",
      "DEU",
      "LUX",
      "NLD"
    ]
  },
  "bj": {
    "id": "BEN",
    "iso2Code": "BJ",
    "name": "Benin",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Porto-Novo",
    "longitude": "2.6323",
    "latitude": "6.4779",
    "flag": "🇧🇯",
    "flagUrl": "https://flagcdn.com/w320/bj.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 112622,
    "borders": [
      "BFA",
      "NER",
      "NGA",
      "TGO"
    ]
  },
  "bf": {
    "id": "BFA",
    "iso2Code": "BF",
    "name": "Burkina Faso",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Ouagadougou",
    "longitude": "-1.53395",
    "latitude": "12.3605",
    "flag": "🇧🇫",
    "flagUrl": "https://flagcdn.com/w320/bf.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 272967,
    "borders": [
      "BEN",
      "CIV",
      "GHA",
      "MLI",
      "NER",
      "TGO"
    ]
  },
  "bd": {
    "id": "BGD",
    "iso2Code": "BD",
    "name": "Bangladesh",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Dhaka",
    "longitude": "90.4113",
    "latitude": "23.7055",
    "flag": "🇧🇩",
    "flagUrl": "https://flagcdn.com/w320/bd.png",
    "currencies": "Bangladeshi taka (৳)",
    "languages": "Bengali",
    "subregion": "Southern Asia",
    "area": 147570,
    "borders": [
      "MMR",
      "IND"
    ]
  },
  "bg": {
    "id": "BGR",
    "iso2Code": "BG",
    "name": "Bulgaria",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Sofia",
    "longitude": "23.3238",
    "latitude": "42.7105",
    "flag": "🇧🇬",
    "flagUrl": "https://flagcdn.com/w320/bg.png",
    "currencies": "Euro (€)",
    "languages": "Bulgarian",
    "subregion": "Southeast Europe",
    "area": 110879,
    "borders": [
      "GRC",
      "MKD",
      "ROU",
      "SRB",
      "TUR"
    ]
  },
  "b1": {
    "id": "BHI",
    "iso2Code": "B1",
    "name": "IBRD countries classified as high income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b1.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "bh": {
    "id": "BHR",
    "iso2Code": "BH",
    "name": "Bahrain",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Manama",
    "longitude": "50.5354",
    "latitude": "26.1921",
    "flag": "🇧🇭",
    "flagUrl": "https://flagcdn.com/w320/bh.png",
    "currencies": "Bahraini dinar (.د.ب)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 765,
    "borders": []
  },
  "bs": {
    "id": "BHS",
    "iso2Code": "BS",
    "name": "Bahamas, The",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Nassau",
    "longitude": "-77.339",
    "latitude": "25.0661",
    "flag": "🇧🇸",
    "flagUrl": "https://flagcdn.com/w320/bs.png",
    "currencies": "Bahamian dollar ($), United States dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 13943,
    "borders": []
  },
  "ba": {
    "id": "BIH",
    "iso2Code": "BA",
    "name": "Bosnia and Herzegovina",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Sarajevo",
    "longitude": "18.4214",
    "latitude": "43.8607",
    "flag": "🇧🇦",
    "flagUrl": "https://flagcdn.com/w320/ba.png",
    "currencies": "Bosnia and Herzegovina convertible mark (KM)",
    "languages": "Bosnian, Croatian, Serbian",
    "subregion": "Southeast Europe",
    "area": 51209,
    "borders": [
      "HRV",
      "MNE",
      "SRB"
    ]
  },
  "b2": {
    "id": "BLA",
    "iso2Code": "B2",
    "name": "Latin America & the Caribbean (IBRD-only countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "by": {
    "id": "BLR",
    "iso2Code": "BY",
    "name": "Belarus",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Minsk",
    "longitude": "27.5766",
    "latitude": "53.9678",
    "flag": "🇧🇾",
    "flagUrl": "https://flagcdn.com/w320/by.png",
    "currencies": "Belarusian ruble (Br)",
    "languages": "Belarusian, Russian",
    "subregion": "Eastern Europe",
    "area": 207600,
    "borders": [
      "LVA",
      "LTU",
      "POL",
      "RUS",
      "UKR"
    ]
  },
  "bz": {
    "id": "BLZ",
    "iso2Code": "BZ",
    "name": "Belize",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Belmopan",
    "longitude": "-88.7713",
    "latitude": "17.2534",
    "flag": "🇧🇿",
    "flagUrl": "https://flagcdn.com/w320/bz.png",
    "currencies": "Belize dollar ($)",
    "languages": "Belizean Creole, English, Spanish",
    "subregion": "Central America",
    "area": 22966,
    "borders": [
      "GTM",
      "MEX"
    ]
  },
  "b3": {
    "id": "BMN",
    "iso2Code": "B3",
    "name": "Middle East, North Africa, Afghanistan & Pakistan (IBRD only)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b3.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "bm": {
    "id": "BMU",
    "iso2Code": "BM",
    "name": "Bermuda",
    "region": {
      "id": "NAC",
      "iso2code": "XU",
      "value": "North America"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Hamilton",
    "longitude": "-64.706",
    "latitude": "32.3293",
    "flag": "🇧🇲",
    "flagUrl": "https://flagcdn.com/w320/bm.png",
    "currencies": "Bermudian dollar ($)",
    "languages": "English",
    "subregion": "North America",
    "area": 54,
    "borders": []
  },
  "bo": {
    "id": "BOL",
    "iso2Code": "BO",
    "name": "Bolivia",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "La Paz",
    "longitude": "-66.1936",
    "latitude": "-13.9908",
    "flag": "🇧🇴",
    "flagUrl": "https://flagcdn.com/w320/bo.png",
    "currencies": "Bolivian boliviano (Bs.)",
    "languages": "Aymara, Guaraní, Quechua, Spanish",
    "subregion": "South America",
    "area": 1098581,
    "borders": [
      "ARG",
      "BRA",
      "CHL",
      "PRY",
      "PER"
    ]
  },
  "br": {
    "id": "BRA",
    "iso2Code": "BR",
    "name": "Brazil",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Brasilia",
    "longitude": "-47.9292",
    "latitude": "-15.7801",
    "flag": "🇧🇷",
    "flagUrl": "https://flagcdn.com/w320/br.png",
    "currencies": "Brazilian real (R$)",
    "languages": "Portuguese",
    "subregion": "South America",
    "area": 8515767,
    "borders": [
      "ARG",
      "BOL",
      "COL",
      "GUF",
      "GUY",
      "PRY",
      "PER",
      "SUR",
      "URY",
      "VEN"
    ]
  },
  "bb": {
    "id": "BRB",
    "iso2Code": "BB",
    "name": "Barbados",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Bridgetown",
    "longitude": "-59.6105",
    "latitude": "13.0935",
    "flag": "🇧🇧",
    "flagUrl": "https://flagcdn.com/w320/bb.png",
    "currencies": "Barbadian dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 430,
    "borders": []
  },
  "bn": {
    "id": "BRN",
    "iso2Code": "BN",
    "name": "Brunei Darussalam",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Bandar Seri Begawan",
    "longitude": "114.946",
    "latitude": "4.94199",
    "flag": "🇧🇳",
    "flagUrl": "https://flagcdn.com/w320/bn.png",
    "currencies": "Brunei dollar ($), Singapore dollar ($)",
    "languages": "Malay",
    "subregion": "South-Eastern Asia",
    "area": 5765,
    "borders": [
      "MYS"
    ]
  },
  "b6": {
    "id": "BSS",
    "iso2Code": "B6",
    "name": "Sub-Saharan Africa (IBRD-only countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "bt": {
    "id": "BTN",
    "iso2Code": "BT",
    "name": "Bhutan",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Thimphu",
    "longitude": "89.6177",
    "latitude": "27.5768",
    "flag": "🇧🇹",
    "flagUrl": "https://flagcdn.com/w320/bt.png",
    "currencies": "Bhutanese ngultrum (Nu.), Indian rupee (₹)",
    "languages": "Dzongkha",
    "subregion": "Southern Asia",
    "area": 38394,
    "borders": [
      "CHN",
      "IND"
    ]
  },
  "bw": {
    "id": "BWA",
    "iso2Code": "BW",
    "name": "Botswana",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Gaborone",
    "longitude": "25.9201",
    "latitude": "-24.6544",
    "flag": "🇧🇼",
    "flagUrl": "https://flagcdn.com/w320/bw.png",
    "currencies": "Botswana pula (P)",
    "languages": "English, Tswana",
    "subregion": "Southern Africa",
    "area": 582000,
    "borders": [
      "NAM",
      "ZAF",
      "ZMB",
      "ZWE"
    ]
  },
  "c9": {
    "id": "CAA",
    "iso2Code": "C9",
    "name": "Sub-Saharan Africa (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c9.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "cf": {
    "id": "CAF",
    "iso2Code": "CF",
    "name": "Central African Republic",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Bangui",
    "longitude": "21.6407",
    "latitude": "5.63056",
    "flag": "🇨🇫",
    "flagUrl": "https://flagcdn.com/w320/cf.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "French, Sango",
    "subregion": "Middle Africa",
    "area": 622984,
    "borders": [
      "CMR",
      "TCD",
      "COD",
      "COG",
      "SSD",
      "SDN"
    ]
  },
  "ca": {
    "id": "CAN",
    "iso2Code": "CA",
    "name": "Canada",
    "region": {
      "id": "NAC",
      "iso2code": "XU",
      "value": "North America"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Ottawa",
    "longitude": "-75.6919",
    "latitude": "45.4215",
    "flag": "🇨🇦",
    "flagUrl": "https://flagcdn.com/w320/ca.png",
    "currencies": "Canadian dollar ($)",
    "languages": "English, French",
    "subregion": "North America",
    "area": 9984670,
    "borders": [
      "USA"
    ]
  },
  "c4": {
    "id": "CEA",
    "iso2Code": "C4",
    "name": "East Asia and the Pacific (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "b8": {
    "id": "CEB",
    "iso2Code": "B8",
    "name": "Central Europe and the Baltics",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/b8.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "c5": {
    "id": "CEU",
    "iso2Code": "C5",
    "name": "Europe and Central Asia (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c5.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ch": {
    "id": "CHE",
    "iso2Code": "CH",
    "name": "Switzerland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Bern",
    "longitude": "7.44821",
    "latitude": "46.948",
    "flag": "🇨🇭",
    "flagUrl": "https://flagcdn.com/w320/ch.png",
    "currencies": "Swiss franc (Fr.)",
    "languages": "French, Swiss German, Italian, Romansh",
    "subregion": "Western Europe",
    "area": 41284,
    "borders": [
      "AUT",
      "FRA",
      "ITA",
      "LIE",
      "DEU"
    ]
  },
  "jg": {
    "id": "CHI",
    "iso2Code": "JG",
    "name": "Channel Islands",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/jg.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "cl": {
    "id": "CHL",
    "iso2Code": "CL",
    "name": "Chile",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Santiago",
    "longitude": "-70.6475",
    "latitude": "-33.475",
    "flag": "🇨🇱",
    "flagUrl": "https://flagcdn.com/w320/cl.png",
    "currencies": "Chilean peso ($)",
    "languages": "Spanish",
    "subregion": "South America",
    "area": 756102,
    "borders": [
      "ARG",
      "BOL",
      "PER"
    ]
  },
  "cn": {
    "id": "CHN",
    "iso2Code": "CN",
    "name": "China",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Beijing",
    "longitude": "116.286",
    "latitude": "40.0495",
    "flag": "🇨🇳",
    "flagUrl": "https://flagcdn.com/w320/cn.png",
    "currencies": "Chinese yuan (¥)",
    "languages": "Chinese",
    "subregion": "Eastern Asia",
    "area": 9706961,
    "borders": [
      "AFG",
      "BTN",
      "MMR",
      "HKG",
      "IND",
      "KAZ",
      "NPL",
      "PRK",
      "KGZ",
      "LAO",
      "MAC",
      "MNG",
      "PAK",
      "RUS",
      "TJK",
      "VNM"
    ]
  },
  "ci": {
    "id": "CIV",
    "iso2Code": "CI",
    "name": "Cote d'Ivoire",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Yamoussoukro",
    "longitude": "-4.0305",
    "latitude": "5.332",
    "flag": "🇨🇮",
    "flagUrl": "https://flagcdn.com/w320/ci.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 322463,
    "borders": [
      "BFA",
      "GHA",
      "GIN",
      "LBR",
      "MLI"
    ]
  },
  "c6": {
    "id": "CLA",
    "iso2Code": "C6",
    "name": "Latin America and the Caribbean (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "c7": {
    "id": "CME",
    "iso2Code": "C7",
    "name": "Middle East and North Africa (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c7.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "cm": {
    "id": "CMR",
    "iso2Code": "CM",
    "name": "Cameroon",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Yaounde",
    "longitude": "11.5174",
    "latitude": "3.8721",
    "flag": "🇨🇲",
    "flagUrl": "https://flagcdn.com/w320/cm.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "English, French",
    "subregion": "Middle Africa",
    "area": 475442,
    "borders": [
      "CAF",
      "TCD",
      "COG",
      "GNQ",
      "GAB",
      "NGA"
    ]
  },
  "cd": {
    "id": "COD",
    "iso2Code": "CD",
    "name": "Congo, Dem. Rep.",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Kinshasa",
    "longitude": "15.3222",
    "latitude": "-4.325",
    "flag": "🇨🇩",
    "flagUrl": "https://flagcdn.com/w320/cd.png",
    "currencies": "Congolese franc (FC)",
    "languages": "French, Kikongo, Lingala, Tshiluba, Swahili",
    "subregion": "Middle Africa",
    "area": 2344858,
    "borders": [
      "AGO",
      "BDI",
      "CAF",
      "COG",
      "RWA",
      "SSD",
      "TZA",
      "UGA",
      "ZMB"
    ]
  },
  "cg": {
    "id": "COG",
    "iso2Code": "CG",
    "name": "Congo, Rep.",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Brazzaville",
    "longitude": "15.2662",
    "latitude": "-4.2767",
    "flag": "🇨🇬",
    "flagUrl": "https://flagcdn.com/w320/cg.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "French, Kikongo, Lingala",
    "subregion": "Middle Africa",
    "area": 342000,
    "borders": [
      "AGO",
      "CMR",
      "CAF",
      "COD",
      "GAB"
    ]
  },
  "co": {
    "id": "COL",
    "iso2Code": "CO",
    "name": "Colombia",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Bogota",
    "longitude": "-74.082",
    "latitude": "4.60987",
    "flag": "🇨🇴",
    "flagUrl": "https://flagcdn.com/w320/co.png",
    "currencies": "Colombian peso ($)",
    "languages": "Spanish",
    "subregion": "South America",
    "area": 1141748,
    "borders": [
      "BRA",
      "ECU",
      "PAN",
      "PER",
      "VEN"
    ]
  },
  "km": {
    "id": "COM",
    "iso2Code": "KM",
    "name": "Comoros",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Moroni",
    "longitude": "43.2418",
    "latitude": "-11.6986",
    "flag": "🇰🇲",
    "flagUrl": "https://flagcdn.com/w320/km.png",
    "currencies": "Comorian franc (Fr)",
    "languages": "Arabic, French, Comorian",
    "subregion": "Eastern Africa",
    "area": 1862,
    "borders": []
  },
  "cv": {
    "id": "CPV",
    "iso2Code": "CV",
    "name": "Cabo Verde",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Praia",
    "longitude": "-23.5087",
    "latitude": "14.9218",
    "flag": "🇨🇻",
    "flagUrl": "https://flagcdn.com/w320/cv.png",
    "currencies": "Cape Verdean escudo (Esc)",
    "languages": "Portuguese",
    "subregion": "Western Africa",
    "area": 4033,
    "borders": []
  },
  "cr": {
    "id": "CRI",
    "iso2Code": "CR",
    "name": "Costa Rica",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "San Jose",
    "longitude": "-84.0089",
    "latitude": "9.63701",
    "flag": "🇨🇷",
    "flagUrl": "https://flagcdn.com/w320/cr.png",
    "currencies": "Costa Rican colón (₡)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 51100,
    "borders": [
      "NIC",
      "PAN"
    ]
  },
  "c8": {
    "id": "CSA",
    "iso2Code": "C8",
    "name": "South Asia (IFC classification)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/c8.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "s3": {
    "id": "CSS",
    "iso2Code": "S3",
    "name": "Caribbean small states",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/s3.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "cu": {
    "id": "CUB",
    "iso2Code": "CU",
    "name": "Cuba",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Havana",
    "longitude": "-82.3667",
    "latitude": "23.1333",
    "flag": "🇨🇺",
    "flagUrl": "https://flagcdn.com/w320/cu.png",
    "currencies": "Cuban convertible peso ($), Cuban peso ($)",
    "languages": "Spanish",
    "subregion": "Caribbean",
    "area": 109884,
    "borders": []
  },
  "cw": {
    "id": "CUW",
    "iso2Code": "CW",
    "name": "Curacao",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Willemstad",
    "longitude": "-68.933333",
    "latitude": "12.116667",
    "flag": "🇨🇼",
    "flagUrl": "https://flagcdn.com/w320/cw.png",
    "currencies": "Netherlands Antillean guilder (ƒ)",
    "languages": "English, Dutch, Papiamento",
    "subregion": "Caribbean",
    "area": 444,
    "borders": []
  },
  "ky": {
    "id": "CYM",
    "iso2Code": "KY",
    "name": "Cayman Islands",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "George Town",
    "longitude": "-81.3857",
    "latitude": "19.3022",
    "flag": "🇰🇾",
    "flagUrl": "https://flagcdn.com/w320/ky.png",
    "currencies": "Cayman Islands dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 264,
    "borders": []
  },
  "cy": {
    "id": "CYP",
    "iso2Code": "CY",
    "name": "Cyprus",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Nicosia",
    "longitude": "33.3736",
    "latitude": "35.1676",
    "flag": "🇨🇾",
    "flagUrl": "https://flagcdn.com/w320/cy.png",
    "currencies": "Euro (€)",
    "languages": "Greek, Turkish",
    "subregion": "Southern Europe",
    "area": 9251,
    "borders": []
  },
  "cz": {
    "id": "CZE",
    "iso2Code": "CZ",
    "name": "Czechia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Prague",
    "longitude": "14.4205",
    "latitude": "50.0878",
    "flag": "🇨🇿",
    "flagUrl": "https://flagcdn.com/w320/cz.png",
    "currencies": "Czech koruna (Kč)",
    "languages": "Czech, Slovak",
    "subregion": "Central Europe",
    "area": 78865,
    "borders": [
      "AUT",
      "DEU",
      "POL",
      "SVK"
    ]
  },
  "d4": {
    "id": "DEA",
    "iso2Code": "D4",
    "name": "East Asia & Pacific (IDA-eligible countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "d7": {
    "id": "DEC",
    "iso2Code": "D7",
    "name": "Europe & Central Asia (IDA-eligible countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d7.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "de": {
    "id": "DEU",
    "iso2Code": "DE",
    "name": "Germany",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Berlin",
    "longitude": "13.4115",
    "latitude": "52.5235",
    "flag": "🇩🇪",
    "flagUrl": "https://flagcdn.com/w320/de.png",
    "currencies": "Euro (€)",
    "languages": "German",
    "subregion": "Western Europe",
    "area": 357114,
    "borders": [
      "AUT",
      "BEL",
      "CZE",
      "DNK",
      "FRA",
      "LUX",
      "NLD",
      "POL",
      "CHE"
    ]
  },
  "dj": {
    "id": "DJI",
    "iso2Code": "DJ",
    "name": "Djibouti",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Djibouti",
    "longitude": "43.1425",
    "latitude": "11.5806",
    "flag": "🇩🇯",
    "flagUrl": "https://flagcdn.com/w320/dj.png",
    "currencies": "Djiboutian franc (Fr)",
    "languages": "Arabic, French",
    "subregion": "Eastern Africa",
    "area": 23200,
    "borders": [
      "ERI",
      "ETH",
      "SOM"
    ]
  },
  "d2": {
    "id": "DLA",
    "iso2Code": "D2",
    "name": "Latin America & the Caribbean (IDA-eligible countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "dm": {
    "id": "DMA",
    "iso2Code": "DM",
    "name": "Dominica",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Roseau",
    "longitude": "-61.39",
    "latitude": "15.2976",
    "flag": "🇩🇲",
    "flagUrl": "https://flagcdn.com/w320/dm.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 751,
    "borders": []
  },
  "d3": {
    "id": "DMN",
    "iso2Code": "D3",
    "name": "Middle East, North Africa, Afghanistan & Pakistan (IDA total)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d3.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "dk": {
    "id": "DNK",
    "iso2Code": "DK",
    "name": "Denmark",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Copenhagen",
    "longitude": "12.5681",
    "latitude": "55.6763",
    "flag": "🇩🇰",
    "flagUrl": "https://flagcdn.com/w320/dk.png",
    "currencies": "Danish krone (kr)",
    "languages": "Danish",
    "subregion": "Northern Europe",
    "area": 43094,
    "borders": [
      "DEU"
    ]
  },
  "n6": {
    "id": "DNS",
    "iso2Code": "N6",
    "name": "IDA countries in Sub-Saharan Africa not classified as fragile situations ",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/n6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "do": {
    "id": "DOM",
    "iso2Code": "DO",
    "name": "Dominican Republic",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Santo Domingo",
    "longitude": "-69.8908",
    "latitude": "18.479",
    "flag": "🇩🇴",
    "flagUrl": "https://flagcdn.com/w320/do.png",
    "currencies": "Dominican peso ($)",
    "languages": "Spanish",
    "subregion": "Caribbean",
    "area": 48671,
    "borders": [
      "HTI"
    ]
  },
  "d5": {
    "id": "DSA",
    "iso2Code": "D5",
    "name": "South Asia (IDA-eligible countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d5.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "f6": {
    "id": "DSF",
    "iso2Code": "F6",
    "name": "IDA countries in Sub-Saharan Africa classified as fragile situations ",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/f6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "d6": {
    "id": "DSS",
    "iso2Code": "D6",
    "name": "Sub-Saharan Africa (IDA-eligible countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/d6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "dz": {
    "id": "DZA",
    "iso2Code": "DZ",
    "name": "Algeria",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Algiers",
    "longitude": "3.05097",
    "latitude": "36.7397",
    "flag": "🇩🇿",
    "flagUrl": "https://flagcdn.com/w320/dz.png",
    "currencies": "Algerian dinar (د.ج)",
    "languages": "Arabic",
    "subregion": "Northern Africa",
    "area": 2381741,
    "borders": [
      "TUN",
      "LBY",
      "NER",
      "ESH",
      "MRT",
      "MLI",
      "MAR"
    ]
  },
  "4e": {
    "id": "EAP",
    "iso2Code": "4E",
    "name": "East Asia & Pacific (excluding high income)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/4e.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "v2": {
    "id": "EAR",
    "iso2Code": "V2",
    "name": "Early-demographic dividend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/v2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "z4": {
    "id": "EAS",
    "iso2Code": "Z4",
    "name": "East Asia & Pacific",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/z4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "7e": {
    "id": "ECA",
    "iso2Code": "7E",
    "name": "Europe & Central Asia (excluding high income)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/7e.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "z7": {
    "id": "ECS",
    "iso2Code": "Z7",
    "name": "Europe & Central Asia",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/z7.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ec": {
    "id": "ECU",
    "iso2Code": "EC",
    "name": "Ecuador",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Quito",
    "longitude": "-78.5243",
    "latitude": "-0.229498",
    "flag": "🇪🇨",
    "flagUrl": "https://flagcdn.com/w320/ec.png",
    "currencies": "United States dollar ($)",
    "languages": "Spanish",
    "subregion": "South America",
    "area": 276841,
    "borders": [
      "COL",
      "PER"
    ]
  },
  "eg": {
    "id": "EGY",
    "iso2Code": "EG",
    "name": "Egypt, Arab Rep.",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Cairo",
    "longitude": "31.2461",
    "latitude": "30.0982",
    "flag": "🇪🇬",
    "flagUrl": "https://flagcdn.com/w320/eg.png",
    "currencies": "Egyptian pound (£)",
    "languages": "Arabic",
    "subregion": "Northern Africa",
    "area": 1002450,
    "borders": [
      "ISR",
      "LBY",
      "PSE",
      "SDN"
    ]
  },
  "xc": {
    "id": "EMU",
    "iso2Code": "XC",
    "name": "Euro area",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xc.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "er": {
    "id": "ERI",
    "iso2Code": "ER",
    "name": "Eritrea",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Asmara",
    "longitude": "38.9183",
    "latitude": "15.3315",
    "flag": "🇪🇷",
    "flagUrl": "https://flagcdn.com/w320/er.png",
    "currencies": "Eritrean nakfa (Nfk)",
    "languages": "Arabic, English, Tigrinya",
    "subregion": "Eastern Africa",
    "area": 117600,
    "borders": [
      "DJI",
      "ETH",
      "SDN"
    ]
  },
  "es": {
    "id": "ESP",
    "iso2Code": "ES",
    "name": "Spain",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Madrid",
    "longitude": "-3.70327",
    "latitude": "40.4167",
    "flag": "🇪🇸",
    "flagUrl": "https://flagcdn.com/w320/es.png",
    "currencies": "Euro (€)",
    "languages": "Spanish",
    "subregion": "Southern Europe",
    "area": 505992,
    "borders": [
      "AND",
      "FRA",
      "GIB",
      "PRT",
      "MAR"
    ]
  },
  "ee": {
    "id": "EST",
    "iso2Code": "EE",
    "name": "Estonia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Tallinn",
    "longitude": "24.7586",
    "latitude": "59.4392",
    "flag": "🇪🇪",
    "flagUrl": "https://flagcdn.com/w320/ee.png",
    "currencies": "Euro (€)",
    "languages": "Estonian",
    "subregion": "Northern Europe",
    "area": 45227,
    "borders": [
      "LVA",
      "RUS"
    ]
  },
  "et": {
    "id": "ETH",
    "iso2Code": "ET",
    "name": "Ethiopia",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Addis Ababa",
    "longitude": "38.7468",
    "latitude": "9.02274",
    "flag": "🇪🇹",
    "flagUrl": "https://flagcdn.com/w320/et.png",
    "currencies": "Ethiopian birr (Br)",
    "languages": "Amharic",
    "subregion": "Eastern Africa",
    "area": 1104300,
    "borders": [
      "DJI",
      "ERI",
      "KEN",
      "SOM",
      "SSD",
      "SDN"
    ]
  },
  "eu": {
    "id": "EUU",
    "iso2Code": "EU",
    "name": "European Union",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/eu.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "fi": {
    "id": "FIN",
    "iso2Code": "FI",
    "name": "Finland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Helsinki",
    "longitude": "24.9525",
    "latitude": "60.1608",
    "flag": "🇫🇮",
    "flagUrl": "https://flagcdn.com/w320/fi.png",
    "currencies": "Euro (€)",
    "languages": "Finnish, Swedish",
    "subregion": "Northern Europe",
    "area": 338424,
    "borders": [
      "NOR",
      "SWE",
      "RUS"
    ]
  },
  "fj": {
    "id": "FJI",
    "iso2Code": "FJ",
    "name": "Fiji",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Suva",
    "longitude": "178.399",
    "latitude": "-18.1149",
    "flag": "🇫🇯",
    "flagUrl": "https://flagcdn.com/w320/fj.png",
    "currencies": "Fijian dollar ($)",
    "languages": "English, Fijian, Fiji Hindi",
    "subregion": "Melanesia",
    "area": 18272,
    "borders": []
  },
  "fr": {
    "id": "FRA",
    "iso2Code": "FR",
    "name": "France",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Paris",
    "longitude": "2.35097",
    "latitude": "48.8566",
    "flag": "🇫🇷",
    "flagUrl": "https://flagcdn.com/w320/fr.png",
    "currencies": "Euro (€)",
    "languages": "French",
    "subregion": "Western Europe",
    "area": 551695,
    "borders": [
      "AND",
      "BEL",
      "DEU",
      "ITA",
      "LUX",
      "MCO",
      "ESP",
      "CHE"
    ]
  },
  "fo": {
    "id": "FRO",
    "iso2Code": "FO",
    "name": "Faroe Islands",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Torshavn",
    "longitude": "-6.91181",
    "latitude": "61.8926",
    "flag": "🇫🇴",
    "flagUrl": "https://flagcdn.com/w320/fo.png",
    "currencies": "Danish krone (kr), Faroese króna (kr)",
    "languages": "Danish, Faroese",
    "subregion": "Northern Europe",
    "area": 1393,
    "borders": []
  },
  "fm": {
    "id": "FSM",
    "iso2Code": "FM",
    "name": "Micronesia, Fed. Sts.",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Palikir",
    "longitude": "158.185",
    "latitude": "6.91771",
    "flag": "🇫🇲",
    "flagUrl": "https://flagcdn.com/w320/fm.png",
    "currencies": "",
    "languages": "English",
    "subregion": "Micronesia",
    "area": 702,
    "borders": []
  },
  "6f": {
    "id": "FXS",
    "iso2Code": "6F",
    "name": "IDA countries classified as fragile situations, excluding Sub-Saharan Africa",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/6f.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ga": {
    "id": "GAB",
    "iso2Code": "GA",
    "name": "Gabon",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Libreville",
    "longitude": "9.45162",
    "latitude": "0.38832",
    "flag": "🇬🇦",
    "flagUrl": "https://flagcdn.com/w320/ga.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Middle Africa",
    "area": 267668,
    "borders": [
      "CMR",
      "COG",
      "GNQ"
    ]
  },
  "gb": {
    "id": "GBR",
    "iso2Code": "GB",
    "name": "United Kingdom",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "London",
    "longitude": "-0.126236",
    "latitude": "51.5002",
    "flag": "🇬🇧",
    "flagUrl": "https://flagcdn.com/w320/gb.png",
    "currencies": "British pound (£)",
    "languages": "English",
    "subregion": "Northern Europe",
    "area": 242900,
    "borders": [
      "IRL"
    ]
  },
  "ge": {
    "id": "GEO",
    "iso2Code": "GE",
    "name": "Georgia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Tbilisi",
    "longitude": "44.793",
    "latitude": "41.71",
    "flag": "🇬🇪",
    "flagUrl": "https://flagcdn.com/w320/ge.png",
    "currencies": "lari (₾)",
    "languages": "Georgian",
    "subregion": "Western Asia",
    "area": 69700,
    "borders": [
      "ARM",
      "AZE",
      "RUS",
      "TUR"
    ]
  },
  "gh": {
    "id": "GHA",
    "iso2Code": "GH",
    "name": "Ghana",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Accra",
    "longitude": "-0.20795",
    "latitude": "5.57045",
    "flag": "🇬🇭",
    "flagUrl": "https://flagcdn.com/w320/gh.png",
    "currencies": "Ghanaian cedi (₵)",
    "languages": "English",
    "subregion": "Western Africa",
    "area": 238533,
    "borders": [
      "BFA",
      "CIV",
      "TGO"
    ]
  },
  "gi": {
    "id": "GIB",
    "iso2Code": "GI",
    "name": "Gibraltar",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Gibraltar",
    "longitude": "-5.35",
    "latitude": "36.13333333",
    "flag": "🇬🇮",
    "flagUrl": "https://flagcdn.com/w320/gi.png",
    "currencies": "Gibraltar pound (£)",
    "languages": "English",
    "subregion": "Southern Europe",
    "area": 6,
    "borders": [
      "ESP"
    ]
  },
  "gn": {
    "id": "GIN",
    "iso2Code": "GN",
    "name": "Guinea",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Conakry",
    "longitude": "-13.7",
    "latitude": "9.51667",
    "flag": "🇬🇳",
    "flagUrl": "https://flagcdn.com/w320/gn.png",
    "currencies": "Guinean franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 245857,
    "borders": [
      "CIV",
      "GNB",
      "LBR",
      "MLI",
      "SEN",
      "SLE"
    ]
  },
  "gm": {
    "id": "GMB",
    "iso2Code": "GM",
    "name": "Gambia, The",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Banjul",
    "longitude": "-16.5885",
    "latitude": "13.4495",
    "flag": "🇬🇲",
    "flagUrl": "https://flagcdn.com/w320/gm.png",
    "currencies": "dalasi (D)",
    "languages": "English",
    "subregion": "Western Africa",
    "area": 10689,
    "borders": [
      "SEN"
    ]
  },
  "gw": {
    "id": "GNB",
    "iso2Code": "GW",
    "name": "Guinea-Bissau",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Bissau",
    "longitude": "-15.1804",
    "latitude": "11.8037",
    "flag": "🇬🇼",
    "flagUrl": "https://flagcdn.com/w320/gw.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "Portuguese, Upper Guinea Creole",
    "subregion": "Western Africa",
    "area": 36125,
    "borders": [
      "GIN",
      "SEN"
    ]
  },
  "gq": {
    "id": "GNQ",
    "iso2Code": "GQ",
    "name": "Equatorial Guinea",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Malabo",
    "longitude": "8.7741",
    "latitude": "3.7523",
    "flag": "🇬🇶",
    "flagUrl": "https://flagcdn.com/w320/gq.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "French, Portuguese, Spanish",
    "subregion": "Middle Africa",
    "area": 28051,
    "borders": [
      "CMR",
      "GAB"
    ]
  },
  "gr": {
    "id": "GRC",
    "iso2Code": "GR",
    "name": "Greece",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Athens",
    "longitude": "23.7166",
    "latitude": "37.9792",
    "flag": "🇬🇷",
    "flagUrl": "https://flagcdn.com/w320/gr.png",
    "currencies": "Euro (€)",
    "languages": "Greek",
    "subregion": "Southern Europe",
    "area": 131990,
    "borders": [
      "ALB",
      "BGR",
      "TUR",
      "MKD"
    ]
  },
  "gd": {
    "id": "GRD",
    "iso2Code": "GD",
    "name": "Grenada",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Saint George's",
    "longitude": "-61.7449",
    "latitude": "12.0653",
    "flag": "🇬🇩",
    "flagUrl": "https://flagcdn.com/w320/gd.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 344,
    "borders": []
  },
  "gl": {
    "id": "GRL",
    "iso2Code": "GL",
    "name": "Greenland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Nuuk",
    "longitude": "-51.7214",
    "latitude": "64.1836",
    "flag": "🇬🇱",
    "flagUrl": "https://flagcdn.com/w320/gl.png",
    "currencies": "krone (kr.)",
    "languages": "Greenlandic",
    "subregion": "North America",
    "area": 2166086,
    "borders": []
  },
  "gt": {
    "id": "GTM",
    "iso2Code": "GT",
    "name": "Guatemala",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Guatemala City",
    "longitude": "-90.5328",
    "latitude": "14.6248",
    "flag": "🇬🇹",
    "flagUrl": "https://flagcdn.com/w320/gt.png",
    "currencies": "Guatemalan quetzal (Q)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 108889,
    "borders": [
      "BLZ",
      "SLV",
      "HND",
      "MEX"
    ]
  },
  "gu": {
    "id": "GUM",
    "iso2Code": "GU",
    "name": "Guam",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Agana",
    "longitude": "144.794",
    "latitude": "13.4443",
    "flag": "🇬🇺",
    "flagUrl": "https://flagcdn.com/w320/gu.png",
    "currencies": "United States dollar ($)",
    "languages": "Chamorro, English, Spanish",
    "subregion": "Micronesia",
    "area": 549,
    "borders": []
  },
  "gy": {
    "id": "GUY",
    "iso2Code": "GY",
    "name": "Guyana",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Georgetown",
    "longitude": "-58.1548",
    "latitude": "6.80461",
    "flag": "🇬🇾",
    "flagUrl": "https://flagcdn.com/w320/gy.png",
    "currencies": "Guyanese dollar ($)",
    "languages": "English",
    "subregion": "South America",
    "area": 214969,
    "borders": [
      "BRA",
      "SUR",
      "VEN"
    ]
  },
  "xd": {
    "id": "HIC",
    "iso2Code": "XD",
    "name": "High income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xd.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "hk": {
    "id": "HKG",
    "iso2Code": "HK",
    "name": "Hong Kong SAR, China",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "City of Victoria",
    "longitude": "114.109",
    "latitude": "22.3964",
    "flag": "🇭🇰",
    "flagUrl": "https://flagcdn.com/w320/hk.png",
    "currencies": "Hong Kong dollar ($)",
    "languages": "English, Chinese",
    "subregion": "Eastern Asia",
    "area": 1104,
    "borders": [
      "CHN"
    ]
  },
  "hn": {
    "id": "HND",
    "iso2Code": "HN",
    "name": "Honduras",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Tegucigalpa",
    "longitude": "-87.4667",
    "latitude": "15.1333",
    "flag": "🇭🇳",
    "flagUrl": "https://flagcdn.com/w320/hn.png",
    "currencies": "Honduran lempira (L)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 112492,
    "borders": [
      "GTM",
      "SLV",
      "NIC"
    ]
  },
  "xe": {
    "id": "HPC",
    "iso2Code": "XE",
    "name": "Heavily indebted poor countries (HIPC)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xe.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "hr": {
    "id": "HRV",
    "iso2Code": "HR",
    "name": "Croatia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Zagreb",
    "longitude": "15.9614",
    "latitude": "45.8069",
    "flag": "🇭🇷",
    "flagUrl": "https://flagcdn.com/w320/hr.png",
    "currencies": "Euro (€)",
    "languages": "Croatian",
    "subregion": "Southeast Europe",
    "area": 56594,
    "borders": [
      "BIH",
      "HUN",
      "MNE",
      "SRB",
      "SVN"
    ]
  },
  "ht": {
    "id": "HTI",
    "iso2Code": "HT",
    "name": "Haiti",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Port-au-Prince",
    "longitude": "-72.3288",
    "latitude": "18.5392",
    "flag": "🇭🇹",
    "flagUrl": "https://flagcdn.com/w320/ht.png",
    "currencies": "Haitian gourde (G)",
    "languages": "French, Haitian Creole",
    "subregion": "Caribbean",
    "area": 27750,
    "borders": [
      "DOM"
    ]
  },
  "hu": {
    "id": "HUN",
    "iso2Code": "HU",
    "name": "Hungary",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Budapest",
    "longitude": "19.0408",
    "latitude": "47.4984",
    "flag": "🇭🇺",
    "flagUrl": "https://flagcdn.com/w320/hu.png",
    "currencies": "Hungarian forint (Ft)",
    "languages": "Hungarian",
    "subregion": "Central Europe",
    "area": 93028,
    "borders": [
      "AUT",
      "HRV",
      "ROU",
      "SRB",
      "SVK",
      "SVN",
      "UKR"
    ]
  },
  "zb": {
    "id": "IBB",
    "iso2Code": "ZB",
    "name": "IBRD, including blend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zb.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xf": {
    "id": "IBD",
    "iso2Code": "XF",
    "name": "IBRD only",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xf.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "zt": {
    "id": "IBT",
    "iso2Code": "ZT",
    "name": "IDA & IBRD total",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zt.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xg": {
    "id": "IDA",
    "iso2Code": "XG",
    "name": "IDA total",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xg.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xh": {
    "id": "IDB",
    "iso2Code": "XH",
    "name": "IDA blend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xh.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "id": {
    "id": "IDN",
    "iso2Code": "ID",
    "name": "Indonesia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Jakarta",
    "longitude": "106.83",
    "latitude": "-6.19752",
    "flag": "🇮🇩",
    "flagUrl": "https://flagcdn.com/w320/id.png",
    "currencies": "Indonesian rupiah (Rp)",
    "languages": "Indonesian",
    "subregion": "South-Eastern Asia",
    "area": 1904569,
    "borders": [
      "TLS",
      "MYS",
      "PNG"
    ]
  },
  "xi": {
    "id": "IDX",
    "iso2Code": "XI",
    "name": "IDA only",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xi.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "im": {
    "id": "IMN",
    "iso2Code": "IM",
    "name": "Isle of Man",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Douglas",
    "longitude": "-4.47928",
    "latitude": "54.1509",
    "flag": "🇮🇲",
    "flagUrl": "https://flagcdn.com/w320/im.png",
    "currencies": "British pound (£), Manx pound (£)",
    "languages": "English, Manx",
    "subregion": "Northern Europe",
    "area": 572,
    "borders": []
  },
  "in": {
    "id": "IND",
    "iso2Code": "IN",
    "name": "India",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "New Delhi",
    "longitude": "77.225",
    "latitude": "28.6353",
    "flag": "🇮🇳",
    "flagUrl": "https://flagcdn.com/w320/in.png",
    "currencies": "Indian rupee (₹)",
    "languages": "English, Hindi, Tamil",
    "subregion": "Southern Asia",
    "area": 3287590,
    "borders": [
      "BGD",
      "BTN",
      "MMR",
      "CHN",
      "NPL",
      "PAK"
    ]
  },
  "xy": {
    "id": "INX",
    "iso2Code": "XY",
    "name": "Not classified",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xy.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ie": {
    "id": "IRL",
    "iso2Code": "IE",
    "name": "Ireland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Dublin",
    "longitude": "-6.26749",
    "latitude": "53.3441",
    "flag": "🇮🇪",
    "flagUrl": "https://flagcdn.com/w320/ie.png",
    "currencies": "Euro (€)",
    "languages": "English, Irish",
    "subregion": "Northern Europe",
    "area": 70273,
    "borders": [
      "GBR"
    ]
  },
  "ir": {
    "id": "IRN",
    "iso2Code": "IR",
    "name": "Iran, Islamic Rep.",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Tehran",
    "longitude": "51.4447",
    "latitude": "35.6878",
    "flag": "🇮🇷",
    "flagUrl": "https://flagcdn.com/w320/ir.png",
    "currencies": "Iranian rial (﷼)",
    "languages": "Persian (Farsi)",
    "subregion": "Southern Asia",
    "area": 1648195,
    "borders": [
      "AFG",
      "ARM",
      "AZE",
      "IRQ",
      "PAK",
      "TUR",
      "TKM"
    ]
  },
  "iq": {
    "id": "IRQ",
    "iso2Code": "IQ",
    "name": "Iraq",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Baghdad",
    "longitude": "44.394",
    "latitude": "33.3302",
    "flag": "🇮🇶",
    "flagUrl": "https://flagcdn.com/w320/iq.png",
    "currencies": "Iraqi dinar (ع.د)",
    "languages": "Arabic, Aramaic, Sorani",
    "subregion": "Western Asia",
    "area": 438317,
    "borders": [
      "IRN",
      "JOR",
      "KWT",
      "SAU",
      "SYR",
      "TUR"
    ]
  },
  "is": {
    "id": "ISL",
    "iso2Code": "IS",
    "name": "Iceland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Reykjavik",
    "longitude": "-21.8952",
    "latitude": "64.1353",
    "flag": "🇮🇸",
    "flagUrl": "https://flagcdn.com/w320/is.png",
    "currencies": "Icelandic króna (kr)",
    "languages": "Icelandic",
    "subregion": "Northern Europe",
    "area": 103000,
    "borders": []
  },
  "il": {
    "id": "ISR",
    "iso2Code": "IL",
    "name": "Israel",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Jerusalem",
    "longitude": "35.2035",
    "latitude": "31.7717",
    "flag": "🇮🇱",
    "flagUrl": "https://flagcdn.com/w320/il.png",
    "currencies": "Israeli new shekel (₪)",
    "languages": "Arabic, Hebrew",
    "subregion": "Western Asia",
    "area": 20770,
    "borders": [
      "EGY",
      "JOR",
      "LBN",
      "PSE",
      "SYR"
    ]
  },
  "it": {
    "id": "ITA",
    "iso2Code": "IT",
    "name": "Italy",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Rome",
    "longitude": "12.4823",
    "latitude": "41.8955",
    "flag": "🇮🇹",
    "flagUrl": "https://flagcdn.com/w320/it.png",
    "currencies": "Euro (€)",
    "languages": "Italian",
    "subregion": "Southern Europe",
    "area": 301336,
    "borders": [
      "AUT",
      "FRA",
      "SMR",
      "SVN",
      "CHE",
      "VAT"
    ]
  },
  "jm": {
    "id": "JAM",
    "iso2Code": "JM",
    "name": "Jamaica",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Kingston",
    "longitude": "-76.792",
    "latitude": "17.9927",
    "flag": "🇯🇲",
    "flagUrl": "https://flagcdn.com/w320/jm.png",
    "currencies": "Jamaican dollar ($)",
    "languages": "English, Jamaican Patois",
    "subregion": "Caribbean",
    "area": 10991,
    "borders": []
  },
  "jo": {
    "id": "JOR",
    "iso2Code": "JO",
    "name": "Jordan",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Amman",
    "longitude": "35.9263",
    "latitude": "31.9497",
    "flag": "🇯🇴",
    "flagUrl": "https://flagcdn.com/w320/jo.png",
    "currencies": "Jordanian dinar (د.ا)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 89342,
    "borders": [
      "IRQ",
      "ISR",
      "PSE",
      "SAU",
      "SYR"
    ]
  },
  "jp": {
    "id": "JPN",
    "iso2Code": "JP",
    "name": "Japan",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Tokyo",
    "longitude": "139.77",
    "latitude": "35.67",
    "flag": "🇯🇵",
    "flagUrl": "https://flagcdn.com/w320/jp.png",
    "currencies": "Japanese yen (¥)",
    "languages": "Japanese",
    "subregion": "Eastern Asia",
    "area": 377930,
    "borders": []
  },
  "kz": {
    "id": "KAZ",
    "iso2Code": "KZ",
    "name": "Kazakhstan",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Astana",
    "longitude": "71.4382",
    "latitude": "51.1879",
    "flag": "🇰🇿",
    "flagUrl": "https://flagcdn.com/w320/kz.png",
    "currencies": "Kazakhstani tenge (₸)",
    "languages": "Kazakh, Russian",
    "subregion": "Central Asia",
    "area": 2724900,
    "borders": [
      "CHN",
      "KGZ",
      "RUS",
      "TKM",
      "UZB"
    ]
  },
  "ke": {
    "id": "KEN",
    "iso2Code": "KE",
    "name": "Kenya",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Nairobi",
    "longitude": "36.8126",
    "latitude": "-1.27975",
    "flag": "🇰🇪",
    "flagUrl": "https://flagcdn.com/w320/ke.png",
    "currencies": "Kenyan shilling (Sh)",
    "languages": "English, Swahili",
    "subregion": "Eastern Africa",
    "area": 580367,
    "borders": [
      "ETH",
      "SOM",
      "SSD",
      "TZA",
      "UGA"
    ]
  },
  "kg": {
    "id": "KGZ",
    "iso2Code": "KG",
    "name": "Kyrgyz Republic",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Bishkek",
    "longitude": "74.6057",
    "latitude": "42.8851",
    "flag": "🇰🇬",
    "flagUrl": "https://flagcdn.com/w320/kg.png",
    "currencies": "Kyrgyzstani som (с)",
    "languages": "Kyrgyz, Russian",
    "subregion": "Central Asia",
    "area": 199951,
    "borders": [
      "CHN",
      "KAZ",
      "TJK",
      "UZB"
    ]
  },
  "kh": {
    "id": "KHM",
    "iso2Code": "KH",
    "name": "Cambodia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Phnom Penh",
    "longitude": "104.874",
    "latitude": "11.5556",
    "flag": "🇰🇭",
    "flagUrl": "https://flagcdn.com/w320/kh.png",
    "currencies": "Cambodian riel (៛), United States dollar ($)",
    "languages": "Khmer",
    "subregion": "South-Eastern Asia",
    "area": 181035,
    "borders": [
      "LAO",
      "THA",
      "VNM"
    ]
  },
  "ki": {
    "id": "KIR",
    "iso2Code": "KI",
    "name": "Kiribati",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Tarawa",
    "longitude": "172.979",
    "latitude": "1.32905",
    "flag": "🇰🇮",
    "flagUrl": "https://flagcdn.com/w320/ki.png",
    "currencies": "Australian dollar ($), Kiribati dollar ($)",
    "languages": "English, Gilbertese",
    "subregion": "Micronesia",
    "area": 811,
    "borders": []
  },
  "kn": {
    "id": "KNA",
    "iso2Code": "KN",
    "name": "St. Kitts and Nevis",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Basseterre",
    "longitude": "-62.7309",
    "latitude": "17.3",
    "flag": "🇰🇳",
    "flagUrl": "https://flagcdn.com/w320/kn.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 261,
    "borders": []
  },
  "kr": {
    "id": "KOR",
    "iso2Code": "KR",
    "name": "Korea, Rep.",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Seoul",
    "longitude": "126.957",
    "latitude": "37.5323",
    "flag": "🇰🇷",
    "flagUrl": "https://flagcdn.com/w320/kr.png",
    "currencies": "South Korean won (₩)",
    "languages": "Korean",
    "subregion": "Eastern Asia",
    "area": 100210,
    "borders": [
      "PRK"
    ]
  },
  "kw": {
    "id": "KWT",
    "iso2Code": "KW",
    "name": "Kuwait",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Kuwait City",
    "longitude": "47.9824",
    "latitude": "29.3721",
    "flag": "🇰🇼",
    "flagUrl": "https://flagcdn.com/w320/kw.png",
    "currencies": "Kuwaiti dinar (د.ك)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 17818,
    "borders": [
      "IRQ",
      "SAU"
    ]
  },
  "xj": {
    "id": "LAC",
    "iso2Code": "XJ",
    "name": "Latin America & Caribbean (excluding high income)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xj.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "la": {
    "id": "LAO",
    "iso2Code": "LA",
    "name": "Lao PDR",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Vientiane",
    "longitude": "102.177",
    "latitude": "18.5826",
    "flag": "🇱🇦",
    "flagUrl": "https://flagcdn.com/w320/la.png",
    "currencies": "Lao kip (₭)",
    "languages": "Lao",
    "subregion": "South-Eastern Asia",
    "area": 236800,
    "borders": [
      "MMR",
      "KHM",
      "CHN",
      "THA",
      "VNM"
    ]
  },
  "lb": {
    "id": "LBN",
    "iso2Code": "LB",
    "name": "Lebanon",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Beirut",
    "longitude": "35.5134",
    "latitude": "33.8872",
    "flag": "🇱🇧",
    "flagUrl": "https://flagcdn.com/w320/lb.png",
    "currencies": "Lebanese pound (ل.ل)",
    "languages": "Arabic, French",
    "subregion": "Western Asia",
    "area": 10452,
    "borders": [
      "ISR",
      "SYR"
    ]
  },
  "lr": {
    "id": "LBR",
    "iso2Code": "LR",
    "name": "Liberia",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Monrovia",
    "longitude": "-10.7957",
    "latitude": "6.30039",
    "flag": "🇱🇷",
    "flagUrl": "https://flagcdn.com/w320/lr.png",
    "currencies": "Liberian dollar ($)",
    "languages": "English",
    "subregion": "Western Africa",
    "area": 111369,
    "borders": [
      "GIN",
      "CIV",
      "SLE"
    ]
  },
  "ly": {
    "id": "LBY",
    "iso2Code": "LY",
    "name": "Libya",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Tripoli",
    "longitude": "13.1072",
    "latitude": "32.8578",
    "flag": "🇱🇾",
    "flagUrl": "https://flagcdn.com/w320/ly.png",
    "currencies": "Libyan dinar (ل.د)",
    "languages": "Arabic",
    "subregion": "Northern Africa",
    "area": 1759540,
    "borders": [
      "DZA",
      "TCD",
      "EGY",
      "NER",
      "SDN",
      "TUN"
    ]
  },
  "lc": {
    "id": "LCA",
    "iso2Code": "LC",
    "name": "St. Lucia",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Castries",
    "longitude": "-60.9832",
    "latitude": "14",
    "flag": "🇱🇨",
    "flagUrl": "https://flagcdn.com/w320/lc.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 616,
    "borders": []
  },
  "zj": {
    "id": "LCN",
    "iso2Code": "ZJ",
    "name": "Latin America & Caribbean ",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zj.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xl": {
    "id": "LDC",
    "iso2Code": "XL",
    "name": "Least developed countries: UN classification",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xl.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xm": {
    "id": "LIC",
    "iso2Code": "XM",
    "name": "Low income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xm.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "li": {
    "id": "LIE",
    "iso2Code": "LI",
    "name": "Liechtenstein",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Vaduz",
    "longitude": "9.52148",
    "latitude": "47.1411",
    "flag": "🇱🇮",
    "flagUrl": "https://flagcdn.com/w320/li.png",
    "currencies": "Swiss franc (Fr)",
    "languages": "German",
    "subregion": "Western Europe",
    "area": 160,
    "borders": [
      "AUT",
      "CHE"
    ]
  },
  "lk": {
    "id": "LKA",
    "iso2Code": "LK",
    "name": "Sri Lanka",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Colombo",
    "longitude": "79.8528",
    "latitude": "6.92148",
    "flag": "🇱🇰",
    "flagUrl": "https://flagcdn.com/w320/lk.png",
    "currencies": "Sri Lankan rupee (Rs රු)",
    "languages": "Sinhala, Tamil",
    "subregion": "Southern Asia",
    "area": 65610,
    "borders": [
      "IND"
    ]
  },
  "xn": {
    "id": "LMC",
    "iso2Code": "XN",
    "name": "Lower middle income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xn.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "xo": {
    "id": "LMY",
    "iso2Code": "XO",
    "name": "Low & middle income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xo.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ls": {
    "id": "LSO",
    "iso2Code": "LS",
    "name": "Lesotho",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Maseru",
    "longitude": "27.7167",
    "latitude": "-29.5208",
    "flag": "🇱🇸",
    "flagUrl": "https://flagcdn.com/w320/ls.png",
    "currencies": "Lesotho loti (L), South African rand (R)",
    "languages": "English, Sotho",
    "subregion": "Southern Africa",
    "area": 30355,
    "borders": [
      "ZAF"
    ]
  },
  "v3": {
    "id": "LTE",
    "iso2Code": "V3",
    "name": "Late-demographic dividend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/v3.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "lt": {
    "id": "LTU",
    "iso2Code": "LT",
    "name": "Lithuania",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Vilnius",
    "longitude": "25.2799",
    "latitude": "54.6896",
    "flag": "🇱🇹",
    "flagUrl": "https://flagcdn.com/w320/lt.png",
    "currencies": "Euro (€)",
    "languages": "Lithuanian",
    "subregion": "Northern Europe",
    "area": 65300,
    "borders": [
      "BLR",
      "LVA",
      "POL",
      "RUS"
    ]
  },
  "lu": {
    "id": "LUX",
    "iso2Code": "LU",
    "name": "Luxembourg",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Luxembourg",
    "longitude": "6.1296",
    "latitude": "49.61",
    "flag": "🇱🇺",
    "flagUrl": "https://flagcdn.com/w320/lu.png",
    "currencies": "Euro (€)",
    "languages": "German, French, Luxembourgish",
    "subregion": "Western Europe",
    "area": 2586,
    "borders": [
      "BEL",
      "FRA",
      "DEU"
    ]
  },
  "lv": {
    "id": "LVA",
    "iso2Code": "LV",
    "name": "Latvia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Riga",
    "longitude": "24.1048",
    "latitude": "56.9465",
    "flag": "🇱🇻",
    "flagUrl": "https://flagcdn.com/w320/lv.png",
    "currencies": "Euro (€)",
    "languages": "Latvian",
    "subregion": "Northern Europe",
    "area": 64559,
    "borders": [
      "BLR",
      "EST",
      "LTU",
      "RUS"
    ]
  },
  "mo": {
    "id": "MAC",
    "iso2Code": "MO",
    "name": "Macao SAR, China",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "",
    "longitude": "113.55",
    "latitude": "22.1667",
    "flag": "🇲🇴",
    "flagUrl": "https://flagcdn.com/w320/mo.png",
    "currencies": "Macanese pataca (P)",
    "languages": "Portuguese, Chinese",
    "subregion": "Eastern Asia",
    "area": 30,
    "borders": [
      "CHN"
    ]
  },
  "mf": {
    "id": "MAF",
    "iso2Code": "MF",
    "name": "St. Martin (French part)",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Marigot",
    "longitude": "-63.95",
    "latitude": "18.08333333",
    "flag": "🇲🇫",
    "flagUrl": "https://flagcdn.com/w320/mf.png",
    "currencies": "Euro (€)",
    "languages": "French",
    "subregion": "Caribbean",
    "area": 53,
    "borders": [
      "SXM"
    ]
  },
  "ma": {
    "id": "MAR",
    "iso2Code": "MA",
    "name": "Morocco",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Rabat",
    "longitude": "-6.8704",
    "latitude": "33.9905",
    "flag": "🇲🇦",
    "flagUrl": "https://flagcdn.com/w320/ma.png",
    "currencies": "Moroccan dirham (د.م.)",
    "languages": "Arabic, Berber",
    "subregion": "Northern Africa",
    "area": 446550,
    "borders": [
      "DZA",
      "ESH",
      "ESP"
    ]
  },
  "mc": {
    "id": "MCO",
    "iso2Code": "MC",
    "name": "Monaco",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Monaco",
    "longitude": "7.41891",
    "latitude": "43.7325",
    "flag": "🇲🇨",
    "flagUrl": "https://flagcdn.com/w320/mc.png",
    "currencies": "Euro (€)",
    "languages": "French",
    "subregion": "Western Europe",
    "area": 2.02,
    "borders": [
      "FRA"
    ]
  },
  "md": {
    "id": "MDA",
    "iso2Code": "MD",
    "name": "Moldova",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Chisinau",
    "longitude": "28.8497",
    "latitude": "47.0167",
    "flag": "🇲🇩",
    "flagUrl": "https://flagcdn.com/w320/md.png",
    "currencies": "Moldovan leu (L)",
    "languages": "Moldavian",
    "subregion": "Eastern Europe",
    "area": 33846,
    "borders": [
      "ROU",
      "UKR"
    ]
  },
  "m1": {
    "id": "MDE",
    "iso2Code": "M1",
    "name": "Middle East (developing only)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/m1.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "mg": {
    "id": "MDG",
    "iso2Code": "MG",
    "name": "Madagascar",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Antananarivo",
    "longitude": "45.7167",
    "latitude": "-20.4667",
    "flag": "🇲🇬",
    "flagUrl": "https://flagcdn.com/w320/mg.png",
    "currencies": "Malagasy ariary (Ar)",
    "languages": "French, Malagasy",
    "subregion": "Eastern Africa",
    "area": 587041,
    "borders": []
  },
  "mv": {
    "id": "MDV",
    "iso2Code": "MV",
    "name": "Maldives",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Male",
    "longitude": "73.5109",
    "latitude": "4.1742",
    "flag": "🇲🇻",
    "flagUrl": "https://flagcdn.com/w320/mv.png",
    "currencies": "Maldivian rufiyaa (.ރ)",
    "languages": "Maldivian",
    "subregion": "Southern Asia",
    "area": 300,
    "borders": []
  },
  "zq": {
    "id": "MEA",
    "iso2Code": "ZQ",
    "name": "Middle East, North Africa, Afghanistan & Pakistan",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zq.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "mx": {
    "id": "MEX",
    "iso2Code": "MX",
    "name": "Mexico",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Mexico City",
    "longitude": "-99.1276",
    "latitude": "19.427",
    "flag": "🇲🇽",
    "flagUrl": "https://flagcdn.com/w320/mx.png",
    "currencies": "Mexican peso ($)",
    "languages": "Spanish",
    "subregion": "North America",
    "area": 1964375,
    "borders": [
      "BLZ",
      "GTM",
      "USA"
    ]
  },
  "mh": {
    "id": "MHL",
    "iso2Code": "MH",
    "name": "Marshall Islands",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Majuro",
    "longitude": "171.135",
    "latitude": "7.11046",
    "flag": "🇲🇭",
    "flagUrl": "https://flagcdn.com/w320/mh.png",
    "currencies": "United States dollar ($)",
    "languages": "English, Marshallese",
    "subregion": "Micronesia",
    "area": 181,
    "borders": []
  },
  "xp": {
    "id": "MIC",
    "iso2Code": "XP",
    "name": "Middle income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xp.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "mk": {
    "id": "MKD",
    "iso2Code": "MK",
    "name": "North Macedonia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Skopje",
    "longitude": "21.4361",
    "latitude": "42.0024",
    "flag": "🇲🇰",
    "flagUrl": "https://flagcdn.com/w320/mk.png",
    "currencies": "denar (den)",
    "languages": "Macedonian",
    "subregion": "Southeast Europe",
    "area": 25713,
    "borders": [
      "ALB",
      "BGR",
      "GRC",
      "UNK",
      "SRB"
    ]
  },
  "ml": {
    "id": "MLI",
    "iso2Code": "ML",
    "name": "Mali",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Bamako",
    "longitude": "-7.50034",
    "latitude": "13.5667",
    "flag": "🇲🇱",
    "flagUrl": "https://flagcdn.com/w320/ml.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 1240192,
    "borders": [
      "DZA",
      "BFA",
      "GIN",
      "CIV",
      "MRT",
      "NER",
      "SEN"
    ]
  },
  "mt": {
    "id": "MLT",
    "iso2Code": "MT",
    "name": "Malta",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Valletta",
    "longitude": "14.5189",
    "latitude": "35.9042",
    "flag": "🇲🇹",
    "flagUrl": "https://flagcdn.com/w320/mt.png",
    "currencies": "Euro (€)",
    "languages": "English, Maltese",
    "subregion": "Southern Europe",
    "area": 316,
    "borders": []
  },
  "mm": {
    "id": "MMR",
    "iso2Code": "MM",
    "name": "Myanmar",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Naypyidaw",
    "longitude": "95.9562",
    "latitude": "21.914",
    "flag": "🇲🇲",
    "flagUrl": "https://flagcdn.com/w320/mm.png",
    "currencies": "Burmese kyat (Ks)",
    "languages": "Burmese",
    "subregion": "South-Eastern Asia",
    "area": 676578,
    "borders": [
      "BGD",
      "CHN",
      "IND",
      "LAO",
      "THA"
    ]
  },
  "xq": {
    "id": "MNA",
    "iso2Code": "XQ",
    "name": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xq.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "me": {
    "id": "MNE",
    "iso2Code": "ME",
    "name": "Montenegro",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Podgorica",
    "longitude": "19.2595",
    "latitude": "42.4602",
    "flag": "🇲🇪",
    "flagUrl": "https://flagcdn.com/w320/me.png",
    "currencies": "Euro (€)",
    "languages": "Montenegrin",
    "subregion": "Southeast Europe",
    "area": 13812,
    "borders": [
      "ALB",
      "BIH",
      "HRV",
      "UNK",
      "SRB"
    ]
  },
  "mn": {
    "id": "MNG",
    "iso2Code": "MN",
    "name": "Mongolia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Ulaanbaatar",
    "longitude": "106.937",
    "latitude": "47.9129",
    "flag": "🇲🇳",
    "flagUrl": "https://flagcdn.com/w320/mn.png",
    "currencies": "Mongolian tögrög (₮)",
    "languages": "Mongolian",
    "subregion": "Eastern Asia",
    "area": 1564110,
    "borders": [
      "CHN",
      "RUS"
    ]
  },
  "mp": {
    "id": "MNP",
    "iso2Code": "MP",
    "name": "Northern Mariana Islands",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Saipan",
    "longitude": "145.765",
    "latitude": "15.1935",
    "flag": "🇲🇵",
    "flagUrl": "https://flagcdn.com/w320/mp.png",
    "currencies": "United States dollar ($)",
    "languages": "Carolinian, Chamorro, English",
    "subregion": "Micronesia",
    "area": 464,
    "borders": []
  },
  "mz": {
    "id": "MOZ",
    "iso2Code": "MZ",
    "name": "Mozambique",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Maputo",
    "longitude": "32.5713",
    "latitude": "-25.9664",
    "flag": "🇲🇿",
    "flagUrl": "https://flagcdn.com/w320/mz.png",
    "currencies": "Mozambican metical (MT)",
    "languages": "Portuguese",
    "subregion": "Eastern Africa",
    "area": 801590,
    "borders": [
      "MWI",
      "ZAF",
      "SWZ",
      "TZA",
      "ZMB",
      "ZWE"
    ]
  },
  "mr": {
    "id": "MRT",
    "iso2Code": "MR",
    "name": "Mauritania",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Nouakchott",
    "longitude": "-15.9824",
    "latitude": "18.2367",
    "flag": "🇲🇷",
    "flagUrl": "https://flagcdn.com/w320/mr.png",
    "currencies": "Mauritanian ouguiya (UM)",
    "languages": "Arabic",
    "subregion": "Western Africa",
    "area": 1030700,
    "borders": [
      "DZA",
      "MLI",
      "SEN",
      "ESH"
    ]
  },
  "mu": {
    "id": "MUS",
    "iso2Code": "MU",
    "name": "Mauritius",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Port Louis",
    "longitude": "57.4977",
    "latitude": "-20.1605",
    "flag": "🇲🇺",
    "flagUrl": "https://flagcdn.com/w320/mu.png",
    "currencies": "Mauritian rupee (₨)",
    "languages": "English, French, Mauritian Creole",
    "subregion": "Eastern Africa",
    "area": 2040,
    "borders": []
  },
  "mw": {
    "id": "MWI",
    "iso2Code": "MW",
    "name": "Malawi",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Lilongwe",
    "longitude": "33.7703",
    "latitude": "-13.9899",
    "flag": "🇲🇼",
    "flagUrl": "https://flagcdn.com/w320/mw.png",
    "currencies": "Malawian kwacha (MK)",
    "languages": "English, Chewa",
    "subregion": "Eastern Africa",
    "area": 118484,
    "borders": [
      "MOZ",
      "TZA",
      "ZMB"
    ]
  },
  "my": {
    "id": "MYS",
    "iso2Code": "MY",
    "name": "Malaysia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Kuala Lumpur",
    "longitude": "101.684",
    "latitude": "3.12433",
    "flag": "🇲🇾",
    "flagUrl": "https://flagcdn.com/w320/my.png",
    "currencies": "Malaysian ringgit (RM)",
    "languages": "English, Malay",
    "subregion": "South-Eastern Asia",
    "area": 330803,
    "borders": [
      "BRN",
      "IDN",
      "THA"
    ]
  },
  "xu": {
    "id": "NAC",
    "iso2Code": "XU",
    "name": "North America",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xu.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "m2": {
    "id": "NAF",
    "iso2Code": "M2",
    "name": "North Africa",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/m2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "na": {
    "id": "NAM",
    "iso2Code": "NA",
    "name": "Namibia",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Windhoek",
    "longitude": "17.0931",
    "latitude": "-22.5648",
    "flag": "🇳🇦",
    "flagUrl": "https://flagcdn.com/w320/na.png",
    "currencies": "Namibian dollar ($), South African rand (R)",
    "languages": "Afrikaans, German, English, Herero, Khoekhoe, Kwangali, Lozi, Ndonga, Tswana",
    "subregion": "Southern Africa",
    "area": 825615,
    "borders": [
      "AGO",
      "BWA",
      "ZAF",
      "ZMB"
    ]
  },
  "nc": {
    "id": "NCL",
    "iso2Code": "NC",
    "name": "New Caledonia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Noum'ea",
    "longitude": "166.464",
    "latitude": "-22.2677",
    "flag": "🇳🇨",
    "flagUrl": "https://flagcdn.com/w320/nc.png",
    "currencies": "CFP franc (₣)",
    "languages": "French",
    "subregion": "Melanesia",
    "area": 18575,
    "borders": []
  },
  "ne": {
    "id": "NER",
    "iso2Code": "NE",
    "name": "Niger",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Niamey",
    "longitude": "2.1073",
    "latitude": "13.514",
    "flag": "🇳🇪",
    "flagUrl": "https://flagcdn.com/w320/ne.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 1267000,
    "borders": [
      "DZA",
      "BEN",
      "BFA",
      "TCD",
      "LBY",
      "MLI",
      "NGA"
    ]
  },
  "ng": {
    "id": "NGA",
    "iso2Code": "NG",
    "name": "Nigeria",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Abuja",
    "longitude": "7.48906",
    "latitude": "9.05804",
    "flag": "🇳🇬",
    "flagUrl": "https://flagcdn.com/w320/ng.png",
    "currencies": "Nigerian naira (₦)",
    "languages": "English",
    "subregion": "Western Africa",
    "area": 923768,
    "borders": [
      "BEN",
      "CMR",
      "TCD",
      "NER"
    ]
  },
  "ni": {
    "id": "NIC",
    "iso2Code": "NI",
    "name": "Nicaragua",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Managua",
    "longitude": "-86.2734",
    "latitude": "12.1475",
    "flag": "🇳🇮",
    "flagUrl": "https://flagcdn.com/w320/ni.png",
    "currencies": "Nicaraguan córdoba (C$)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 130373,
    "borders": [
      "CRI",
      "HND"
    ]
  },
  "nl": {
    "id": "NLD",
    "iso2Code": "NL",
    "name": "Netherlands",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Amsterdam",
    "longitude": "4.89095",
    "latitude": "52.3738",
    "flag": "🇳🇱",
    "flagUrl": "https://flagcdn.com/w320/nl.png",
    "currencies": "Euro (€)",
    "languages": "Dutch",
    "subregion": "Western Europe",
    "area": 41850,
    "borders": [
      "BEL",
      "DEU"
    ]
  },
  "no": {
    "id": "NOR",
    "iso2Code": "NO",
    "name": "Norway",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Oslo",
    "longitude": "10.7387",
    "latitude": "59.9138",
    "flag": "🇳🇴",
    "flagUrl": "https://flagcdn.com/w320/no.png",
    "currencies": "Norwegian krone (kr)",
    "languages": "Norwegian Nynorsk, Norwegian Bokmål, Sami",
    "subregion": "Northern Europe",
    "area": 323802,
    "borders": [
      "FIN",
      "SWE",
      "RUS"
    ]
  },
  "np": {
    "id": "NPL",
    "iso2Code": "NP",
    "name": "Nepal",
    "region": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "adminregion": {
      "id": "SAS",
      "iso2code": "8S",
      "value": "South Asia"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Kathmandu",
    "longitude": "85.3157",
    "latitude": "27.6939",
    "flag": "🇳🇵",
    "flagUrl": "https://flagcdn.com/w320/np.png",
    "currencies": "Nepalese rupee (₨)",
    "languages": "Nepali",
    "subregion": "Southern Asia",
    "area": 147181,
    "borders": [
      "CHN",
      "IND"
    ]
  },
  "6x": {
    "id": "NRS",
    "iso2Code": "6X",
    "name": "Non-resource rich Sub-Saharan Africa countries",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/6x.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "nr": {
    "id": "NRU",
    "iso2Code": "NR",
    "name": "Naoero",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Yaren District",
    "longitude": "166.920867",
    "latitude": "-0.5477",
    "flag": "🇳🇷",
    "flagUrl": "https://flagcdn.com/w320/nr.png",
    "currencies": "Australian dollar ($)",
    "languages": "English, Nauru",
    "subregion": "Micronesia",
    "area": 21,
    "borders": []
  },
  "6n": {
    "id": "NXS",
    "iso2Code": "6N",
    "name": "IDA countries not classified as fragile situations, excluding Sub-Saharan Africa",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/6n.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "nz": {
    "id": "NZL",
    "iso2Code": "NZ",
    "name": "New Zealand",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Wellington",
    "longitude": "174.776",
    "latitude": "-41.2865",
    "flag": "🇳🇿",
    "flagUrl": "https://flagcdn.com/w320/nz.png",
    "currencies": "New Zealand dollar ($)",
    "languages": "English, Māori, New Zealand Sign Language",
    "subregion": "Australia and New Zealand",
    "area": 270467,
    "borders": []
  },
  "oe": {
    "id": "OED",
    "iso2Code": "OE",
    "name": "OECD members",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/oe.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "om": {
    "id": "OMN",
    "iso2Code": "OM",
    "name": "Oman",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Muscat",
    "longitude": "58.5874",
    "latitude": "23.6105",
    "flag": "🇴🇲",
    "flagUrl": "https://flagcdn.com/w320/om.png",
    "currencies": "Omani rial (ر.ع.)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 309500,
    "borders": [
      "SAU",
      "ARE",
      "YEM"
    ]
  },
  "s4": {
    "id": "OSS",
    "iso2Code": "S4",
    "name": "Other small states",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/s4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "pk": {
    "id": "PAK",
    "iso2Code": "PK",
    "name": "Pakistan",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Islamabad",
    "longitude": "72.8",
    "latitude": "30.5167",
    "flag": "🇵🇰",
    "flagUrl": "https://flagcdn.com/w320/pk.png",
    "currencies": "Pakistani rupee (₨)",
    "languages": "English, Urdu",
    "subregion": "Southern Asia",
    "area": 881912,
    "borders": [
      "AFG",
      "CHN",
      "IND",
      "IRN"
    ]
  },
  "pa": {
    "id": "PAN",
    "iso2Code": "PA",
    "name": "Panama",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Panama City",
    "longitude": "-79.5188",
    "latitude": "8.99427",
    "flag": "🇵🇦",
    "flagUrl": "https://flagcdn.com/w320/pa.png",
    "currencies": "Panamanian balboa (B/.), United States dollar ($)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 75417,
    "borders": [
      "COL",
      "CRI"
    ]
  },
  "pe": {
    "id": "PER",
    "iso2Code": "PE",
    "name": "Peru",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Lima",
    "longitude": "-77.0465",
    "latitude": "-12.0931",
    "flag": "🇵🇪",
    "flagUrl": "https://flagcdn.com/w320/pe.png",
    "currencies": "Peruvian sol (S/.)",
    "languages": "Aymara, Quechua, Spanish",
    "subregion": "South America",
    "area": 1285216,
    "borders": [
      "BOL",
      "BRA",
      "CHL",
      "COL",
      "ECU"
    ]
  },
  "ph": {
    "id": "PHL",
    "iso2Code": "PH",
    "name": "Philippines",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Manila",
    "longitude": "121.035",
    "latitude": "14.5515",
    "flag": "🇵🇭",
    "flagUrl": "https://flagcdn.com/w320/ph.png",
    "currencies": "Philippine peso (₱)",
    "languages": "English, Filipino",
    "subregion": "South-Eastern Asia",
    "area": 342353,
    "borders": []
  },
  "pw": {
    "id": "PLW",
    "iso2Code": "PW",
    "name": "Palau",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Koror",
    "longitude": "134.479",
    "latitude": "7.34194",
    "flag": "🇵🇼",
    "flagUrl": "https://flagcdn.com/w320/pw.png",
    "currencies": "United States dollar ($)",
    "languages": "English, Palauan",
    "subregion": "Micronesia",
    "area": 459,
    "borders": []
  },
  "pg": {
    "id": "PNG",
    "iso2Code": "PG",
    "name": "Papua New Guinea",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Port Moresby",
    "longitude": "147.194",
    "latitude": "-9.47357",
    "flag": "🇵🇬",
    "flagUrl": "https://flagcdn.com/w320/pg.png",
    "currencies": "Papua New Guinean kina (K)",
    "languages": "English, Hiri Motu, Tok Pisin",
    "subregion": "Melanesia",
    "area": 462840,
    "borders": [
      "IDN"
    ]
  },
  "pl": {
    "id": "POL",
    "iso2Code": "PL",
    "name": "Poland",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Warsaw",
    "longitude": "21.02",
    "latitude": "52.26",
    "flag": "🇵🇱",
    "flagUrl": "https://flagcdn.com/w320/pl.png",
    "currencies": "Polish złoty (zł)",
    "languages": "Polish",
    "subregion": "Central Europe",
    "area": 312679,
    "borders": [
      "BLR",
      "CZE",
      "DEU",
      "LTU",
      "RUS",
      "SVK",
      "UKR"
    ]
  },
  "v1": {
    "id": "PRE",
    "iso2Code": "V1",
    "name": "Pre-demographic dividend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/v1.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "pr": {
    "id": "PRI",
    "iso2Code": "PR",
    "name": "Puerto Rico (US)",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "San Juan",
    "longitude": "-66",
    "latitude": "18.23",
    "flag": "🇵🇷",
    "flagUrl": "https://flagcdn.com/w320/pr.png",
    "currencies": "United States dollar ($)",
    "languages": "English, Spanish",
    "subregion": "Caribbean",
    "area": 8870,
    "borders": []
  },
  "kp": {
    "id": "PRK",
    "iso2Code": "KP",
    "name": "Korea, Dem. People's Rep.",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Pyongyang",
    "longitude": "125.754",
    "latitude": "39.0319",
    "flag": "🇰🇵",
    "flagUrl": "https://flagcdn.com/w320/kp.png",
    "currencies": "North Korean won (₩)",
    "languages": "Korean",
    "subregion": "Eastern Asia",
    "area": 120538,
    "borders": [
      "CHN",
      "KOR",
      "RUS"
    ]
  },
  "pt": {
    "id": "PRT",
    "iso2Code": "PT",
    "name": "Portugal",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Lisbon",
    "longitude": "-9.13552",
    "latitude": "38.7072",
    "flag": "🇵🇹",
    "flagUrl": "https://flagcdn.com/w320/pt.png",
    "currencies": "Euro (€)",
    "languages": "Portuguese",
    "subregion": "Southern Europe",
    "area": 92090,
    "borders": [
      "ESP"
    ]
  },
  "py": {
    "id": "PRY",
    "iso2Code": "PY",
    "name": "Paraguay",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Asuncion",
    "longitude": "-57.6362",
    "latitude": "-25.3005",
    "flag": "🇵🇾",
    "flagUrl": "https://flagcdn.com/w320/py.png",
    "currencies": "Paraguayan guaraní (₲)",
    "languages": "Guaraní, Spanish",
    "subregion": "South America",
    "area": 406752,
    "borders": [
      "ARG",
      "BOL",
      "BRA"
    ]
  },
  "ps": {
    "id": "PSE",
    "iso2Code": "PS",
    "name": "West Bank and Gaza",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Ramallah",
    "longitude": "35.2",
    "latitude": "31.9",
    "flag": "🇵🇸",
    "flagUrl": "https://flagcdn.com/w320/ps.png",
    "currencies": "Egyptian pound (E£), Israeli new shekel (₪), Jordanian dinar (JD)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 6220,
    "borders": [
      "ISR",
      "EGY",
      "JOR"
    ]
  },
  "s2": {
    "id": "PSS",
    "iso2Code": "S2",
    "name": "Pacific island small states",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/s2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "v4": {
    "id": "PST",
    "iso2Code": "V4",
    "name": "Post-demographic dividend",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/v4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "pf": {
    "id": "PYF",
    "iso2Code": "PF",
    "name": "French Polynesia",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Papeete",
    "longitude": "-149.57",
    "latitude": "-17.535",
    "flag": "🇵🇫",
    "flagUrl": "https://flagcdn.com/w320/pf.png",
    "currencies": "CFP franc (₣)",
    "languages": "French",
    "subregion": "Polynesia",
    "area": 4167,
    "borders": []
  },
  "qa": {
    "id": "QAT",
    "iso2Code": "QA",
    "name": "Qatar",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Doha",
    "longitude": "51.5082",
    "latitude": "25.2948",
    "flag": "🇶🇦",
    "flagUrl": "https://flagcdn.com/w320/qa.png",
    "currencies": "Qatari riyal (ر.ق)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 11586,
    "borders": [
      "SAU"
    ]
  },
  "ro": {
    "id": "ROU",
    "iso2Code": "RO",
    "name": "Romania",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Bucharest",
    "longitude": "26.0979",
    "latitude": "44.4479",
    "flag": "🇷🇴",
    "flagUrl": "https://flagcdn.com/w320/ro.png",
    "currencies": "Romanian leu (lei)",
    "languages": "Romanian",
    "subregion": "Southeast Europe",
    "area": 238391,
    "borders": [
      "BGR",
      "HUN",
      "MDA",
      "SRB",
      "UKR"
    ]
  },
  "r6": {
    "id": "RRS",
    "iso2Code": "R6",
    "name": "Resource rich Sub-Saharan Africa countries",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/r6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ru": {
    "id": "RUS",
    "iso2Code": "RU",
    "name": "Russian Federation",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Moscow",
    "longitude": "37.6176",
    "latitude": "55.7558",
    "flag": "🇷🇺",
    "flagUrl": "https://flagcdn.com/w320/ru.png",
    "currencies": "Russian ruble (₽)",
    "languages": "Russian",
    "subregion": "Eastern Europe",
    "area": 17098242,
    "borders": [
      "AZE",
      "BLR",
      "CHN",
      "EST",
      "FIN",
      "GEO",
      "KAZ",
      "PRK",
      "LVA",
      "LTU",
      "MNG",
      "NOR",
      "POL",
      "UKR"
    ]
  },
  "rw": {
    "id": "RWA",
    "iso2Code": "RW",
    "name": "Rwanda",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Kigali",
    "longitude": "30.0587",
    "latitude": "-1.95325",
    "flag": "🇷🇼",
    "flagUrl": "https://flagcdn.com/w320/rw.png",
    "currencies": "Rwandan franc (Fr)",
    "languages": "English, French, Kinyarwanda",
    "subregion": "Eastern Africa",
    "area": 26338,
    "borders": [
      "BDI",
      "COD",
      "TZA",
      "UGA"
    ]
  },
  "8s": {
    "id": "SAS",
    "iso2Code": "8S",
    "name": "South Asia",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/8s.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "sa": {
    "id": "SAU",
    "iso2Code": "SA",
    "name": "Saudi Arabia",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Riyadh",
    "longitude": "46.6977",
    "latitude": "24.6748",
    "flag": "🇸🇦",
    "flagUrl": "https://flagcdn.com/w320/sa.png",
    "currencies": "Saudi riyal (ر.س)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 2149690,
    "borders": [
      "IRQ",
      "JOR",
      "KWT",
      "OMN",
      "QAT",
      "ARE",
      "YEM"
    ]
  },
  "sd": {
    "id": "SDN",
    "iso2Code": "SD",
    "name": "Sudan",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Khartoum",
    "longitude": "32.5363",
    "latitude": "15.5932",
    "flag": "🇸🇩",
    "flagUrl": "https://flagcdn.com/w320/sd.png",
    "currencies": "Sudanese pound (PT)",
    "languages": "Arabic, English",
    "subregion": "Northern Africa",
    "area": 1886068,
    "borders": [
      "CAF",
      "TCD",
      "EGY",
      "ERI",
      "ETH",
      "LBY",
      "SSD"
    ]
  },
  "sn": {
    "id": "SEN",
    "iso2Code": "SN",
    "name": "Senegal",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Dakar",
    "longitude": "-17.4734",
    "latitude": "14.7247",
    "flag": "🇸🇳",
    "flagUrl": "https://flagcdn.com/w320/sn.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 196722,
    "borders": [
      "GMB",
      "GIN",
      "GNB",
      "MLI",
      "MRT"
    ]
  },
  "sg": {
    "id": "SGP",
    "iso2Code": "SG",
    "name": "Singapore",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Singapore",
    "longitude": "103.85",
    "latitude": "1.28941",
    "flag": "🇸🇬",
    "flagUrl": "https://flagcdn.com/w320/sg.png",
    "currencies": "Singapore dollar ($)",
    "languages": "English, Malay, Tamil, Chinese",
    "subregion": "South-Eastern Asia",
    "area": 710,
    "borders": []
  },
  "sb": {
    "id": "SLB",
    "iso2Code": "SB",
    "name": "Solomon Islands",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Honiara",
    "longitude": "159.949",
    "latitude": "-9.42676",
    "flag": "🇸🇧",
    "flagUrl": "https://flagcdn.com/w320/sb.png",
    "currencies": "Solomon Islands dollar ($)",
    "languages": "English",
    "subregion": "Melanesia",
    "area": 28896,
    "borders": []
  },
  "sl": {
    "id": "SLE",
    "iso2Code": "SL",
    "name": "Sierra Leone",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Freetown",
    "longitude": "-13.2134",
    "latitude": "8.4821",
    "flag": "🇸🇱",
    "flagUrl": "https://flagcdn.com/w320/sl.png",
    "currencies": "Sierra Leonean leone (Le)",
    "languages": "English",
    "subregion": "Western Africa",
    "area": 71740,
    "borders": [
      "GIN",
      "LBR"
    ]
  },
  "sv": {
    "id": "SLV",
    "iso2Code": "SV",
    "name": "El Salvador",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "San Salvador",
    "longitude": "-89.2073",
    "latitude": "13.7034",
    "flag": "🇸🇻",
    "flagUrl": "https://flagcdn.com/w320/sv.png",
    "currencies": "United States dollar ($)",
    "languages": "Spanish",
    "subregion": "Central America",
    "area": 21041,
    "borders": [
      "GTM",
      "HND"
    ]
  },
  "sm": {
    "id": "SMR",
    "iso2Code": "SM",
    "name": "San Marino",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "San Marino",
    "longitude": "12.4486",
    "latitude": "43.9322",
    "flag": "🇸🇲",
    "flagUrl": "https://flagcdn.com/w320/sm.png",
    "currencies": "Euro (€)",
    "languages": "Italian",
    "subregion": "Southern Europe",
    "area": 61,
    "borders": [
      "ITA"
    ]
  },
  "so": {
    "id": "SOM",
    "iso2Code": "SO",
    "name": "Somalia, Fed. Rep.",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Mogadishu",
    "longitude": "45.3254",
    "latitude": "2.07515",
    "flag": "🇸🇴",
    "flagUrl": "https://flagcdn.com/w320/so.png",
    "currencies": "Somali shilling (Sh)",
    "languages": "Arabic, Somali",
    "subregion": "Eastern Africa",
    "area": 637657,
    "borders": [
      "DJI",
      "ETH",
      "KEN"
    ]
  },
  "rs": {
    "id": "SRB",
    "iso2Code": "RS",
    "name": "Serbia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Belgrade",
    "longitude": "20.4656",
    "latitude": "44.8024",
    "flag": "🇷🇸",
    "flagUrl": "https://flagcdn.com/w320/rs.png",
    "currencies": "Serbian dinar (дин.)",
    "languages": "Serbian",
    "subregion": "Southeast Europe",
    "area": 88361,
    "borders": [
      "BIH",
      "BGR",
      "HRV",
      "HUN",
      "UNK",
      "MKD",
      "MNE",
      "ROU"
    ]
  },
  "zf": {
    "id": "SSA",
    "iso2Code": "ZF",
    "name": "Sub-Saharan Africa (excluding high income)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zf.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ss": {
    "id": "SSD",
    "iso2Code": "SS",
    "name": "South Sudan",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Juba",
    "longitude": "31.6",
    "latitude": "4.85",
    "flag": "🇸🇸",
    "flagUrl": "https://flagcdn.com/w320/ss.png",
    "currencies": "South Sudanese pound (£)",
    "languages": "English",
    "subregion": "Middle Africa",
    "area": 619745,
    "borders": [
      "CAF",
      "COD",
      "ETH",
      "KEN",
      "SDN",
      "UGA"
    ]
  },
  "zg": {
    "id": "SSF",
    "iso2Code": "ZG",
    "name": "Sub-Saharan Africa ",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/zg.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "s1": {
    "id": "SST",
    "iso2Code": "S1",
    "name": "Small states",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/s1.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "st": {
    "id": "STP",
    "iso2Code": "ST",
    "name": "Sao Tome and Principe",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Sao Tome",
    "longitude": "6.6071",
    "latitude": "0.20618",
    "flag": "🇸🇹",
    "flagUrl": "https://flagcdn.com/w320/st.png",
    "currencies": "São Tomé and Príncipe dobra (Db)",
    "languages": "Portuguese",
    "subregion": "Middle Africa",
    "area": 964,
    "borders": []
  },
  "sr": {
    "id": "SUR",
    "iso2Code": "SR",
    "name": "Suriname",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Paramaribo",
    "longitude": "-55.1679",
    "latitude": "5.8232",
    "flag": "🇸🇷",
    "flagUrl": "https://flagcdn.com/w320/sr.png",
    "currencies": "Surinamese dollar ($)",
    "languages": "Dutch",
    "subregion": "South America",
    "area": 163820,
    "borders": [
      "BRA",
      "GUF",
      "GUY"
    ]
  },
  "sk": {
    "id": "SVK",
    "iso2Code": "SK",
    "name": "Slovak Republic",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Bratislava",
    "longitude": "17.1073",
    "latitude": "48.1484",
    "flag": "🇸🇰",
    "flagUrl": "https://flagcdn.com/w320/sk.png",
    "currencies": "Euro (€)",
    "languages": "Slovak",
    "subregion": "Central Europe",
    "area": 49037,
    "borders": [
      "AUT",
      "CZE",
      "HUN",
      "POL",
      "UKR"
    ]
  },
  "si": {
    "id": "SVN",
    "iso2Code": "SI",
    "name": "Slovenia",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Ljubljana",
    "longitude": "14.5044",
    "latitude": "46.0546",
    "flag": "🇸🇮",
    "flagUrl": "https://flagcdn.com/w320/si.png",
    "currencies": "Euro (€)",
    "languages": "Slovene",
    "subregion": "Central Europe",
    "area": 20273,
    "borders": [
      "AUT",
      "HRV",
      "ITA",
      "HUN"
    ]
  },
  "se": {
    "id": "SWE",
    "iso2Code": "SE",
    "name": "Sweden",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Stockholm",
    "longitude": "18.0645",
    "latitude": "59.3327",
    "flag": "🇸🇪",
    "flagUrl": "https://flagcdn.com/w320/se.png",
    "currencies": "Swedish krona (kr)",
    "languages": "Swedish",
    "subregion": "Northern Europe",
    "area": 450295,
    "borders": [
      "FIN",
      "NOR"
    ]
  },
  "sz": {
    "id": "SWZ",
    "iso2Code": "SZ",
    "name": "Eswatini",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Mbabane",
    "longitude": "31.4659",
    "latitude": "-26.5225",
    "flag": "🇸🇿",
    "flagUrl": "https://flagcdn.com/w320/sz.png",
    "currencies": "Swazi lilangeni (L), South African rand (R)",
    "languages": "English, Swazi",
    "subregion": "Southern Africa",
    "area": 17364,
    "borders": [
      "MOZ",
      "ZAF"
    ]
  },
  "sx": {
    "id": "SXM",
    "iso2Code": "SX",
    "name": "Sint Maarten (Dutch part)",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Philipsburg",
    "longitude": "-63.05",
    "latitude": "18.033333",
    "flag": "🇸🇽",
    "flagUrl": "https://flagcdn.com/w320/sx.png",
    "currencies": "Netherlands Antillean guilder (ƒ)",
    "languages": "English, French, Dutch",
    "subregion": "Caribbean",
    "area": 34,
    "borders": [
      "MAF"
    ]
  },
  "a4": {
    "id": "SXZ",
    "iso2Code": "A4",
    "name": "Sub-Saharan Africa excluding South Africa",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/a4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "sc": {
    "id": "SYC",
    "iso2Code": "SC",
    "name": "Seychelles",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Victoria",
    "longitude": "55.4466",
    "latitude": "-4.6309",
    "flag": "🇸🇨",
    "flagUrl": "https://flagcdn.com/w320/sc.png",
    "currencies": "Seychellois rupee (₨)",
    "languages": "Seychellois Creole, English, French",
    "subregion": "Eastern Africa",
    "area": 452,
    "borders": []
  },
  "sy": {
    "id": "SYR",
    "iso2Code": "SY",
    "name": "Syrian Arab Republic",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Damascus",
    "longitude": "36.3119",
    "latitude": "33.5146",
    "flag": "🇸🇾",
    "flagUrl": "https://flagcdn.com/w320/sy.png",
    "currencies": "Syrian pound (£)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 185180,
    "borders": [
      "IRQ",
      "ISR",
      "JOR",
      "LBN",
      "TUR"
    ]
  },
  "tc": {
    "id": "TCA",
    "iso2Code": "TC",
    "name": "Turks and Caicos Islands",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Grand Turk",
    "longitude": "-71.141389",
    "latitude": "21.4602778",
    "flag": "🇹🇨",
    "flagUrl": "https://flagcdn.com/w320/tc.png",
    "currencies": "United States dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 948,
    "borders": []
  },
  "td": {
    "id": "TCD",
    "iso2Code": "TD",
    "name": "Chad",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "N'Djamena",
    "longitude": "15.0445",
    "latitude": "12.1048",
    "flag": "🇹🇩",
    "flagUrl": "https://flagcdn.com/w320/td.png",
    "currencies": "Central African CFA franc (Fr)",
    "languages": "Arabic, French",
    "subregion": "Middle Africa",
    "area": 1284000,
    "borders": [
      "CMR",
      "CAF",
      "LBY",
      "NER",
      "NGA",
      "SDN"
    ]
  },
  "t4": {
    "id": "TEA",
    "iso2Code": "T4",
    "name": "East Asia & Pacific (IDA & IBRD countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t4.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "t7": {
    "id": "TEC",
    "iso2Code": "T7",
    "name": "Europe & Central Asia (IDA & IBRD countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t7.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "tg": {
    "id": "TGO",
    "iso2Code": "TG",
    "name": "Togo",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Lome",
    "longitude": "1.2255",
    "latitude": "6.1228",
    "flag": "🇹🇬",
    "flagUrl": "https://flagcdn.com/w320/tg.png",
    "currencies": "West African CFA franc (Fr)",
    "languages": "French",
    "subregion": "Western Africa",
    "area": 56785,
    "borders": [
      "BEN",
      "BFA",
      "GHA"
    ]
  },
  "th": {
    "id": "THA",
    "iso2Code": "TH",
    "name": "Thailand",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Bangkok",
    "longitude": "100.521",
    "latitude": "13.7308",
    "flag": "🇹🇭",
    "flagUrl": "https://flagcdn.com/w320/th.png",
    "currencies": "Thai baht (฿)",
    "languages": "Thai",
    "subregion": "South-Eastern Asia",
    "area": 513120,
    "borders": [
      "MMR",
      "KHM",
      "LAO",
      "MYS"
    ]
  },
  "tj": {
    "id": "TJK",
    "iso2Code": "TJ",
    "name": "Tajikistan",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Dushanbe",
    "longitude": "68.7864",
    "latitude": "38.5878",
    "flag": "🇹🇯",
    "flagUrl": "https://flagcdn.com/w320/tj.png",
    "currencies": "Tajikistani somoni (ЅМ)",
    "languages": "Russian, Tajik",
    "subregion": "Central Asia",
    "area": 143100,
    "borders": [
      "AFG",
      "CHN",
      "KGZ",
      "UZB"
    ]
  },
  "tm": {
    "id": "TKM",
    "iso2Code": "TM",
    "name": "Turkmenistan",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Ashgabat",
    "longitude": "58.3794",
    "latitude": "37.9509",
    "flag": "🇹🇲",
    "flagUrl": "https://flagcdn.com/w320/tm.png",
    "currencies": "Turkmenistan manat (m)",
    "languages": "Russian, Turkmen",
    "subregion": "Central Asia",
    "area": 488100,
    "borders": [
      "AFG",
      "IRN",
      "KAZ",
      "UZB"
    ]
  },
  "t2": {
    "id": "TLA",
    "iso2Code": "T2",
    "name": "Latin America & the Caribbean (IDA & IBRD countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t2.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "tl": {
    "id": "TLS",
    "iso2Code": "TL",
    "name": "Timor-Leste",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Dili",
    "longitude": "125.567",
    "latitude": "-8.56667",
    "flag": "🇹🇱",
    "flagUrl": "https://flagcdn.com/w320/tl.png",
    "currencies": "United States dollar ($)",
    "languages": "Portuguese, Tetum",
    "subregion": "South-Eastern Asia",
    "area": 14874,
    "borders": [
      "IDN"
    ]
  },
  "t3": {
    "id": "TMN",
    "iso2Code": "T3",
    "name": "Middle East, North Africa, Afghanistan & Pakistan (IDA & IBRD)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t3.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "to": {
    "id": "TON",
    "iso2Code": "TO",
    "name": "Tonga",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Nuku'alofa",
    "longitude": "-175.216",
    "latitude": "-21.136",
    "flag": "🇹🇴",
    "flagUrl": "https://flagcdn.com/w320/to.png",
    "currencies": "Tongan paʻanga (T$)",
    "languages": "English, Tongan",
    "subregion": "Polynesia",
    "area": 747,
    "borders": []
  },
  "t5": {
    "id": "TSA",
    "iso2Code": "T5",
    "name": "South Asia (IDA & IBRD)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t5.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "t6": {
    "id": "TSS",
    "iso2Code": "T6",
    "name": "Sub-Saharan Africa (IDA & IBRD countries)",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/t6.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "tt": {
    "id": "TTO",
    "iso2Code": "TT",
    "name": "Trinidad and Tobago",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Port-of-Spain",
    "longitude": "-61.4789",
    "latitude": "10.6596",
    "flag": "🇹🇹",
    "flagUrl": "https://flagcdn.com/w320/tt.png",
    "currencies": "Trinidad and Tobago dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 5130,
    "borders": []
  },
  "tn": {
    "id": "TUN",
    "iso2Code": "TN",
    "name": "Tunisia",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Tunis",
    "longitude": "10.21",
    "latitude": "36.7899",
    "flag": "🇹🇳",
    "flagUrl": "https://flagcdn.com/w320/tn.png",
    "currencies": "Tunisian dinar (د.ت)",
    "languages": "Arabic",
    "subregion": "Northern Africa",
    "area": 163610,
    "borders": [
      "DZA",
      "LBY"
    ]
  },
  "tr": {
    "id": "TUR",
    "iso2Code": "TR",
    "name": "Turkiye",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Ankara",
    "longitude": "32.3606",
    "latitude": "39.7153",
    "flag": "🇹🇷",
    "flagUrl": "https://flagcdn.com/w320/tr.png",
    "currencies": "Turkish lira (₺)",
    "languages": "Turkish",
    "subregion": "Western Asia",
    "area": 783562,
    "borders": [
      "ARM",
      "AZE",
      "BGR",
      "GEO",
      "GRC",
      "IRN",
      "IRQ",
      "SYR"
    ]
  },
  "tv": {
    "id": "TUV",
    "iso2Code": "TV",
    "name": "Tuvalu",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Funafuti",
    "longitude": "179.089567",
    "latitude": "-8.6314877",
    "flag": "🇹🇻",
    "flagUrl": "https://flagcdn.com/w320/tv.png",
    "currencies": "Australian dollar ($), Tuvaluan dollar ($)",
    "languages": "English, Tuvaluan",
    "subregion": "Polynesia",
    "area": 26,
    "borders": []
  },
  "tz": {
    "id": "TZA",
    "iso2Code": "TZ",
    "name": "Tanzania",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Dodoma",
    "longitude": "35.7382",
    "latitude": "-6.17486",
    "flag": "🇹🇿",
    "flagUrl": "https://flagcdn.com/w320/tz.png",
    "currencies": "Tanzanian shilling (Sh)",
    "languages": "English, Swahili",
    "subregion": "Eastern Africa",
    "area": 945087,
    "borders": [
      "BDI",
      "COD",
      "KEN",
      "MWI",
      "MOZ",
      "RWA",
      "UGA",
      "ZMB"
    ]
  },
  "ug": {
    "id": "UGA",
    "iso2Code": "UG",
    "name": "Uganda",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Kampala",
    "longitude": "32.5729",
    "latitude": "0.314269",
    "flag": "🇺🇬",
    "flagUrl": "https://flagcdn.com/w320/ug.png",
    "currencies": "Ugandan shilling (Sh)",
    "languages": "English, Swahili",
    "subregion": "Eastern Africa",
    "area": 241550,
    "borders": [
      "COD",
      "KEN",
      "RWA",
      "SSD",
      "TZA"
    ]
  },
  "ua": {
    "id": "UKR",
    "iso2Code": "UA",
    "name": "Ukraine",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Kiev",
    "longitude": "30.5038",
    "latitude": "50.4536",
    "flag": "🇺🇦",
    "flagUrl": "https://flagcdn.com/w320/ua.png",
    "currencies": "Ukrainian hryvnia (₴)",
    "languages": "Ukrainian",
    "subregion": "Eastern Europe",
    "area": 603500,
    "borders": [
      "BLR",
      "HUN",
      "MDA",
      "POL",
      "ROU",
      "RUS",
      "SVK"
    ]
  },
  "xt": {
    "id": "UMC",
    "iso2Code": "XT",
    "name": "Upper middle income",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/xt.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "uy": {
    "id": "URY",
    "iso2Code": "UY",
    "name": "Uruguay",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Montevideo",
    "longitude": "-56.0675",
    "latitude": "-34.8941",
    "flag": "🇺🇾",
    "flagUrl": "https://flagcdn.com/w320/uy.png",
    "currencies": "Uruguayan peso ($)",
    "languages": "Spanish",
    "subregion": "South America",
    "area": 181034,
    "borders": [
      "ARG",
      "BRA"
    ]
  },
  "us": {
    "id": "USA",
    "iso2Code": "US",
    "name": "United States",
    "region": {
      "id": "NAC",
      "iso2code": "XU",
      "value": "North America"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Washington D.C.",
    "longitude": "-77.032",
    "latitude": "38.8895",
    "flag": "🇺🇸",
    "flagUrl": "https://flagcdn.com/w320/us.png",
    "currencies": "United States dollar ($)",
    "languages": "English",
    "subregion": "North America",
    "area": 9372610,
    "borders": [
      "CAN",
      "MEX"
    ]
  },
  "uz": {
    "id": "UZB",
    "iso2Code": "UZ",
    "name": "Uzbekistan",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Tashkent",
    "longitude": "69.269",
    "latitude": "41.3052",
    "flag": "🇺🇿",
    "flagUrl": "https://flagcdn.com/w320/uz.png",
    "currencies": "Uzbekistani soʻm (so'm)",
    "languages": "Russian, Uzbek",
    "subregion": "Central Asia",
    "area": 447400,
    "borders": [
      "AFG",
      "KAZ",
      "KGZ",
      "TJK",
      "TKM"
    ]
  },
  "vc": {
    "id": "VCT",
    "iso2Code": "VC",
    "name": "St. Vincent and the Grenadines",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Kingstown",
    "longitude": "-61.2653",
    "latitude": "13.2035",
    "flag": "🇻🇨",
    "flagUrl": "https://flagcdn.com/w320/vc.png",
    "currencies": "Eastern Caribbean dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 389,
    "borders": []
  },
  "ve": {
    "id": "VEN",
    "iso2Code": "VE",
    "name": "Venezuela, RB",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "LAC",
      "iso2code": "XJ",
      "value": "Latin America & Caribbean (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Caracas",
    "longitude": "-69.8371",
    "latitude": "9.08165",
    "flag": "🇻🇪",
    "flagUrl": "https://flagcdn.com/w320/ve.png",
    "currencies": "Venezuelan bolívar soberano (Bs.S.)",
    "languages": "Spanish",
    "subregion": "South America",
    "area": 916445,
    "borders": [
      "BRA",
      "COL",
      "GUY"
    ]
  },
  "vg": {
    "id": "VGB",
    "iso2Code": "VG",
    "name": "British Virgin Islands",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Road Town",
    "longitude": "-64.623056",
    "latitude": "18.431389",
    "flag": "🇻🇬",
    "flagUrl": "https://flagcdn.com/w320/vg.png",
    "currencies": "United States dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 151,
    "borders": []
  },
  "vi": {
    "id": "VIR",
    "iso2Code": "VI",
    "name": "Virgin Islands (U.S.)",
    "region": {
      "id": "LCN",
      "iso2code": "ZJ",
      "value": "Latin America & Caribbean "
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "HIC",
      "iso2code": "XD",
      "value": "High income"
    },
    "lendingType": {
      "id": "LNX",
      "iso2code": "XX",
      "value": "Not classified"
    },
    "capitalCity": "Charlotte Amalie",
    "longitude": "-64.8963",
    "latitude": "18.3358",
    "flag": "🇻🇮",
    "flagUrl": "https://flagcdn.com/w320/vi.png",
    "currencies": "United States dollar ($)",
    "languages": "English",
    "subregion": "Caribbean",
    "area": 347,
    "borders": []
  },
  "vn": {
    "id": "VNM",
    "iso2Code": "VN",
    "name": "Viet Nam",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Hanoi",
    "longitude": "105.825",
    "latitude": "21.0069",
    "flag": "🇻🇳",
    "flagUrl": "https://flagcdn.com/w320/vn.png",
    "currencies": "Vietnamese đồng (₫)",
    "languages": "Vietnamese",
    "subregion": "South-Eastern Asia",
    "area": 331212,
    "borders": [
      "KHM",
      "CHN",
      "LAO"
    ]
  },
  "vu": {
    "id": "VUT",
    "iso2Code": "VU",
    "name": "Vanuatu",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Port-Vila",
    "longitude": "168.321",
    "latitude": "-17.7404",
    "flag": "🇻🇺",
    "flagUrl": "https://flagcdn.com/w320/vu.png",
    "currencies": "Vanuatu vatu (Vt)",
    "languages": "Bislama, English, French",
    "subregion": "Melanesia",
    "area": 12189,
    "borders": []
  },
  "1w": {
    "id": "WLD",
    "iso2Code": "1W",
    "name": "World",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/1w.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ws": {
    "id": "WSM",
    "iso2Code": "WS",
    "name": "Samoa",
    "region": {
      "id": "EAS",
      "iso2code": "Z4",
      "value": "East Asia & Pacific"
    },
    "adminregion": {
      "id": "EAP",
      "iso2code": "4E",
      "value": "East Asia & Pacific (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Apia",
    "longitude": "-171.752",
    "latitude": "-13.8314",
    "flag": "🇼🇸",
    "flagUrl": "https://flagcdn.com/w320/ws.png",
    "currencies": "Samoan tālā (T)",
    "languages": "English, Samoan",
    "subregion": "Polynesia",
    "area": 2842,
    "borders": []
  },
  "xk": {
    "id": "XKX",
    "iso2Code": "XK",
    "name": "Kosovo",
    "region": {
      "id": "ECS",
      "iso2code": "Z7",
      "value": "Europe & Central Asia"
    },
    "adminregion": {
      "id": "ECA",
      "iso2code": "7E",
      "value": "Europe & Central Asia (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Pristina",
    "longitude": "20.926",
    "latitude": "42.565",
    "flag": "🇽🇰",
    "flagUrl": "https://flagcdn.com/w320/xk.png",
    "currencies": "Euro (€)",
    "languages": "Albanian, Serbian",
    "subregion": "Southeast Europe",
    "area": 10908,
    "borders": [
      "ALB",
      "MKD",
      "MNE",
      "SRB"
    ]
  },
  "a5": {
    "id": "XZN",
    "iso2Code": "A5",
    "name": "Sub-Saharan Africa excluding South Africa and Nigeria",
    "region": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "adminregion": {
      "id": "",
      "iso2code": "",
      "value": ""
    },
    "incomeLevel": {
      "id": "NA",
      "iso2code": "NA",
      "value": "Aggregates"
    },
    "lendingType": {
      "id": "",
      "iso2code": "",
      "value": "Aggregates"
    },
    "capitalCity": "",
    "longitude": "",
    "latitude": "",
    "flag": "",
    "flagUrl": "https://flagcdn.com/w320/a5.png",
    "currencies": "",
    "languages": "",
    "subregion": "",
    "area": 0,
    "borders": []
  },
  "ye": {
    "id": "YEM",
    "iso2Code": "YE",
    "name": "Yemen, Rep.",
    "region": {
      "id": "MEA",
      "iso2code": "ZQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan"
    },
    "adminregion": {
      "id": "MNA",
      "iso2code": "XQ",
      "value": "Middle East, North Africa, Afghanistan & Pakistan (excluding high income)"
    },
    "incomeLevel": {
      "id": "LIC",
      "iso2code": "XM",
      "value": "Low income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Sana'a",
    "longitude": "44.2075",
    "latitude": "15.352",
    "flag": "🇾🇪",
    "flagUrl": "https://flagcdn.com/w320/ye.png",
    "currencies": "Yemeni rial (﷼)",
    "languages": "Arabic",
    "subregion": "Western Asia",
    "area": 527968,
    "borders": [
      "OMN",
      "SAU"
    ]
  },
  "za": {
    "id": "ZAF",
    "iso2Code": "ZA",
    "name": "South Africa",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "UMC",
      "iso2code": "XT",
      "value": "Upper middle income"
    },
    "lendingType": {
      "id": "IBD",
      "iso2code": "XF",
      "value": "IBRD"
    },
    "capitalCity": "Pretoria",
    "longitude": "28.1871",
    "latitude": "-25.746",
    "flag": "🇿🇦",
    "flagUrl": "https://flagcdn.com/w320/za.png",
    "currencies": "South African rand (R)",
    "languages": "Afrikaans, English, Southern Ndebele, Northern Sotho, Southern Sotho, Swazi, Tswana, Tsonga, Venda, Xhosa, Zulu",
    "subregion": "Southern Africa",
    "area": 1221037,
    "borders": [
      "BWA",
      "LSO",
      "MOZ",
      "NAM",
      "SWZ",
      "ZWE"
    ]
  },
  "zm": {
    "id": "ZMB",
    "iso2Code": "ZM",
    "name": "Zambia",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDX",
      "iso2code": "XI",
      "value": "IDA"
    },
    "capitalCity": "Lusaka",
    "longitude": "28.2937",
    "latitude": "-15.3982",
    "flag": "🇿🇲",
    "flagUrl": "https://flagcdn.com/w320/zm.png",
    "currencies": "Zambian kwacha (ZK)",
    "languages": "English",
    "subregion": "Eastern Africa",
    "area": 752612,
    "borders": [
      "AGO",
      "BWA",
      "COD",
      "MWI",
      "MOZ",
      "NAM",
      "TZA",
      "ZWE"
    ]
  },
  "zw": {
    "id": "ZWE",
    "iso2Code": "ZW",
    "name": "Zimbabwe",
    "region": {
      "id": "SSF",
      "iso2code": "ZG",
      "value": "Sub-Saharan Africa "
    },
    "adminregion": {
      "id": "SSA",
      "iso2code": "ZF",
      "value": "Sub-Saharan Africa (excluding high income)"
    },
    "incomeLevel": {
      "id": "LMC",
      "iso2code": "XN",
      "value": "Lower middle income"
    },
    "lendingType": {
      "id": "IDB",
      "iso2code": "XH",
      "value": "Blend"
    },
    "capitalCity": "Harare",
    "longitude": "31.0672",
    "latitude": "-17.8312",
    "flag": "🇿🇼",
    "flagUrl": "https://flagcdn.com/w320/zw.png",
    "currencies": "Botswana pula (P), Chinese yuan (¥), Euro (€), British pound (£), Indian rupee (₹), Japanese yen (¥), United States dollar ($), South African rand (Rs), Zimbabwean bonds ($)",
    "languages": "Chibarwe, English, Kalanga, Khoisan, Ndau, Northern Ndebele, Chewa, Shona, Sotho, Tonga, Tswana, Tsonga, Venda, Xhosa, Zimbabwean Sign Language",
    "subregion": "Eastern Africa",
    "area": 390757,
    "borders": [
      "BWA",
      "MOZ",
      "ZAF",
      "ZMB"
    ]
  }
};
