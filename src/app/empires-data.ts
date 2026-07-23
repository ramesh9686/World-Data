export interface HistoricalEmpire {
  id: string;
  name: string;
  region: 'South Asia' | 'Europe & Mediterranean' | 'Middle East & Eurasia' | 'East & Southeast Asia' | 'Americas' | 'Africa' | 'Global';
  era: 'Ancient' | 'Classical' | 'Medieval' | 'Early Modern' | 'Modern';
  yearSpan: string;
  peakYear: number;
  founderOrRuler: string;
  capitalCity: string;
  capitalCoords: { cx: number; cy: number }; // SVG map coordinates for capital orb
  peakAreaSqKm: string;
  flagEmoji: string;
  color: string; // Theme glow color for SVG map highlights
  countryCodes: string[]; // ISO-2 codes spanned by empire
  summary: string;
  keyAchievements: string[];
}

export const HISTORICAL_EMPIRES: HistoricalEmpire[] = [
  // ── SOUTH ASIA ──────────────────────────────────────────────────
  {
    id: 'gupta-empire',
    name: 'Gupta Empire',
    region: 'South Asia',
    era: 'Classical',
    yearSpan: '320 CE – 550 CE',
    peakYear: 400,
    founderOrRuler: 'Chandragupta I & Samudragupta',
    capitalCity: 'Pataliputra (Patna)',
    capitalCoords: { cx: 700, cy: 300 },
    peakAreaSqKm: '3,500,000 km²',
    flagEmoji: '👑',
    color: '#f59e0b',
    countryCodes: ['in', 'pk', 'bd', 'np'],
    summary: 'Hailed as the Golden Age of India, marked by extensive discoveries in science, technology, engineering, art, astronomy, mathematics, and Sanskrit literature.',
    keyAchievements: [
      'Concept of Zero and Decimal System pioneered by Aryabhata',
      'Construction of Iron Pillar of Delhi and Ajanta Cave Murals',
      'Flourishing Sanskrit literature including Kalidasa works',
      'Establishment of Nalanda University as a global learning center'
    ]
  },
  {
    id: 'maratha-empire',
    name: 'Maratha Empire',
    region: 'South Asia',
    era: 'Early Modern',
    yearSpan: '1674 CE – 1818 CE',
    peakYear: 1758,
    founderOrRuler: 'Chhatrapati Shivaji Maharaj & Peshwa Baji Rao I',
    capitalCity: 'Raigad / Pune',
    capitalCoords: { cx: 675, cy: 330 },
    peakAreaSqKm: '2,800,000 km²',
    flagEmoji: '🚩',
    color: '#ff6600',
    countryCodes: ['in', 'pk'],
    summary: 'Founded by Chhatrapati Shivaji Maharaj who pioneered Ganimi Kava (guerrilla warfare). At its zenith under Peshwa Baji Rao I, the Marathas dominated the subcontinent.',
    keyAchievements: [
      'Pioneering guerrilla warfare tactics (Ganimi Kava) and formidable hill fort navy',
      'Establishment of Hindavi Swarajya (self-rule) administration',
      'Expansive cavalry campaigns extending to Attock on the Indus River',
      'Construction of coastal sea forts like Sindhudurg and Janjira'
    ]
  },
  {
    id: 'mughal-akbar',
    name: 'Mughal Empire (Akbar Era)',
    region: 'South Asia',
    era: 'Early Modern',
    yearSpan: '1556 CE – 1605 CE',
    peakYear: 1600,
    founderOrRuler: 'Akbar the Great',
    capitalCity: 'Fatehpur Sikri / Agra',
    capitalCoords: { cx: 685, cy: 295 },
    peakAreaSqKm: '4,000,000 km²',
    flagEmoji: '🦁',
    color: '#059669',
    countryCodes: ['in', 'pk', 'bd', 'af'],
    summary: 'Under Akbar the Great, the empire tripled in size and wealth. He instituted religious tolerance (Din-i Ilahi), administrative centralized bureaucracy (Mansabdari), and commissioned majestic masterpieces.',
    keyAchievements: [
      'Establishment of Mansabdari administrative & tax system',
      'Creation of Fatehpur Sikri and Ibadat Khana for interfaith dialogues',
      'Abolition of Jizya religious tax promoting religious unity',
      'Patronage of Navratnas (Nine Gems) including Birbal and Tansen'
    ]
  },
  {
    id: 'mughal-babur',
    name: 'Mughal Empire (Babur Era)',
    region: 'South Asia',
    era: 'Early Modern',
    yearSpan: '1526 CE – 1530 CE',
    peakYear: 1528,
    founderOrRuler: 'Zahir al-Din Muhammad Babur',
    capitalCity: 'Agra / Kabul',
    capitalCoords: { cx: 680, cy: 285 },
    peakAreaSqKm: '1,200,000 km²',
    flagEmoji: '🏹',
    color: '#10b981',
    countryCodes: ['in', 'pk', 'af'],
    summary: 'Founded by Babur after his victory at the First Battle of Panipat in 1526, establishing Mughal rule across Northern India and Afghanistan.',
    keyAchievements: [
      'Decisive adoption of field artillery & matchlocks at Battle of Panipat',
      'Authoring of Baburnama, one of the earliest regal autobiographies',
      'Introduction of Persian Charbagh garden architecture'
    ]
  },
  {
    id: 'maurya-empire',
    name: 'Maurya Empire',
    region: 'South Asia',
    era: 'Ancient',
    yearSpan: '322 BCE – 185 BCE',
    peakYear: -250,
    founderOrRuler: 'Chandragupta Maurya & Ashoka the Great',
    capitalCity: 'Pataliputra',
    capitalCoords: { cx: 700, cy: 300 },
    peakAreaSqKm: '5,000,000 km²',
    flagEmoji: '☸️',
    color: '#fbbf24',
    countryCodes: ['in', 'pk', 'bd', 'af', 'np'],
    summary: 'The largest empire created in the Indian subcontinent. Under Ashoka the Great, the empire embraced Ahimsa (non-violence) and spread Buddhism across Asia.',
    keyAchievements: [
      'Ashoka Edicts inscribed on pillars throughout South Asia',
      'Construction of the Grand Trunk Road linking East and West Asia',
      'Chanakya Arthashastra treatise on statecraft and economic policy'
    ]
  },
  {
    id: 'chola-dynasty',
    name: 'Chola Dynasty',
    region: 'South Asia',
    era: 'Medieval',
    yearSpan: '848 CE – 1279 CE',
    peakYear: 1050,
    founderOrRuler: 'Rajaraja Chola I & Rajendra Chola I',
    capitalCity: 'Thanjavur',
    capitalCoords: { cx: 685, cy: 360 },
    peakAreaSqKm: '1,800,000 km²',
    flagEmoji: '🐯',
    color: '#f97316',
    countryCodes: ['in', 'lk', 'my', 'id', 'th'],
    summary: 'A maritime thalassocracy that dominated South India, Sri Lanka, and Southeast Asia. Renowned for naval power, bronze sculpture, and Dravidian temples.',
    keyAchievements: [
      'Naval dominance across the Bay of Bengal & Malacca Strait',
      'Construction of Brihadisvara Temple at Thanjavur (UNESCO World Heritage)',
      'Development of lost-wax bronze casting art techniques'
    ]
  },
  {
    id: 'vijayanagara-empire',
    name: 'Vijayanagara Empire',
    region: 'South Asia',
    era: 'Medieval',
    yearSpan: '1336 CE – 1646 CE',
    peakYear: 1520,
    founderOrRuler: 'Harihara I, Bukka Raya I & Krishnadevaraya',
    capitalCity: 'Vijayanagara (Hampi)',
    capitalCoords: { cx: 678, cy: 345 },
    peakAreaSqKm: '1,200,000 km²',
    flagEmoji: '⚔️',
    color: '#d97706',
    countryCodes: ['in'],
    summary: 'A magnificent South Indian empire based in Hampi that served as a bastion of South Indian culture, fine arts, literature, and architectural grandeur.',
    keyAchievements: [
      'Golden age of South Indian architecture at Hampi (Stone Chariot, Virupaksha Temple)',
      'Royal patronage of Telugu, Kannada, Sanskrit, and Tamil literature',
      'Flourishing international trade in diamonds, horses, and spices'
    ]
  },
  {
    id: 'pala-empire',
    name: 'Pala Empire',
    region: 'South Asia',
    era: 'Medieval',
    yearSpan: '750 CE – 1161 CE',
    peakYear: 850,
    founderOrRuler: 'Gopala & Dharmapala',
    capitalCity: 'Pataliputra / Gaur',
    capitalCoords: { cx: 715, cy: 295 },
    peakAreaSqKm: '1,500,000 km²',
    flagEmoji: '🪷',
    color: '#a7f3d0',
    countryCodes: ['in', 'bd', 'np'],
    summary: 'A major imperial power of Bengal and Bihar that championed Mahayana and Vajrayana Buddhism, founding the famed Vikramashila and Somapura learning centers.',
    keyAchievements: [
      'Founding of Vikramashila and Somapura Mahavihara Buddhist learning hubs',
      'Patronage of Atisha Dipankara who revitalized Tibetan Buddhism',
      'Development of Proto-Bengali language and Pala bronze art'
    ]
  },
  {
    id: 'harsha-empire',
    name: 'Harsha Empire',
    region: 'South Asia',
    era: 'Medieval',
    yearSpan: '606 CE – 647 CE',
    peakYear: 630,
    founderOrRuler: 'Emperor Harsha',
    capitalCity: 'Kannauj',
    capitalCoords: { cx: 682, cy: 290 },
    peakAreaSqKm: '1,200,000 km²',
    flagEmoji: '☀️',
    color: '#fcd34d',
    countryCodes: ['in', 'np'],
    summary: 'Emperor Harsha united Northern India after the fall of the Guptas, establishing Kannauj as a cultural capital and hosting Chinese monk Xuanzang.',
    keyAchievements: [
      'Hosting the great assembly at Kannauj recorded by traveler Xuanzang',
      'Authoring of Sanskrit plays Nagananda, Ratnavali, and Priyadarsika',
      'Generous patronage of Nalanda University and interfaith dialogues'
    ]
  },
  {
    id: 'sikh-empire',
    name: 'Sikh Empire',
    region: 'South Asia',
    era: 'Early Modern',
    yearSpan: '1799 CE – 1849 CE',
    peakYear: 1839,
    founderOrRuler: 'Maharaja Ranjit Singh',
    capitalCity: 'Lahore',
    capitalCoords: { cx: 660, cy: 280 },
    peakAreaSqKm: '520,000 km²',
    flagEmoji: '⚔️',
    color: '#facc15',
    countryCodes: ['in', 'pk'],
    summary: 'Founded by Maharaja Ranjit Singh, uniting Sikh Misls into a secular empire across Punjab, Kashmir, Ladakh, and Khyber Pass.',
    keyAchievements: [
      'Golden gilding of Harmandir Sahib (Golden Temple) in Amritsar',
      'Modernized Fauj-i-Khas army advised by European veterans',
      'Secular governance with multi-religious cabinet ministers'
    ]
  },

  // ── EUROPE & MEDITERRANEAN ──────────────────────────────────────
  {
    id: 'roman-empire',
    name: 'Roman Empire',
    region: 'Europe & Mediterranean',
    era: 'Classical',
    yearSpan: '27 BCE – 476 CE',
    peakYear: 117,
    founderOrRuler: 'Augustus Caesar & Trajan',
    capitalCity: 'Rome',
    capitalCoords: { cx: 505, cy: 220 },
    peakAreaSqKm: '5,000,000 km²',
    flagEmoji: '🦅',
    color: '#ef4444',
    countryCodes: ['it', 'fr', 'es', 'pt', 'gb', 'de', 'gr', 'tr', 'eg', 'sy', 'iq', 'il', 'jo', 'dz', 'ma', 'tn', 'ly', 'ro', 'bg', 'hr', 'rs', 'ba', 'al', 'at', 'ch'],
    summary: 'History’s most influential Mediterranean empire. Laid foundations for Western law, engineering, architecture, and language.',
    keyAchievements: [
      'Pax Romana - two centuries of peace and stability',
      'Engineering marvels: Aqueducts, Colosseum, Pantheon, Roman Roads',
      'Development of Civil Law code (Justinian Jurisprudence)'
    ]
  },
  {
    id: 'byzantine-empire',
    name: 'Byzantine Empire',
    region: 'Europe & Mediterranean',
    era: 'Medieval',
    yearSpan: '330 CE – 1453 CE',
    peakYear: 555,
    founderOrRuler: 'Constantine the Great & Justinian I',
    capitalCity: 'Constantinople',
    capitalCoords: { cx: 565, cy: 215 },
    peakAreaSqKm: '3,400,000 km²',
    flagEmoji: '☦️',
    color: '#a855f7',
    countryCodes: ['gr', 'tr', 'it', 'eg', 'sy', 'il', 'jo', 'ly', 'tn', 'dz', 'bg', 'al', 'hr'],
    summary: 'The Eastern Roman Empire based in Constantinople, preserving classical Greek and Roman knowledge while developing Eastern Orthodox culture.',
    keyAchievements: [
      'Construction of Hagia Sophia cathedral dome',
      'Codification of Roman law into Corpus Juris Civilis',
      'Invention of Greek Fire naval weapon'
    ]
  },
  {
    id: 'macedonian-alexander',
    name: 'Macedonian Empire',
    region: 'Europe & Mediterranean',
    era: 'Ancient',
    yearSpan: '336 BCE – 323 BCE',
    peakYear: -323,
    founderOrRuler: 'Alexander the Great',
    capitalCity: 'Pella / Babylon',
    capitalCoords: { cx: 535, cy: 228 },
    peakAreaSqKm: '5,200,000 km²',
    flagEmoji: '⚡',
    color: '#0284c7',
    countryCodes: ['gr', 'tr', 'eg', 'sy', 'iq', 'ir', 'af', 'pk'],
    summary: 'Formed in a 12-year campaign by Alexander the Great, spreading Hellenistic culture from Greece to the Indus River.',
    keyAchievements: [
      'Undefeated military strategy & Macedonian Phalanx',
      'Founding of Alexandria, Egypt and Hellenistic world trade',
      'Expansion of geographical knowledge between Europe and Asia'
    ]
  },
  {
    id: 'french-empire',
    name: 'First French Empire',
    region: 'Europe & Mediterranean',
    era: 'Modern',
    yearSpan: '1804 CE – 1815 CE',
    peakYear: 1812,
    founderOrRuler: 'Napoleon Bonaparte',
    capitalCity: 'Paris',
    capitalCoords: { cx: 480, cy: 190 },
    peakAreaSqKm: '2,100,000 km²',
    flagEmoji: '🇫🇷',
    color: '#3b82f6',
    countryCodes: ['fr', 'de', 'it', 'es', 'nl', 'be', 'ch', 'at', 'pl'],
    summary: 'Under Emperor Napoleon I, France dominated Continental Europe through brilliant military victories and instituted the Napoleonic Code.',
    keyAchievements: [
      'Napoleonic Code (Civil Code) modern legal system',
      'Metric system standardization across Europe',
      'Decisive battlefield victories at Austerlitz and Jena'
    ]
  },

  // ── MIDDLE EAST & EURASIA ──────────────────────────────────────
  {
    id: 'ottoman-empire',
    name: 'Ottoman Empire',
    region: 'Middle East & Eurasia',
    era: 'Early Modern',
    yearSpan: '1299 CE – 1922 CE',
    peakYear: 1683,
    founderOrRuler: 'Osman I & Suleiman the Magnificent',
    capitalCity: 'Istanbul',
    capitalCoords: { cx: 565, cy: 215 },
    peakAreaSqKm: '5,200,000 km²',
    flagEmoji: '🌙',
    color: '#dc2626',
    countryCodes: ['tr', 'gr', 'bg', 'ro', 'hu', 'rs', 'hr', 'ba', 'al', 'eg', 'sy', 'iq', 'jo', 'il', 'sa', 'ye', 'ly', 'tn', 'dz', 'sd'],
    summary: 'Spanning Southeast Europe, Western Asia, and North Africa for over six centuries. A geopolitical nexus bridging East and West.',
    keyAchievements: [
      'Conquest of Constantinople in 1453 by Mehmed II',
      'Legal code reform under Suleiman the Lawgiver',
      'Mastery of Ottoman architecture (Mimar Sinan)'
    ]
  },
  {
    id: 'mongol-empire',
    name: 'Mongol Empire',
    region: 'Middle East & Eurasia',
    era: 'Medieval',
    yearSpan: '1206 CE – 1368 CE',
    peakYear: 1279,
    founderOrRuler: 'Genghis Khan & Kublai Khan',
    capitalCity: 'Karakorum',
    capitalCoords: { cx: 790, cy: 190 },
    peakAreaSqKm: '24,000,000 km²',
    flagEmoji: '🏹',
    color: '#8b5cf6',
    countryCodes: ['mn', 'cn', 'ru', 'kz', 'uz', 'tm', 'kg', 'tj', 'ir', 'iq', 'tr', 'ua', 'by', 'pl', 'kp', 'kr'],
    summary: 'The largest contiguous land empire in history, stretching from Sea of Japan to Eastern Europe. Facilitated Pax Mongolica trade along Silk Road.',
    keyAchievements: [
      'Pax Mongolica trans-Eurasian trade safety',
      'Yam horseback messenger relay network',
      'Adoption of paper currency and meritocracy'
    ]
  },
  {
    id: 'persian-achaemenid',
    name: 'Achaemenid Empire',
    region: 'Middle East & Eurasia',
    era: 'Ancient',
    yearSpan: '550 BCE – 330 BCE',
    peakYear: -480,
    founderOrRuler: 'Cyrus the Great & Darius I',
    capitalCity: 'Persepolis / Susa',
    capitalCoords: { cx: 635, cy: 245 },
    peakAreaSqKm: '5,500,000 km²',
    flagEmoji: '🦁',
    color: '#3b82f6',
    countryCodes: ['ir', 'iq', 'tr', 'eg', 'sy', 'jo', 'il', 'af', 'pk', 'am', 'az', 'ge', 'tm', 'uz'],
    summary: 'The first global superpower, ruling over 44% of world population at peak. Known for satrapy governance and human rights charter.',
    keyAchievements: [
      'The Cyrus Cylinder human rights declaration',
      'Royal Road 2,500 km infrastructure network',
      'Construction of ceremonial Persepolis capital'
    ]
  },
  {
    id: 'abbasid-caliphate',
    name: 'Abbasid Caliphate',
    region: 'Middle East & Eurasia',
    era: 'Medieval',
    yearSpan: '750 CE – 1258 CE',
    peakYear: 850,
    founderOrRuler: 'Harun al-Rashid',
    capitalCity: 'Baghdad',
    capitalCoords: { cx: 605, cy: 245 },
    peakAreaSqKm: '11,100,000 km²',
    flagEmoji: '📖',
    color: '#0284c7',
    countryCodes: ['iq', 'ir', 'sy', 'eg', 'sa', 'ae', 'jo', 'il', 'lb', 'dz', 'tn', 'ly', 'pk', 'af'],
    summary: 'Presided over the Islamic Golden Age in Baghdad, making breakthroughs in algebra, optics, medicine, philosophy, and astronomy.',
    keyAchievements: [
      'Establishment of the House of Wisdom (Bayt al-Hikmah) in Baghdad',
      'Invention of Algebra by Al-Khwarizmi and pioneering optics by Ibn al-Haytham',
      'Translation Movement preserving Greek, Persian, and Indian treatises'
    ]
  },
  {
    id: 'timurid-empire',
    name: 'Timurid Empire',
    region: 'Middle East & Eurasia',
    era: 'Medieval',
    yearSpan: '1370 CE – 1507 CE',
    peakYear: 1405,
    founderOrRuler: 'Tamerlane (Timur) & Ulugh Beg',
    capitalCity: 'Samarkand',
    capitalCoords: { cx: 660, cy: 225 },
    peakAreaSqKm: '4,400,000 km²',
    flagEmoji: '🕌',
    color: '#8b5cf6',
    countryCodes: ['uz', 'tm', 'tj', 'af', 'ir', 'iq', 'pk', 'in'],
    summary: 'Founded by conqueror Timur, initiating the Timurid Renaissance in Samarkand with breathtaking tile architecture and observatories.',
    keyAchievements: [
      'Construction of Registan and Shah-i Zinda architectural wonders in Samarkand',
      'Ulugh Beg Observatory measuring stellar coordinates with precision',
      'Timurid Renaissance blending Turco-Mongol military art with Persian poetry'
    ]
  },

  // ── EAST & SOUTHEAST ASIA ──────────────────────────────────────
  {
    id: 'han-dynasty',
    name: 'Han Dynasty',
    region: 'East & Southeast Asia',
    era: 'Classical',
    yearSpan: '202 BCE – 220 CE',
    peakYear: 100,
    founderOrRuler: 'Emperor Gaozu & Emperor Wu',
    capitalCity: 'Chang’an / Luoyang',
    capitalCoords: { cx: 805, cy: 235 },
    peakAreaSqKm: '6,000,000 km²',
    flagEmoji: '🐉',
    color: '#e11d48',
    countryCodes: ['cn', 'vn', 'kp', 'kr', 'mn'],
    summary: 'Golden age in Chinese history that established Silk Road trade and Confucian civil service examinations.',
    keyAchievements: [
      'Opening of the Silk Road connecting East Asia to Europe',
      'Invention of Paper by Cai Lun',
      'Shiji (Records of Grand Historian) by Sima Qian'
    ]
  },
  {
    id: 'tang-dynasty',
    name: 'Tang Dynasty',
    region: 'East & Southeast Asia',
    era: 'Medieval',
    yearSpan: '618 CE – 907 CE',
    peakYear: 750,
    founderOrRuler: 'Emperor Taizong & Empress Wu Zetian',
    capitalCity: 'Chang’an',
    capitalCoords: { cx: 805, cy: 235 },
    peakAreaSqKm: '5,400,000 km²',
    flagEmoji: '🏮',
    color: '#c026d3',
    countryCodes: ['cn', 'mn', 'vn', 'kz', 'uz', 'kg'],
    summary: 'High point in Chinese poetry, art, and woodblock printing with Chang’an as the world’s most populous city.',
    keyAchievements: [
      'Invention of Woodblock Printing',
      'Golden age of poetry (Li Bai and Du Fu)',
      'Cosmopolitan Silk Road trade capital'
    ]
  },
  {
    id: 'ming-dynasty',
    name: 'Ming Dynasty',
    region: 'East & Southeast Asia',
    era: 'Early Modern',
    yearSpan: '1368 CE – 1644 CE',
    peakYear: 1420,
    founderOrRuler: 'Hongwu Emperor & Yongle Emperor',
    capitalCity: 'Beijing (Forbidden City)',
    capitalCoords: { cx: 820, cy: 220 },
    peakAreaSqKm: '6,500,000 km²',
    flagEmoji: '🏯',
    color: '#f43f5e',
    countryCodes: ['cn', 'vn', 'mn'],
    summary: 'Renowned for constructing the Forbidden City, major brick restoration of the Great Wall, and Admiral Zheng He’s treasure fleet voyages.',
    keyAchievements: [
      'Construction of the Forbidden City complex in Beijing',
      'Seven maritime Treasure Fleet voyages led by Admiral Zheng He',
      'Major brick rebuilding and extension of the Great Wall of China'
    ]
  },
  {
    id: 'khmer-empire',
    name: 'Khmer Empire',
    region: 'East & Southeast Asia',
    era: 'Medieval',
    yearSpan: '802 CE – 1431 CE',
    peakYear: 1150,
    founderOrRuler: 'Jayavarman II & Suryavarman II',
    capitalCity: 'Angkor',
    capitalCoords: { cx: 795, cy: 335 },
    peakAreaSqKm: '1,000,000 km²',
    flagEmoji: '🛕',
    color: '#eab308',
    countryCodes: ['kh', 'th', 'la', 'vn'],
    summary: 'A powerful Southeast Asian empire that built Angkor Wat, the largest religious monument in the world.',
    keyAchievements: [
      'Construction of Angkor Wat temple complex',
      'Advanced Baray reservoir and irrigation hydraulic network',
      'Construction of Bayon temple with face towers'
    ]
  },
  {
    id: 'majapahit-empire',
    name: 'Majapahit Empire',
    region: 'East & Southeast Asia',
    era: 'Medieval',
    yearSpan: '1293 CE – 1527 CE',
    peakYear: 1360,
    founderOrRuler: 'Raden Wijaya & Gajah Mada',
    capitalCity: 'Trowulan (Java)',
    capitalCoords: { cx: 810, cy: 395 },
    peakAreaSqKm: '2,700,000 km²',
    flagEmoji: '⛵',
    color: '#059669',
    countryCodes: ['id', 'my', 'sg', 'bn', 'tl'],
    summary: 'An archipelagic thalassocracy based in Java that unified over 98 tributaries across modern Indonesia and Malaysia.',
    keyAchievements: [
      'Gajah Mada’s Sumpah Palapa oath unifying Archipelago',
      'Compilation of Nagarakretagama historical epic poem',
      'Maritime trade hegemony across Spice Islands'
    ]
  },

  // ── AMERICAS ───────────────────────────────────────────────────
  {
    id: 'aztec-empire',
    name: 'Aztec Empire',
    region: 'Americas',
    era: 'Medieval',
    yearSpan: '1428 CE – 1521 CE',
    peakYear: 1519,
    founderOrRuler: 'Moctezuma II',
    capitalCity: 'Tenochtitlan (Mexico City)',
    capitalCoords: { cx: 200, cy: 325 },
    peakAreaSqKm: '220,000 km²',
    flagEmoji: '🦅',
    color: '#f97316',
    countryCodes: ['mx'],
    summary: 'A Mesoamerican empire based in island Tenochtitlan, built on chinampa floating agriculture and step-pyramids.',
    keyAchievements: [
      'Construction of island capital Tenochtitlan with causeways & aqueducts',
      'Chinampa floating garden agricultural innovation',
      'Aztec Sun Stone (Calendar Stone) astronomical monument'
    ]
  },
  {
    id: 'maya-civilization',
    name: 'Maya Civilization',
    region: 'Americas',
    era: 'Classical',
    yearSpan: '250 CE – 900 CE',
    peakYear: 750,
    founderOrRuler: 'Pakal the Great',
    capitalCity: 'Tikal / Palenque',
    capitalCoords: { cx: 220, cy: 345 },
    peakAreaSqKm: '350,000 km²',
    flagEmoji: '🗿',
    color: '#06b6d4',
    countryCodes: ['mx', 'gt', 'bz', 'hn', 'sv'],
    summary: 'Renowned for logosyllabic script, precision calendars, independent zero, and step-pyramids.',
    keyAchievements: [
      'Maya Calendar system 365.242 day solar accuracy',
      'Independent invention of mathematical zero',
      'Chichen Itza & Tikal step-pyramid temples'
    ]
  },
  {
    id: 'inca-empire',
    name: 'Inca Empire',
    region: 'Americas',
    era: 'Medieval',
    yearSpan: '1438 CE – 1533 CE',
    peakYear: 1525,
    founderOrRuler: 'Pachacuti & Huayna Capac',
    capitalCity: 'Cusco',
    capitalCoords: { cx: 290, cy: 455 },
    peakAreaSqKm: '2,000,000 km²',
    flagEmoji: '🦙',
    color: '#14b8a6',
    countryCodes: ['pe', 'ec', 'bo', 'cl', 'ar', 'co'],
    summary: 'Largest pre-Columbian empire in the Americas. Engineered high-altitude Andes citadels and stone roads without mortar.',
    keyAchievements: [
      'Machu Picchu Citadel and mortarless dry-stone masonry',
      'Qhapaq Ñan 40,000 km royal mountain road network',
      'Quipu knotted cord accounting system'
    ]
  },

  // ── AFRICA ─────────────────────────────────────────────────────
  {
    id: 'mali-empire',
    name: 'Mali Empire',
    region: 'Africa',
    era: 'Medieval',
    yearSpan: '1235 CE – 1670 CE',
    peakYear: 1325,
    founderOrRuler: 'Sundiata Keita & Mansa Musa',
    capitalCity: 'Niani / Timbuktu',
    capitalCoords: { cx: 445, cy: 315 },
    peakAreaSqKm: '1,100,000 km²',
    flagEmoji: '🦁',
    color: '#eab308',
    countryCodes: ['ml', 'sn', 'gm', 'gn', 'ne', 'bf'],
    summary: 'A wealthy West African empire controlling trans-Saharan gold trade. Mansa Musa is regarded as history’s wealthiest individual.',
    keyAchievements: [
      'Mansa Musa’s 1324 pilgrimage to Mecca highlighting West African wealth',
      'Establishment of Sankore University and manuscript libraries in Timbuktu',
      'Sundiata Keita’s Kouroukan Fouga oral constitution'
    ]
  },
  {
    id: 'ancient-egypt-new-kingdom',
    name: 'Ancient Egyptian Empire',
    region: 'Africa',
    era: 'Ancient',
    yearSpan: '1550 BCE – 1077 BCE',
    peakYear: -1250,
    founderOrRuler: 'Ramesses II & Hatshepsut',
    capitalCity: 'Thebes (Luxor) / Memphis',
    capitalCoords: { cx: 550, cy: 265 },
    peakAreaSqKm: '1,000,000 km²',
    flagEmoji: '📿',
    color: '#ca8a04',
    countryCodes: ['eg', 'sd', 'il', 'jo', 'sy', 'lb'],
    summary: 'Egypt’s most prosperous era famous for pharaonic monuments, Abu Simbel, Valley of the Kings, and diplomacy.',
    keyAchievements: [
      'Construction of Abu Simbel and Karnak Temple Hall',
      'Battle of Kadesh and first recorded international Peace Treaty',
      'Tomb of Tutankhamun and Valley of the Kings tombs'
    ]
  },

  // ── GLOBAL EMPIRES ─────────────────────────────────────────────
  {
    id: 'british-empire',
    name: 'British Empire',
    region: 'Global',
    era: 'Modern',
    yearSpan: '1815 CE – 1947 CE',
    peakYear: 1920,
    founderOrRuler: 'Queen Victoria & George V',
    capitalCity: 'London',
    capitalCoords: { cx: 470, cy: 175 },
    peakAreaSqKm: '35,500,000 km²',
    flagEmoji: '🇬🇧',
    color: '#6366f1',
    countryCodes: ['gb', 'in', 'pk', 'bd', 'ca', 'au', 'nz', 'za', 'eg', 'sd', 'ke', 'ng', 'gh', 'my', 'sg', 'mm', 'lk', 'jm', 'ie', 'cy', 'mt'],
    summary: 'The largest empire in human history ("the empire on which the sun never sets"). Covered over 24% of Earth’s land area.',
    keyAchievements: [
      'Global industrialization and railway/telegraph networks',
      'Spread of English language, common law, and parliamentary democracy',
      'Maritime trade networks and financial institutions'
    ]
  },
  {
    id: 'spanish-empire',
    name: 'Spanish Empire',
    region: 'Global',
    era: 'Early Modern',
    yearSpan: '1492 CE – 1898 CE',
    peakYear: 1790,
    founderOrRuler: 'Philip II',
    capitalCity: 'Madrid',
    capitalCoords: { cx: 455, cy: 220 },
    peakAreaSqKm: '13,700,000 km²',
    flagEmoji: '🇪🇸',
    color: '#ea580c',
    countryCodes: ['es', 'mx', 'pe', 'co', 'ar', 'cl', 've', 'ec', 'bo', 'py', 'uy', 'ph', 'cu', 'pr', 'us'],
    summary: 'One of the first global empires, spanning Europe, the Americas, and the Philippines. Initiated the Columbian Exchange.',
    keyAchievements: [
      'Global circumnavigation by Magellan & Elcano expedition',
      'Establishment of Spanish Silver Dollar global currency',
      'Spread of Spanish language across the Americas'
    ]
  }
];
