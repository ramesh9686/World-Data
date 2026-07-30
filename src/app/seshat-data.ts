export interface SeshatDimensionScore {
  polityScale: number;       // 0 - 100 (Territory, Population, Capital size)
  governance: number;        // 0 - 100 (Administrative hierarchy, bureaucracy, legal code, taxation)
  infrastructure: number;    // 0 - 100 (Roads, bridges/canals, irrigation, universities, public works)
  informationSystems: number;// 0 - 100 (Writing, minting, records, postal system, libraries)
  militaryTech: number;      // 0 - 100 (Artillery, navy, cavalry, armor, fortifications)
  axialReligion: number;     // 0 - 100 (Moralizing religion, interfaith dialogue, monotheism/dharma, rituals)
}

export interface SeshatCodedVariable {
  variableName: string;
  category: 'Scale' | 'Governance' | 'Infrastructure' | 'Information' | 'Military' | 'Religion';
  status: 'present' | 'absent' | 'inferred' | 'disputed';
  valueDescription: string;
  historicalEvidence: string;
  citations: string[];
}

export interface SeshatEmpireData {
  empireId: string;
  polityName: string;
  seshatCode: string; // e.g. "NGA_Gupta", "EUR_Rome"
  sScore: number;     // Overall Social Complexity Score (0 - 100)
  dimensions: SeshatDimensionScore;
  adminLevels: number; // Tiers of administrative hierarchy (e.g. 4-6)
  capitalPopulationEst: string;
  peakPopulationEst: string;
  primaryLanguageScript: string;
  monetarySystem: string;
  codedVariables: SeshatCodedVariable[];
  cliodynamicNotes: string;
}

export const SESHAT_EMPIRES_MAP: Record<string, SeshatEmpireData> = {
  'gupta-empire': {
    empireId: 'gupta-empire',
    polityName: 'Gupta Empire',
    seshatCode: 'SAS_Gupta',
    sScore: 84,
    dimensions: {
      polityScale: 85,
      governance: 82,
      infrastructure: 88,
      informationSystems: 90,
      militaryTech: 78,
      axialReligion: 92
    },
    adminLevels: 5,
    capitalPopulationEst: '150,000 – 200,000 (Pataliputra)',
    peakPopulationEst: '45,000,000 – 50,000,000',
    primaryLanguageScript: 'Sanskrit (Brahmi Script)',
    monetarySystem: 'Gold Dinaras & Silver Rupyakas',
    codedVariables: [
      {
        variableName: 'Decentralized Bureaucracy & Feudal Autonomy (Samantas)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'High administrative efficiency with provincial governors (Uparika) and district officers (Vishayapati).',
        historicalEvidence: 'Inscriptions at Damodarpur and Eran record land grants and administrative units (Bhuktis and Vishayas).',
        citations: ['Majumdar, R.C. (1986). The History and Culture of the Indian People: The Classical Age.', 'Seshat: Global History Databank (SAS_Gupta).']
      },
      {
        variableName: 'Institutional Higher Education & Astronomy Centers',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Nalanda University established under Kumaragupta I with international scholar residence.',
        historicalEvidence: 'Xuanzang and Yijing documented over 10,000 students studying science, logic, and philosophy.',
        citations: ['Sastri, K.A.N. (1957). Comprehensive History of India.', 'Turchin et al. (2018). Quantitative Historical Analysis of Social Complexity.']
      },
      {
        variableName: 'Positional Decimal Numerals & Zero',
        category: 'Information',
        status: 'present',
        valueDescription: 'Aryabhata authored Aryabhatiya in 499 CE introducing trigonometric functions and decimal place-value.',
        historicalEvidence: 'Bakhshali manuscript & Aryabhatiya treatises.',
        citations: ['Ifrah, G. (2000). The Universal History of Numbers.']
      }
    ],
    cliodynamicNotes: 'Peak of Classical Indian social integration, marked by low internal conflict, high monetary liquidity, and massive patronage of science and arts.'
  },

  'maratha-empire': {
    empireId: 'maratha-empire',
    polityName: 'Maratha Empire',
    seshatCode: 'SAS_Maratha',
    sScore: 88,
    dimensions: {
      polityScale: 82,
      governance: 90,
      infrastructure: 85,
      informationSystems: 86,
      militaryTech: 94,
      axialReligion: 89
    },
    adminLevels: 5,
    capitalPopulationEst: '100,000 (Raigad / Pune)',
    peakPopulationEst: '50,000,000',
    primaryLanguageScript: 'Marathi (Modi Script) & Sanskrit',
    monetarySystem: 'Shivrai Copper & Gold Hon, Peshwa Silver Rupee',
    codedVariables: [
      {
        variableName: 'Ashta Pradhan (Council of Eight Ministers)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Central executive council with specialized portfolios: Pantpradhan (PM), Amatya (Finance), Sachiv, Senapati.',
        historicalEvidence: 'Chhatrapati Shivaji Maharaj established codified administrative guidelines in the Rajavyavaharkosha.',
        citations: ['Sardesai, G.S. (1946). New History of the Marathas.', 'Seshat Databank (SAS_Maratha).']
      },
      {
        variableName: 'Ganimi Kava (Guerrilla Tactics & Hill Fort Architecture)',
        category: 'Military',
        status: 'present',
        valueDescription: 'Over 300 hill forts (Raigad, Rajgad, Pratapgad) and coastal naval forts (Sindhudurg, Vijaydurg).',
        historicalEvidence: 'Naval admiral Kanhoji Angre dominated the Arabian Sea using light draft war galleys (Ghurabs & Gallivats).',
        citations: ['Gordon, S. (1993). The Marathas 1600–1818, Cambridge University Press.']
      }
    ],
    cliodynamicNotes: 'Remarkable rapid rise of regional self-governance (Hindavi Swarajya), featuring pioneering naval strategy and tax reform (Chauth & Sardeshmukhi).'
  },

  'mughal-akbar': {
    empireId: 'mughal-akbar',
    polityName: 'Mughal Empire (Akbar Era)',
    seshatCode: 'SAS_Mughal',
    sScore: 92,
    dimensions: {
      polityScale: 94,
      governance: 95,
      infrastructure: 91,
      informationSystems: 92,
      militaryTech: 90,
      axialReligion: 90
    },
    adminLevels: 6,
    capitalPopulationEst: '220,000 (Fatehpur Sikri / Agra)',
    peakPopulationEst: '110,000,000',
    primaryLanguageScript: 'Persian (Farsi) & Chagatai Turkic',
    monetarySystem: 'Standardized Silver Rupiya, Gold Mohur & Copper Dam',
    codedVariables: [
      {
        variableName: 'Mansabdari System & Subah Administration',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Military-bureaucratic rank system (Zat & Sawar) dividing the empire into 15 Subahs (Provinces).',
        historicalEvidence: 'Ain-i-Akbari compiled by Grand Vizier Abu\'l-Fazl detailing imperial revenue statistics.',
        citations: ['Habib, I. (1999). The Agrarian System of Mughal India, Oxford Univ Press.']
      },
      {
        variableName: 'Din-i Ilahi & Interfaith Ibadat Khana',
        category: 'Religion',
        status: 'present',
        valueDescription: 'Institutional state policy of Sulh-i-kul (Universal Peace) and abolition of the Jizya tax.',
        historicalEvidence: 'Records of debates in Fatehpur Sikri between Hindu scholars, Sufis, Jesuits, Parsis, and Jains.',
        citations: ['Chandra, S. (2005). Medieval India: From Sultanat to the Mughals.']
      }
    ],
    cliodynamicNotes: 'Extremely high degree of bureaucratic centralization combined with economic expansion; controlled 25% of global GDP.'
  },

  'maurya-empire': {
    empireId: 'maurya-empire',
    polityName: 'Maurya Empire',
    seshatCode: 'SAS_Maurya',
    sScore: 90,
    dimensions: {
      polityScale: 96,
      governance: 92,
      infrastructure: 90,
      informationSystems: 88,
      militaryTech: 84,
      axialReligion: 94
    },
    adminLevels: 5,
    capitalPopulationEst: '350,000 – 400,000 (Pataliputra)',
    peakPopulationEst: '50,000,000 – 60,000,000',
    primaryLanguageScript: 'Prakrit (Brahmi, Kharosthi & Aramaic Scripts)',
    monetarySystem: 'Punch-marked Silver Pana & Copper Mashaka',
    codedVariables: [
      {
        variableName: 'Arthashastra Bureaucratic Statecraft',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Detailed manual of governance authored by Chanakya (Kautilya) covering espionage, tax, and law.',
        historicalEvidence: 'Megasthenes\' Indica describing 30-member municipal commission of Pataliputra.',
        citations: ['Kangle, R.P. (1972). The Kautiliya Arthashastra.', 'Seshat Databank (SAS_Maurya).']
      },
      {
        variableName: 'Edicts of Ashoka & Ahimsa Governance',
        category: 'Religion',
        status: 'present',
        valueDescription: 'State-sponsored moral code inscribed on stone pillars spanning South Asia promoting non-violence.',
        historicalEvidence: 'Major Rock Edicts I-XIV and Pillar Edicts across India, Pakistan, and Afghanistan.',
        citations: ['Thapar, R. (1997). Asoka and the Decline of the Mauryas, Oxford Univ Press.']
      }
    ],
    cliodynamicNotes: 'First pan-Indian empire; established monumental infrastructure including the Royal Highway precursor to the Grand Trunk Road.'
  },

  'chola-dynasty': {
    empireId: 'chola-dynasty',
    polityName: 'Chola Imperial Thalassocracy',
    seshatCode: 'SAS_Chola',
    sScore: 86,
    dimensions: {
      polityScale: 84,
      governance: 88,
      infrastructure: 90,
      informationSystems: 85,
      militaryTech: 88,
      axialReligion: 82
    },
    adminLevels: 5,
    capitalPopulationEst: '120,000 (Thanjavur / Gangaikonda Cholapuram)',
    peakPopulationEst: '25,000,000',
    primaryLanguageScript: 'Tamil (Tamil-Brahmi & Grantha Scripts)',
    monetarySystem: 'Gold Kasu & Silver/Bronze Coins',
    codedVariables: [
      {
        variableName: 'Autonomous Local Governance (Kudavolai System)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Democratic village assembly election system in Sabhas using secret ballot pots.',
        historicalEvidence: 'Uttiramerur Inscriptions detailing qualifications, term limits, and auditing of village representatives.',
        citations: ['Sastri, K.A.N. (1955). The Colas, University of Madras.']
      },
      {
        variableName: 'Maritime Naval Hegemony & Grand Anicut Hydraulic Engineering',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Blue-water navy controlling the Bay of Bengal and Malacca Strait; advanced Kaveri river canal network.',
        historicalEvidence: 'Rajendra Chola\'s naval expeditions to Sri Vijaya (Sumatra/Malay Peninsula) in 1025 CE.',
        citations: ['Spencer, G.W. (1983). The Politics of Expansion: The Chola Conquest of Sri Lanka.']
      }
    ],
    cliodynamicNotes: 'Unequalled maritime prowess in pre-modern South Asia combined with sophisticated agrarian water management.'
  },

  'roman-empire': {
    empireId: 'roman-empire',
    polityName: 'Roman Empire (Principate & Dominate)',
    seshatCode: 'EUR_Rome',
    sScore: 94,
    dimensions: {
      polityScale: 95,
      governance: 96,
      infrastructure: 98,
      informationSystems: 94,
      militaryTech: 92,
      axialReligion: 88
    },
    adminLevels: 6,
    capitalPopulationEst: '1,000,000 (Rome)',
    peakPopulationEst: '65,000,000 – 70,000,000',
    primaryLanguageScript: 'Latin & Ancient Greek',
    monetarySystem: 'Gold Aureus, Silver Denarius, Bronze Sestertius',
    codedVariables: [
      {
        variableName: 'Via Publica & Aqueduct Hydraulic Networks',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Over 85,000 km of paved roads and 11 major aqueducts supplying 1 million cubic meters of water daily to Rome.',
        historicalEvidence: 'Frontinus\' De Aeduaductibus and archaeological remains across Europe and North Africa.',
        citations: ['Seshat Databank (EUR_Rome).', 'Scheidel, W. (2012). The Cambridge Companion to the Roman Economy.']
      },
      {
        variableName: 'Codified Roman Jurisprudence & Professional Standing Army',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Praetorian Edicts, Twelve Tables, and 30 standing legions with standardized retirement grants.',
        historicalEvidence: 'Gaius Institutes and Justinian Corpus Juris Civilis.',
        citations: ['Goldsworthy, A. (2003). The Complete Roman Army.']
      }
    ],
    cliodynamicNotes: 'The benchmark of classical Mediterranean socio-political integration, urban engineering, and institutional law.'
  },

  'byzantine-empire': {
    empireId: 'byzantine-empire',
    polityName: 'Byzantine Empire',
    seshatCode: 'EUR_Byzantium',
    sScore: 91,
    dimensions: {
      polityScale: 88,
      governance: 94,
      infrastructure: 92,
      informationSystems: 95,
      militaryTech: 93,
      axialReligion: 84
    },
    adminLevels: 5,
    capitalPopulationEst: '500,000 (Constantinople)',
    peakPopulationEst: '30,000,000',
    primaryLanguageScript: 'Greek & Latin',
    monetarySystem: 'Gold Solidus (Bezant) – Reserve currency for 700 years',
    codedVariables: [
      {
        variableName: 'Corpus Juris Civilis (Justinian Code)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Comprehensive codification of imperial civil law directed by Tribonian under Justinian I.',
        historicalEvidence: 'The Codex, Digest, and Institutes manuscript traditions.',
        citations: ['Ostrogorsky, G. (1969). History of the Byzantine State.']
      },
      {
        variableName: 'Theodosian Walls & Greek Fire Defense Tech',
        category: 'Military',
        status: 'present',
        valueDescription: 'Triple-ring defensive fortifications and incendiary naval flame weapons.',
        historicalEvidence: 'De Administrando Imperio by Emperor Constantine VII Porphyrogenitus.',
        citations: ['Haldon, J. (1999). Warfare, State and Society in the Byzantine World.']
      }
    ],
    cliodynamicNotes: 'Resilient thousand-year defender of Greco-Roman knowledge and Orthodox Christian institutional continuity.'
  },

  'macedonian-alexander': {
    empireId: 'macedonian-alexander',
    polityName: 'Macedonian Empire (Alexander Era)',
    seshatCode: 'EUR_Macedon',
    sScore: 83,
    dimensions: {
      polityScale: 92,
      governance: 75,
      infrastructure: 78,
      informationSystems: 82,
      militaryTech: 96,
      axialReligion: 74
    },
    adminLevels: 4,
    capitalPopulationEst: '100,000 (Babylon / Pella)',
    peakPopulationEst: '40,000,000',
    primaryLanguageScript: 'Attic Greek (Koine)',
    monetarySystem: 'Attic Standard Silver Tetradrachm & Gold Stater',
    codedVariables: [
      {
        variableName: 'Macedonian Phalanx & Sarissa Weaponry',
        category: 'Military',
        status: 'present',
        valueDescription: 'Combined arms doctrine featuring 6-meter Sarissa pikes and Hetairoi companion cavalry.',
        historicalEvidence: 'Arrian\'s Anabasis of Alexander and Plutarch\'s Lives.',
        citations: ['Bosworth, A.B. (1988). Conquest and Empire: The Reign of Alexander the Great.']
      }
    ],
    cliodynamicNotes: 'Extremely rapid military expansion bridging Europe and Asia, establishing the Hellenistic trade network.'
  },

  'french-empire': {
    empireId: 'french-empire',
    polityName: 'First French Empire (Napoleonic)',
    seshatCode: 'EUR_France',
    sScore: 93,
    dimensions: {
      polityScale: 86,
      governance: 98,
      infrastructure: 94,
      informationSystems: 96,
      militaryTech: 97,
      axialReligion: 80
    },
    adminLevels: 5,
    capitalPopulationEst: '650,000 (Paris)',
    peakPopulationEst: '44,000,000 (Continental Europe)',
    primaryLanguageScript: 'French',
    monetarySystem: 'Germinal Franc & Gold Napoléon',
    codedVariables: [
      {
        variableName: 'Code Napoléon (Civil Code of 1804)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Abolished feudal privilege, established equality under law, property rights, and secular civil law.',
        historicalEvidence: 'Adopted across Western Europe, South America, and Louisiana.',
        citations: ['Connelly, O. (1987). Blundering to Glory: Napoleon\'s Military Campaigns.']
      },
      {
        variableName: 'Grande Armée Corps System & Chappe Optical Telegraph',
        category: 'Military',
        status: 'present',
        valueDescription: 'Independent army corps (Corps d\'Armée) capable of synchronized march; semaphoric telegraph communication.',
        historicalEvidence: 'Bulletins de la Grande Armée and French national archive dispatches.',
        citations: ['Chandler, D. (1966). The Campaigns of Napoleon.']
      }
    ],
    cliodynamicNotes: 'Architect of modern European state legal frameworks, meritocratic officer corps, and standardized metric units.'
  },

  'ottoman-empire': {
    empireId: 'ottoman-empire',
    polityName: 'Ottoman Empire',
    seshatCode: 'MDE_Ottoman',
    sScore: 93,
    dimensions: {
      polityScale: 94,
      governance: 95,
      infrastructure: 92,
      informationSystems: 90,
      militaryTech: 95,
      axialReligion: 92
    },
    adminLevels: 6,
    capitalPopulationEst: '700,000 (Istanbul)',
    peakPopulationEst: '35,000,000',
    primaryLanguageScript: 'Ottoman Turkish (Arabic Script) & Arabic',
    monetarySystem: 'Silver Akçe, Gold Sultani & Kuruş',
    codedVariables: [
      {
        variableName: 'Devşirme & Janissary (Yeniçeri) Standing Corps',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Elite gunpowder infantry corps recruited through meritocratic state education.',
        historicalEvidence: 'Ottoman Kanunname state registers and Topkapi Palace archives.',
        citations: ['Inalcik, H. (1973). The Ottoman Empire: The Classical Age 1300–1600.']
      },
      {
        variableName: 'Millet Autonomous Religious Legal Framework',
        category: 'Religion',
        status: 'present',
        valueDescription: 'Self-governing communal courts for Orthodox Christians, Armenians, and Jews under their own religious law.',
        historicalEvidence: 'Firman decrees of Mehmed II granting privileges to the Ecumenical Patriarchate.',
        citations: ['Barkey, K. (2008). Empire of Difference: The Ottomans in Comparative Perspective.']
      }
    ],
    cliodynamicNotes: 'Intercontinental empire spanning Europe, Asia, and Africa for six centuries with unprecedented institutional pluralism.'
  },

  'mongol-empire': {
    empireId: 'mongol-empire',
    polityName: 'Mongol Empire',
    seshatCode: 'EAS_Mongol',
    sScore: 89,
    dimensions: {
      polityScale: 100,
      governance: 84,
      infrastructure: 85,
      informationSystems: 88,
      militaryTech: 96,
      axialReligion: 82
    },
    adminLevels: 5,
    capitalPopulationEst: '60,000 (Karakorum)',
    peakPopulationEst: '110,000,000',
    primaryLanguageScript: 'Mongolian (Uighur Script) & Persian/Chinese',
    monetarySystem: 'Paper Currency (Chao), Silver Ingots (Sycee)',
    codedVariables: [
      {
        variableName: 'Yam Imperial Horse Relay Express Network',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Postal relay stations situated 25–30 miles apart enabling riders to cover 200 miles per day.',
        historicalEvidence: 'Travels of Marco Polo and Secret History of the Mongols.',
        citations: ['Weatherford, J. (2004). Genghis Khan and the Making of the Modern World.']
      },
      {
        variableName: 'Yassa Great Law & Meritocratic Army Organization',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Decimal military hierarchy (Mingghan, Tumen) replacing tribal lineage.',
        historicalEvidence: 'Persian chronicles of Juvayni and Rashid al-Din.',
        citations: ['Allsen, T.T. (2001). Culture and Conquest in Mongol Eurasia.']
      }
    ],
    cliodynamicNotes: 'Largest contiguous land empire in human history; created the Pax Mongolica that linked Silk Road trade from East Asia to Europe.'
  },

  'persian-achaemenid': {
    empireId: 'persian-achaemenid',
    polityName: 'Achaemenid Persian Empire',
    seshatCode: 'MDE_Achaemenid',
    sScore: 91,
    dimensions: {
      polityScale: 95,
      governance: 92,
      infrastructure: 93,
      informationSystems: 90,
      militaryTech: 86,
      axialReligion: 88
    },
    adminLevels: 5,
    capitalPopulationEst: '100,000 (Persepolis / Susa)',
    peakPopulationEst: '49,000,000 (44% of World Pop in 480 BCE)',
    primaryLanguageScript: 'Old Persian (Cuneiform), Imperial Aramaic, Elamite',
    monetarySystem: 'Gold Daric & Silver Siglos',
    codedVariables: [
      {
        variableName: 'Satrapy System & Royal Road Infrastructure',
        category: 'Governance',
        status: 'present',
        valueDescription: '20 provincial Satrapies governed with financial auditing by "The King\'s Eye"; 2,700 km Royal Road from Sardis to Susa.',
        historicalEvidence: 'Herodotus Histories and Persepolis Fortification Tablets.',
        citations: ['Brosius, M. (2006). The Persians: An Introduction.', 'Seshat Databank (MDE_Achaemenid).']
      },
      {
        variableName: 'Cyrus Cylinder Declaration of Toleration',
        category: 'Religion',
        status: 'present',
        valueDescription: 'Decree issued by Cyrus the Great allowing exiled peoples to return and restore their temples.',
        historicalEvidence: 'Cyrus Cylinder clay artifact housed in British Museum.',
        citations: ['Finkel, I. (2013). The Cyrus Cylinder: The King of Persia\'s Proclamation.']
      }
    ],
    cliodynamicNotes: 'The world\'s first super-state governing nearly half of humanity through sophisticated satrap autonomy and relay courier routes.'
  },

  'abbasid-caliphate': {
    empireId: 'abbasid-caliphate',
    polityName: 'Abbasid Caliphate',
    seshatCode: 'MDE_Abbasid',
    sScore: 92,
    dimensions: {
      polityScale: 93,
      governance: 92,
      infrastructure: 94,
      informationSystems: 98,
      militaryTech: 88,
      axialReligion: 90
    },
    adminLevels: 5,
    capitalPopulationEst: '900,000 – 1,200,000 (Baghdad Round City)',
    peakPopulationEst: '50,000,000',
    primaryLanguageScript: 'Arabic',
    monetarySystem: 'Gold Dinar & Silver Dirham',
    codedVariables: [
      {
        variableName: 'House of Wisdom (Bayt al-Hikmah) & Scientific Translation Movement',
        category: 'Information',
        status: 'present',
        valueDescription: 'State-funded translation center preserving Greek, Persian, Indian, and Syriac texts into Arabic.',
        historicalEvidence: 'Fihrist of Ibn al-Nadim cataloging thousands of philosophical and mathematical manuscripts.',
        citations: ['Gutas, D. (1998). Greek Thought, Arabic Culture: The Graeco-Arabic Translation Movement.']
      }
    ],
    cliodynamicNotes: 'Epistemic epicenter of the Islamic Golden Age; introduced algebra, experimental optics, and modern hospitals.'
  },

  'timurid-empire': {
    empireId: 'timurid-empire',
    polityName: 'Timurid Empire',
    seshatCode: 'MDE_Timurid',
    sScore: 87,
    dimensions: {
      polityScale: 88,
      governance: 84,
      infrastructure: 89,
      informationSystems: 90,
      militaryTech: 94,
      axialReligion: 80
    },
    adminLevels: 4,
    capitalPopulationEst: '150,000 (Samarkand / Herat)',
    peakPopulationEst: '25,000,000',
    primaryLanguageScript: 'Chagatai Turkic & Persian',
    monetarySystem: 'Silver Tenga',
    codedVariables: [
      {
        variableName: 'Ulugh Beg Astronomical Observatory & Registan Architecture',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Giant 40-meter meridian arc measuring 1,018 stars compiled in the Zij-i Sultani catalog.',
        historicalEvidence: 'Extant ruins of Ulugh Beg Observatory in Samarkand, Uzbekistan.',
        citations: ['Subtelny, M.E. (2007). Timurids in Transition: Turko-Persian Politics and Acculturation.']
      }
    ],
    cliodynamicNotes: 'Breathtaking synthesis of nomadic military power with Turco-Persian renaissance architecture and astronomy.'
  },

  'han-dynasty': {
    empireId: 'han-dynasty',
    polityName: 'Han Dynasty (Western & Eastern)',
    seshatCode: 'EAS_Han',
    sScore: 93,
    dimensions: {
      polityScale: 95,
      governance: 96,
      infrastructure: 93,
      informationSystems: 95,
      militaryTech: 88,
      axialReligion: 90
    },
    adminLevels: 6,
    capitalPopulationEst: '500,000 (Chang’an / Luoyang)',
    peakPopulationEst: '58,000,000',
    primaryLanguageScript: 'Classical Chinese (Lishu & Kaishu Scripts)',
    monetarySystem: 'Standardized Bronze Ban Liang & Wu Zhu Coins',
    codedVariables: [
      {
        variableName: 'Imperial Examination (Confucian Civil Service)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Establishment of Taixue (Imperial Academy) to train scholars in Confucian Classics for civil appointment.',
        historicalEvidence: 'Book of Han (Hanshu) compiled by Ban Gu.',
        citations: ['Loewe, M. (1986). The Former Han Dynasty, Cambridge History of China.']
      },
      {
        variableName: 'Paper Invention by Cai Lun & Silk Road Opening',
        category: 'Information',
        status: 'present',
        valueDescription: 'Invention of hemp/bark paper in 105 CE; Zhang Qian diplomatic mission opening Eurasian trade.',
        historicalEvidence: 'Records of the Grand Historian (Shiji) by Sima Qian.',
        citations: ['Seshat Databank (EAS_Han).']
      }
    ],
    cliodynamicNotes: 'Foundational era of Chinese imperial identity, establishing administrative bureaucracy that lasted two millennia.'
  },

  'tang-dynasty': {
    empireId: 'tang-dynasty',
    polityName: 'Tang Dynasty',
    seshatCode: 'EAS_Tang',
    sScore: 94,
    dimensions: {
      polityScale: 94,
      governance: 96,
      infrastructure: 95,
      informationSystems: 97,
      militaryTech: 90,
      axialReligion: 92
    },
    adminLevels: 6,
    capitalPopulationEst: '1,000,000 (Chang’an grid city)',
    peakPopulationEst: '80,000,000',
    primaryLanguageScript: 'Classical Chinese',
    monetarySystem: 'Kaiyuan Tongbao Bronze Coins & Flying Cash (Feiqian credit)',
    codedVariables: [
      {
        variableName: 'Woodblock Printing Technology',
        category: 'Information',
        status: 'present',
        valueDescription: 'Earliest printed texts including the Diamond Sutra (868 CE).',
        historicalEvidence: 'Dunhuang manuscript cave findings.',
        citations: ['Needham, J. (1986). Science and Civilisation in China, Vol 5.']
      }
    ],
    cliodynamicNotes: 'The Golden Age of East Asian poetry, international Silk Road trade, and cosmopolitan metropolis urban planning.'
  },

  'ming-dynasty': {
    empireId: 'ming-dynasty',
    polityName: 'Ming Dynasty',
    seshatCode: 'EAS_Ming',
    sScore: 94,
    dimensions: {
      polityScale: 96,
      governance: 95,
      infrastructure: 96,
      informationSystems: 94,
      militaryTech: 93,
      axialReligion: 88
    },
    adminLevels: 6,
    capitalPopulationEst: '800,000 (Beijing / Nanjing)',
    peakPopulationEst: '160,000,000',
    primaryLanguageScript: 'Classical Chinese',
    monetarySystem: 'Paper Currency (Da Ming Baochao) & Silver Ingots (Tael)',
    codedVariables: [
      {
        variableName: 'Admiral Zheng He Maritime Treasure Fleets',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Seven naval expeditions with 300 massive 9-masted treasure ships (Baochuan) sailing to Africa and Arabia.',
        historicalEvidence: 'Ming Shilu imperial annals and stele inscriptions at Changle.',
        citations: ['Dreyer, E.L. (2007). Zheng He: China and the Oceans in the Early Ming Dynasty.']
      }
    ],
    cliodynamicNotes: 'Constructed the Forbidden City complex and brick fortification lines of the Great Wall of China.'
  },

  'khmer-empire': {
    empireId: 'khmer-empire',
    polityName: 'Khmer Empire',
    seshatCode: 'SEA_Khmer',
    sScore: 87,
    dimensions: {
      polityScale: 82,
      governance: 85,
      infrastructure: 97,
      informationSystems: 84,
      militaryTech: 85,
      axialReligion: 90
    },
    adminLevels: 4,
    capitalPopulationEst: '750,000 – 900,000 (Angkor complex)',
    peakPopulationEst: '4,000,000',
    primaryLanguageScript: 'Old Khmer & Sanskrit',
    monetarySystem: 'Barter System (Rice, Silk, Metals)',
    codedVariables: [
      {
        variableName: 'Angkor Hydraulic City & Baray Reservoir System',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'World\'s largest pre-industrial low-density urban sprawl with West Baray holding 53 million cubic meters of water.',
        historicalEvidence: 'LiDAR satellite mapping by Damian Evans and Khmer stone inscriptions.',
        citations: ['Evans, D. et al. (2013). Uncovering archaeological landscapes at Angkor using LiDAR, PNAS.']
      }
    ],
    cliodynamicNotes: 'Unrivaled hydraulic engineering supporting the majestic Angkor Wat architectural complex.'
  },

  'majapahit-empire': {
    empireId: 'majapahit-empire',
    polityName: 'Majapahit Empire',
    seshatCode: 'SEA_Majapahit',
    sScore: 86,
    dimensions: {
      polityScale: 85,
      governance: 86,
      infrastructure: 87,
      informationSystems: 84,
      militaryTech: 88,
      axialReligion: 84
    },
    adminLevels: 5,
    capitalPopulationEst: '200,000 (Trowulan, East Java)',
    peakPopulationEst: '12,000,000',
    primaryLanguageScript: 'Old Javanese (Kawi Script) & Sanskrit',
    monetarySystem: 'Kepeng Chinese Bronze Coins & Gold/Silver Ma Coins',
    codedVariables: [
      {
        variableName: 'Jong Warship Fleet & Cetbang Bronze Cannons',
        category: 'Military',
        status: 'present',
        valueDescription: 'Massive multi-masted ocean trading vessels and swivel bronze guns controlling 98 tributary states.',
        historicalEvidence: 'Nagarakretagama epic poem authored by Mpu Prapanca in 1365 CE.',
        citations: ['Robson, S. (1995). Desawarnana (Nagarakretagama) by Mpu Prapanca.']
      }
    ],
    cliodynamicNotes: 'Thalassocratic archipelago empire that defined early Indonesian maritime integration.'
  },

  'aztec-empire': {
    empireId: 'aztec-empire',
    polityName: 'Aztec Empire (Triple Alliance)',
    seshatCode: 'AME_Aztec',
    sScore: 84,
    dimensions: {
      polityScale: 80,
      governance: 85,
      infrastructure: 89,
      informationSystems: 82,
      militaryTech: 78,
      axialReligion: 88
    },
    adminLevels: 4,
    capitalPopulationEst: '200,000 – 300,000 (Tenochtitlan island city)',
    peakPopulationEst: '6,000,000',
    primaryLanguageScript: 'Nahuatl (Pictographic Codex Script)',
    monetarySystem: 'Cacao Beans & Quachtli Woven Cotton Cloth',
    codedVariables: [
      {
        variableName: 'Chinampa Floating Gardens & Dike Engineering',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Artificial agricultural islands in Lake Texcoco fed by Chapultepec aqueduct.',
        historicalEvidence: 'Florentine Codex compiled by Bernardino de Sahagún.',
        citations: ['Hassig, R. (1988). Aztec Warfare: Imperial Expansion and Political Control.']
      }
    ],
    cliodynamicNotes: 'High-density Mesoamerican hydraulic civilization with complex tribute networks.'
  },

  'maya-civilization': {
    empireId: 'maya-civilization',
    polityName: 'Classic Maya Civilization',
    seshatCode: 'AME_Maya',
    sScore: 82,
    dimensions: {
      polityScale: 78,
      governance: 80,
      infrastructure: 86,
      informationSystems: 92,
      militaryTech: 74,
      axialReligion: 86
    },
    adminLevels: 3,
    capitalPopulationEst: '100,000 (Tikal / Calakmul)',
    peakPopulationEst: '7,000,000',
    primaryLanguageScript: 'Mayan Hieroglyphic Script',
    monetarySystem: 'Cacao Beans & Jade Beads',
    codedVariables: [
      {
        variableName: 'Mayan Hieroglyphic Script & Long Count Astronomical Calendar',
        category: 'Information',
        status: 'present',
        valueDescription: 'Fully developed logosyllabic writing system and precision solar/lunar calendar cycles.',
        historicalEvidence: 'Dresden Codex, Madrid Codex, and carved limestone stelae across Tikal and Palenque.',
        citations: ['Coe, M.D. (2011). The Maya (8th Edition), Thames & Hudson.']
      }
    ],
    cliodynamicNotes: 'Intellectual beacon of pre-Columbian Americas; pioneered the mathematical zero and precision ephemeris tables.'
  },

  'inca-empire': {
    empireId: 'inca-empire',
    polityName: 'Inca Empire (Tawantinsuyu)',
    seshatCode: 'AME_Inca',
    sScore: 88,
    dimensions: {
      polityScale: 89,
      governance: 92,
      infrastructure: 98,
      informationSystems: 82,
      militaryTech: 80,
      axialReligion: 86
    },
    adminLevels: 5,
    capitalPopulationEst: '150,000 (Cusco)',
    peakPopulationEst: '12,000,000',
    primaryLanguageScript: 'Quechua (Quipu Knotted Records)',
    monetarySystem: 'Mita Reciprocal Labor System (No Currency)',
    codedVariables: [
      {
        variableName: 'Qhapaq Ñan 40,000 km Mountain Road & Chasqui Runners',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Suspension bridges, paved mountain stairways, and relay runners covering 240 km/day.',
        historicalEvidence: 'Extant Qhapaq Ñan network preserved across Peru, Ecuador, Bolivia, and Chile.',
        citations: ['D\'Altroy, T.N. (2014). The Incas (2nd Edition), Wiley-Blackwell.']
      },
      {
        variableName: 'Quipu Decimal Accounting System',
        category: 'Information',
        status: 'present',
        valueDescription: 'Knotted cord devices recording census, tax, agricultural stores, and historical events.',
        historicalEvidence: 'Over 800 surviving quipus analyzed in museum collections worldwide.',
        citations: ['Urton, G. (2003). Signs of the Inka Khipu, Univ of Texas Press.']
      }
    ],
    cliodynamicNotes: 'The ultimate empire of vertical ecological architecture, dry-stone masonry, and currency-less state redistribution.'
  },

  'mali-empire': {
    empireId: 'mali-empire',
    polityName: 'Mali Empire',
    seshatCode: 'AFR_Mali',
    sScore: 85,
    dimensions: {
      polityScale: 84,
      governance: 84,
      infrastructure: 85,
      informationSystems: 88,
      militaryTech: 80,
      axialReligion: 90
    },
    adminLevels: 4,
    capitalPopulationEst: '100,000 (Timbuktu / Niani)',
    peakPopulationEst: '20,000,000',
    primaryLanguageScript: 'Mandinka & Arabic (Ajami Script)',
    monetarySystem: 'Gold Dust, Cowrie Shells & Salt Bars',
    codedVariables: [
      {
        variableName: 'Timbuktu University of Sankore & Manuscript Libraries',
        category: 'Information',
        status: 'present',
        valueDescription: 'Over 25,000 students and hundreds of thousands of manuscripts on law, astronomy, and medicine.',
        historicalEvidence: 'Extant Timbuktu manuscripts (Mamma Haidara Library).',
        citations: ['Hunwick, J.O. (2003). Timbuktu and the Songhay Empire.']
      },
      {
        variableName: 'Kouroukan Fouga (Oral Constitution of 1236 CE)',
        category: 'Governance',
        status: 'present',
        valueDescription: 'Charter established by Sundiata Keita decreeing civic rights, social peace, and guild regulations.',
        historicalEvidence: 'UNESCO Intangible Cultural Heritage listing of the Manden Charter.',
        citations: ['Niane, D.T. (1965). Sundiata: An Epic of Old Mali.']
      }
    ],
    cliodynamicNotes: 'Gold trade epicenter under Mansa Musa; connected Sub-Saharan Africa to the global Mediterranean economy.'
  },

  'ancient-egypt-new-kingdom': {
    empireId: 'ancient-egypt-new-kingdom',
    polityName: 'Ancient Egyptian Empire (New Kingdom)',
    seshatCode: 'AFR_Egypt',
    sScore: 90,
    dimensions: {
      polityScale: 88,
      governance: 92,
      infrastructure: 96,
      informationSystems: 92,
      militaryTech: 84,
      axialReligion: 88
    },
    adminLevels: 5,
    capitalPopulationEst: '250,000 (Thebes / Memphis)',
    peakPopulationEst: '5,000,000',
    primaryLanguageScript: 'Egyptian (Hieroglyphic & Hieratic Scripts)',
    monetarySystem: 'Deben (Standardized Weight of Copper/Silver)',
    codedVariables: [
      {
        variableName: 'Karnak & Abu Simbel Monumental Stone Engineering',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Massive hypostyle halls, rock-cut temples, and irrigation basin management.',
        historicalEvidence: 'Papyrus Harris I and monumental temple inscriptions at Luxor and Abu Simbel.',
        citations: ['Shaw, I. (2000). The Oxford History of Ancient Egypt.']
      }
    ],
    cliodynamicNotes: 'Three-millennium civilization peak under Ramesses II; established the world\'s earliest recorded international peace treaty.'
  },

  'british-empire': {
    empireId: 'british-empire',
    polityName: 'British Empire',
    seshatCode: 'GLO_British',
    sScore: 98,
    dimensions: {
      polityScale: 100,
      governance: 98,
      infrastructure: 99,
      informationSystems: 98,
      militaryTech: 99,
      axialReligion: 90
    },
    adminLevels: 6,
    capitalPopulationEst: '7,300,000 (London in 1920)',
    peakPopulationEst: '458,000,000 (24% of Earth Population)',
    primaryLanguageScript: 'English',
    monetarySystem: 'Pound Sterling (£) backed by Gold Standard',
    codedVariables: [
      {
        variableName: 'Global Steamship, Railway & Submarine Cable Network',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Trans-continental railway grids and imperial telegraph cable (All Red Line).',
        historicalEvidence: 'Board of Trade records and All Red Line telegraph cable maps.',
        citations: ['Ferguson, N. (2003). Empire: The Rise and Demise of the British World Order.']
      }
    ],
    cliodynamicNotes: 'Largest empire in human history; propelled the Industrial Revolution, global trade, and international law.'
  },

  'spanish-empire': {
    empireId: 'spanish-empire',
    polityName: 'Spanish Empire',
    seshatCode: 'GLO_Spanish',
    sScore: 93,
    dimensions: {
      polityScale: 95,
      governance: 92,
      infrastructure: 92,
      informationSystems: 91,
      militaryTech: 94,
      axialReligion: 92
    },
    adminLevels: 6,
    capitalPopulationEst: '200,000 (Madrid / Seville)',
    peakPopulationEst: '68,000,000',
    primaryLanguageScript: 'Spanish',
    monetarySystem: 'Real de a Ocho (Spanish Silver Dollar)',
    codedVariables: [
      {
        variableName: 'Manila Galleon Trans-Pacific Trade Route & Silver Currency',
        category: 'Infrastructure',
        status: 'present',
        valueDescription: 'Connecting Manila to Acapulco and Seville; Real de a Ocho became the world\'s first global currency.',
        historicalEvidence: 'Archivo General de Indias in Seville.',
        citations: ['Flynn, D.O. & Giráldez, A. (1995). Born with a "Silver Spoon": The Origin of World Trade in 1571.']
      }
    ],
    cliodynamicNotes: 'Initiated the Columbian Exchange and global oceanic circumnavigation trade.'
  }
};
