import { Injectable } from '@angular/core';
import { TEMPORAL_POLITIES_CATALOG, TemporalPolity } from '../cliopatria-data';

export interface EpochPreset {
  year: number;
  label: string;
  historicalContext: string;
  primaryPolities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TemporalMapLoaderService {
  private readonly politiesCatalog = TEMPORAL_POLITIES_CATALOG;

  readonly epochPresets: EpochPreset[] = [
    {
      year: -2500,
      label: '2500 BCE (Bronze Age)',
      historicalContext: 'Indus Valley (Harappan) urban planning & Egyptian Old Kingdom Pyramid era',
      primaryPolities: ['indus-valley-civ', 'ancient-egypt-old-kingdom']
    },
    {
      year: -300,
      label: '300 BCE (Mauryan Era)',
      historicalContext: 'Maurya Empire under Chandragupta & Hellenistic Macedonian successor states',
      primaryPolities: ['maurya-empire', 'macedonian-alexander', 'roman-republic']
    },
    {
      year: -30,
      label: '30 BCE (Augustan Era)',
      historicalContext: 'Founding of the Roman Empire by Augustus Caesar & Han Dynasty Silk Road',
      primaryPolities: ['roman-empire', 'han-dynasty', 'maya-civilization']
    },
    {
      year: 400,
      label: '400 CE (Gupta Golden Age)',
      historicalContext: 'Classical Indian Golden Age of zero & literature; Western Roman decline',
      primaryPolities: ['gupta-empire', 'roman-empire', 'han-dynasty', 'maya-civilization']
    },
    {
      year: 750,
      label: '750 CE (Tang & Abbasid)',
      historicalContext: 'Tang Dynasty woodblock printing & Abbasid Golden Age in Baghdad',
      primaryPolities: ['tang-dynasty', 'abbasid-caliphate', 'byzantine-empire', 'maya-civilization']
    },
    {
      year: 1050,
      label: '1050 CE (Chola & Khmer)',
      historicalContext: 'Chola naval hegemony across Malacca Strait & Angkor Wat construction',
      primaryPolities: ['chola-dynasty', 'khmer-empire', 'byzantine-empire']
    },
    {
      year: 1250,
      label: '1250 CE (Mongol Era)',
      historicalContext: 'Pax Mongolica linking Eurasian trade from Sea of Japan to Eastern Europe',
      primaryPolities: ['mongol-empire', 'mali-empire', 'khmer-empire', 'majapahit-empire']
    },
    {
      year: 1550,
      label: '1550 CE (Mughal & Ottoman)',
      historicalContext: 'Mughal Empire under Akbar, Ottoman zenith under Suleiman, & Ming Dynasty',
      primaryPolities: ['mughal-empire', 'ottoman-empire', 'ming-dynasty', 'spanish-empire', 'inca-empire', 'aztec-empire']
    },
    {
      year: 1812,
      label: '1812 CE (Napoleonic Era)',
      historicalContext: 'First French Empire in Continental Europe & Maratha Empire in South Asia',
      primaryPolities: ['french-empire', 'maratha-empire', 'sikh-empire', 'british-empire', 'ottoman-empire']
    },
    {
      year: 1900,
      label: '1900 CE (Industrial Era)',
      historicalContext: 'British Empire global hegemony ("Empire on which the sun never sets")',
      primaryPolities: ['british-empire', 'ottoman-empire', 'spanish-empire']
    }
  ];

  constructor() {}

  /**
   * Format any integer year into human-readable historical format
   * e.g. -30 -> "30 BCE", 100 -> "100 CE", -2500 -> "2500 BCE"
   */
  formatYearLabel(year: number): string {
    if (year === 0) return '1 CE';
    return year > 0 ? `${year} CE` : `${Math.abs(year)} BCE`;
  }

  /**
   * Filter catalog for all active polities in a given year
   */
  getPolitiesForYear(year: number): TemporalPolity[] {
    return this.politiesCatalog.filter(p => year >= p.fromYear && year <= p.toYear);
  }

  /**
   * Get all active country codes for polities active in a given year
   */
  getActiveCountryCodesForYear(year: number): Set<string> {
    const activePolities = this.getPolitiesForYear(year);
    const codes = new Set<string>();
    
    activePolities.forEach(p => {
      p.countryCodes.forEach(code => codes.add(code.toLowerCase()));
    });

    return codes;
  }

  /**
   * Retrieve total number of polities in catalog
   */
  getTotalCatalogCount(): number {
    return this.politiesCatalog.length;
  }
}
