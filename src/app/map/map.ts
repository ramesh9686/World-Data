import { Component, ChangeDetectorRef, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../country';
import { COUNTRIES_DATA } from '../countries-data';
import { RealtimeDataService, RealtimeData } from '../realtime-data.service';
import { WorldBankService } from '../world-bank.service';

export interface QuizQuestion {
  id: string;
  type: string;
  questionText: string;
  countryCode: string;
  countryName: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}

export interface FxRateInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateVsUsd: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy {
  // 3D View properties
  viewMode: '2d' | '3d' = '2d';
  tiltStyle = '';

  // Selection & Details
  selectedCountry = '';
  countryData: CountryData | null = null;
  realtimeData: RealtimeData | null = null;
  loading = false;
  loadingRealtime = false;
  error = false;

  // Viewport Pan / Zoom Camera Engine
  zoom = 1.0;
  panX = 0;
  panY = 0;
  isPanning = false;
  panStartX = 0;
  panStartY = 0;

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  // Global Explorer Trivia Challenge Quiz Engine
  quizMode = false;
  quizScore = 0;
  quizStreak = 0;
  quizCurrentIndex = 1;
  quizTotalQuestions = 10;
  quizAnswered = false;
  quizFeedback: string | null = null;
  quizIsCorrect = false;
  quizCompleted = false;
  currentQuizQuestion: QuizQuestion | null = null;

  // General World Knowledge & Landmark Trivia Bank
  private generalTriviaBank = [
    { questionText: "Which country is home to the iconic ivory-white marble Taj Mahal?", countryCode: "IN", countryName: "India", correctAnswer: "India", explanation: "Built in 1632 in Agra" },
    { questionText: "In which country can you visit the ancient Great Pyramids of Giza?", countryCode: "EG", countryName: "Egypt", correctAnswer: "Egypt", explanation: "Constructed over 4,500 years ago along the Nile" },
    { questionText: "Which nation is home to the Eiffel Tower and the Louvre Museum?", countryCode: "FR", countryName: "France", correctAnswer: "France", explanation: "The Louvre is the world's largest art museum" },
    { questionText: "Which country features the ancient Colosseum and the floating canals of Venice?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Heart of ancient Roman architecture" },
    { questionText: "Which country built the historic Great Wall extending over 13,000 miles?", countryCode: "CN", countryName: "China", correctAnswer: "China", explanation: "Built across ancient northern borders" },
    { questionText: "Which country is home to the historic 15th-century Inca citadel of Machu Picchu?", countryCode: "PE", countryName: "Peru", correctAnswer: "Peru", explanation: "Perched high in the Andes Mountains" },
    { questionText: "Which country features the iconic sail-shaped Sydney Opera House?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "World Heritage landmark on Sydney Harbour" },
    { questionText: "Which country received the Statue of Liberty as a gift from France in 1886?", countryCode: "US", countryName: "United States", correctAnswer: "United States", explanation: "Stands on Liberty Island in New York" },
    { questionText: "Which nation features the 98-foot tall Christ the Redeemer statue in Rio de Janeiro?", countryCode: "BR", countryName: "Brazil", correctAnswer: "Brazil", explanation: "Overlooks Rio from Corcovado mountain" },
    { questionText: "Which island nation is famous for Mount Fuji and cherry blossom gardens?", countryCode: "JP", countryName: "Japan", correctAnswer: "Japan", explanation: "Mount Fuji is an active volcanic peak" },
    { questionText: "Which South American nation contains the vast majority of the Amazon Rainforest?", countryCode: "BR", countryName: "Brazil", correctAnswer: "Brazil", explanation: "Contains 60% of the Amazon basin" },
    { questionText: "Which Scandinavian country is world-famous for its dramatic natural fjords and Northern Lights?", countryCode: "NO", countryName: "Norway", correctAnswer: "Norway", explanation: "Features over 1,000 coastal sea fjords" },
    { questionText: "Which island nation is nicknamed the 'Land of Fire and Ice' due to volcanoes and glaciers?", countryCode: "IS", countryName: "Iceland", correctAnswer: "Iceland", explanation: "Home to over 130 active and extinct volcanoes" },
    { questionText: "Which Middle Eastern country is home to the ancient rock-cut city of Petra?", countryCode: "JO", countryName: "Jordan", correctAnswer: "Jordan", explanation: "Carved into rose-red sandstone cliffs" },
    { questionText: "Which East Asian nation is traditionally known around the world as the 'Land of the Rising Sun'?", countryCode: "JP", countryName: "Japan", correctAnswer: "Japan", explanation: "Nihon means origin of the sun" },
    { questionText: "Which country is world-renowned as the birthplace of Pizza, Pasta, and Gelato?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Culinary capital of Europe" },
    { questionText: "Which nation is famous for Tacos, Mariachi music, and ancient Mayan pyramids?", countryCode: "MX", countryName: "Mexico", correctAnswer: "Mexico", explanation: "Home to Chichen Itza and Teotihuacan" },
    { questionText: "Which country produces over 70% of the world's pure Maple Syrup?", countryCode: "CA", countryName: "Canada", correctAnswer: "Canada", explanation: "Quebec is the top producer" },
    { questionText: "Which Mediterranean country is celebrated as the birthplace of the Olympic Games?", countryCode: "GR", countryName: "Greece", correctAnswer: "Greece", explanation: "First Olympic games held in 776 BC" },
    { questionText: "Which European country is famous for its colorful Tulip fields, Windmills, and Canals?", countryCode: "NL", countryName: "Netherlands", correctAnswer: "Netherlands", explanation: "Famous for Keukenhof gardens" },
    { questionText: "Which European nation is famous for Flamenco dancing, Tapas cuisine, and Bullfighting?", countryCode: "ES", countryName: "Spain", correctAnswer: "Spain", explanation: "Home to Antoni Gaudí's architecture" },
    { questionText: "Which Asian country is globally famous for K-Pop, Kimchi, and Taekwondo?", countryCode: "KR", countryName: "South Korea", correctAnswer: "South Korea", explanation: "Seoul is a high-tech global capital" },
    { questionText: "Which country contains the Great Barrier Reef, the largest coral reef system on Earth?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "Composed of over 2,900 individual reefs" },
    { questionText: "Which nation is the natural habitat of wild Kangaroos, Koalas, and Platypuses?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "80% of mammals are native only here" },
    { questionText: "Which East African nation is home to Serengeti National Park and Mount Kilimanjaro?", countryCode: "TZ", countryName: "Tanzania", correctAnswer: "Tanzania", explanation: "Kilimanjaro is Africa's highest peak" }
  ];

  // 34-Year Temporal Time-Lapse Slider (1990 - 2024)
  selectedYear = 2024;
  minYear = 1990;
  maxYear = 2024;
  isPlayingTimeline = false;
  timelineSpeed = 1;
  private timelineTimer: any = null;

  // Web Audio Synthesizer SFX Engine
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  // Live Foreign Exchange (FX) Currency Telemetry Matrix
  fxMode = false;
  fxAmount = 100;
  fxBaseCurrency = 'USD';
  fxRates: { [key: string]: FxRateInfo } = {
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateVsUsd: 1.0 },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateVsUsd: 0.92 },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateVsUsd: 0.77 },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rateVsUsd: 155.4 },
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rateVsUsd: 83.5 },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', rateVsUsd: 1.37 },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rateVsUsd: 1.51 },
    CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rateVsUsd: 0.89 },
    CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rateVsUsd: 7.25 },
    BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rateVsUsd: 5.55 }
  };

  // Live Telemetry Marquee & Clock Ticker
  livePopulation = 8114582900;
  private tickerTimer: any = null;
  utcTime = '';
  nycTime = '';
  lndTime = '';
  tyoTime = '';
  sydTime = '';
  dxbTime = '';

  // Floating Cursor Tooltip
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;
  hoveredCountryCode = '';
  hoveredCountryName = '';
  hoveredMetricVal = '';

  // World Bank Indicators properties
  wbTopics: any[] = [];
  selectedTopicId: number | null = null;
  wbIndicators: any[] = [];
  filteredIndicators: any[] = [];
  selectedIndicatorId = '';
  selectedIndicatorName = '';
  selectedIndicatorDesc = '';
  indicatorSearchText = '';
  wbIndicatorData: any[] = [];
  
  loadingIndicators = false;
  loadingIndicatorData = false;
  indicatorError = false;

  // Ambient Flight Arcs & Telemetry Nodes
  ambientNodes = [
    { id: 'ny', label: 'NYC', cx: 250, cy: 230, delay: '0s' },
    { id: 'la', label: 'LAX', cx: 160, cy: 230, delay: '1.4s' },
    { id: 'ldn', label: 'LHR', cx: 475, cy: 185, delay: '0.7s' },
    { id: 'dxb', label: 'DXB', cx: 632, cy: 280, delay: '2.1s' },
    { id: 'tyo', label: 'HND', cx: 860, cy: 240, delay: '1.1s' },
    { id: 'sin', label: 'SIN', cx: 770, cy: 370, delay: '2.8s' },
    { id: 'syd', label: 'SYD', cx: 890, cy: 510, delay: '0.4s' },
    { id: 'sao', label: 'GRU', cx: 330, cy: 460, delay: '1.9s' },
    { id: 'cai', label: 'CAI', cx: 550, cy: 260, delay: '2.5s' },
    { id: 'jnb', label: 'JNB', cx: 540, cy: 490, delay: '3.2s' },
    { id: 'bom', label: 'BOM', cx: 690, cy: 300, delay: '1.6s' }
  ];

  ambientArcs = [
    { d: 'M 250 230 Q 360 140 475 185', duration: '6s', delay: '0s' },
    { d: 'M 475 185 Q 550 210 632 280', duration: '5s', delay: '1s' },
    { d: 'M 632 280 Q 750 190 860 240', duration: '7s', delay: '2s' },
    { d: 'M 860 240 Q 820 300 770 370', duration: '5.5s', delay: '0.5s' },
    { d: 'M 770 370 Q 850 430 890 510', duration: '6.5s', delay: '1.5s' },
    { d: 'M 475 185 Q 380 320 330 460', duration: '8s', delay: '2.5s' },
    { d: 'M 632 280 Q 660 285 690 300', duration: '4s', delay: '0.8s' },
    { d: 'M 550 260 Q 570 370 540 490', duration: '7.5s', delay: '1.2s' },
    { d: 'M 160 230 Q 205 220 250 230', duration: '4.5s', delay: '3s' }
  ];

  constructor(
    private countryService: CountryService,
    private realtimeService: RealtimeDataService,
    private wbService: WorldBankService,
    private cdr: ChangeDetectorRef
  ) {
    this.wbTopics = this.wbService.getTopics();
  }

  ngOnInit(): void {
    this.startTicker();
  }

  ngOnDestroy(): void {
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.tickerTimer) clearInterval(this.tickerTimer);
  }

  // Camera & Viewport Zoom / Pan Engine
  zoomIn(): void {
    this.zoom = Math.min(5.0, this.zoom + 0.3);
    this.playUiSound('zoom');
    this.cdr.markForCheck();
  }

  zoomOut(): void {
    this.zoom = Math.max(0.7, this.zoom - 0.3);
    this.playUiSound('zoom');
    this.cdr.markForCheck();
  }

  resetCamera(): void {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.15 : -0.15;
    const oldZoom = this.zoom;
    this.zoom = Math.min(5.0, Math.max(0.7, this.zoom + delta));

    if (oldZoom !== this.zoom) {
      this.cdr.markForCheck();
    }
  }

  startPan(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Don't drag if clicking buttons or interactive overlays
    if (target.closest('.map-control-header, .timeline-bar, .country-card, .vs-card, .choropleth-legend')) {
      return;
    }
    this.isPanning = true;
    this.panStartX = event.clientX - this.panX;
    this.panStartY = event.clientY - this.panY;
  }

  doPan(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panX = event.clientX - this.panStartX;
    this.panY = event.clientY - this.panStartY;
    const vpGroup = document.querySelector('.viewport-zoom-group') as HTMLElement;
    if (vpGroup) {
      vpGroup.style.transform = this.viewportTransform;
    }
  }

  endPan(): void {
    if (this.isPanning) {
      this.isPanning = false;
      this.cdr.markForCheck();
    }
  }

  flyToCountry(code: string): void {
    const el = document.getElementById(code.toLowerCase()) as unknown as SVGGraphicsElement;
    if (el && typeof el.getBBox === 'function') {
      try {
        const bbox = el.getBBox();
        const svgCenterX = bbox.x + bbox.width / 2;
        const svgCenterY = bbox.y + bbox.height / 2;
        
        // Target map center is (505, 333)
        this.panX = (505 - svgCenterX) * this.zoom;
        this.panY = (333 - svgCenterY) * this.zoom;
        this.zoom = Math.max(1.4, this.zoom);
        this.cdr.markForCheck();
      } catch (e) {
        // Fallback
      }
    }
  }

  // Global Explorer Trivia Challenge Quiz Engine
  toggleQuizMode(): void {
    this.quizMode = !this.quizMode;
    this.playUiSound('click');
    if (this.quizMode) {
      this.fxMode = false;
      this.startQuiz();
    }
    this.cdr.markForCheck();
  }

  startQuiz(): void {
    this.quizScore = 0;
    this.quizStreak = 0;
    this.quizCurrentIndex = 1;
    this.quizCompleted = false;
    this.generateQuizQuestion();
  }

  generateQuizQuestion(): void {
    this.quizAnswered = false;
    this.quizFeedback = null;
    
    const countryKeys = Object.keys(COUNTRIES_DATA);
    if (countryKeys.length === 0) return;

    const isGeneralTrivia = Math.random() < 0.7 && this.generalTriviaBank.length > 0;

    if (isGeneralTrivia) {
      const qItem = this.generalTriviaBank[Math.floor(Math.random() * this.generalTriviaBank.length)];
      const distractors = new Set<string>();

      while (distractors.size < 3) {
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rName = COUNTRIES_DATA[rKey].name;
        if (rName && rName.toLowerCase() !== qItem.correctAnswer.toLowerCase()) {
          distractors.add(rName);
        }
      }

      const options = [qItem.correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuizQuestion = {
        id: qItem.countryCode,
        type: 'general',
        questionText: qItem.questionText,
        countryCode: qItem.countryCode,
        countryName: qItem.countryName,
        correctAnswer: qItem.correctAnswer,
        options,
        explanation: qItem.explanation
      };

      this.flyToCountry(qItem.countryCode);
    } else {
      const targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
      const target = COUNTRIES_DATA[targetKey];
      const distractors = new Set<string>();

      while (distractors.size < 3) {
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rCap = COUNTRIES_DATA[rKey].capitalCity;
        if (rCap && rCap.toLowerCase() !== target.capitalCity.toLowerCase()) {
          distractors.add(rCap);
        }
      }

      const options = [target.capitalCity, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuizQuestion = {
        id: targetKey,
        type: 'capital',
        questionText: `What is the capital city of ${target.name}?`,
        countryCode: targetKey,
        countryName: target.name,
        correctAnswer: target.capitalCity,
        options,
        explanation: `${target.capitalCity} is the capital of ${target.name}`
      };

      this.flyToCountry(targetKey);
    }

    this.cdr.markForCheck();
  }

  submitQuizAnswer(chosenAnswer: string): void {
    if (this.quizAnswered || !this.currentQuizQuestion) return;

    this.quizAnswered = true;
    const choice = chosenAnswer.trim().toLowerCase();
    const correct = this.currentQuizQuestion.correctAnswer.trim().toLowerCase();
    const cCode = this.currentQuizQuestion.countryCode.toLowerCase();
    const cName = this.currentQuizQuestion.countryName.toLowerCase();

    const isCorrect = (choice === correct || choice === cCode || choice === cName);
    this.quizIsCorrect = isCorrect;

    if (isCorrect) {
      this.quizStreak++;
      const bonus = (this.quizStreak > 1) ? this.quizStreak * 5 : 0;
      this.quizScore += 100 + bonus;
      const exp = this.currentQuizQuestion.explanation ? ` — ${this.currentQuizQuestion.explanation}` : '';
      this.quizFeedback = `🎉 Correct! ${this.currentQuizQuestion.countryName}${exp}`;
      this.playUiSound('correct');
    } else {
      this.quizStreak = 0;
      const exp = this.currentQuizQuestion.explanation ? ` — ${this.currentQuizQuestion.explanation}` : '';
      this.quizFeedback = `❌ Incorrect. Correct answer: ${this.currentQuizQuestion.correctAnswer}${exp}`;
      this.playUiSound('wrong');
    }

    this.cdr.markForCheck();
  }

  nextQuizQuestion(): void {
    if (this.quizCurrentIndex >= this.quizTotalQuestions) {
      this.quizCompleted = true;
      this.playUiSound('select');
    } else {
      this.quizCurrentIndex++;
      this.generateQuizQuestion();
    }
    this.cdr.markForCheck();
  }

  // FX Currency Telemetry Matrix Methods
  toggleFxMode(): void {
    this.fxMode = !this.fxMode;
    this.playUiSound('click');
    if (this.fxMode) {
      this.quizMode = false;
    }
    this.cdr.markForCheck();
  }

  onFxAmountInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.fxAmount = isNaN(val) ? 0 : val;
    this.cdr.markForCheck();
  }

  setFxBaseCurrency(code: string): void {
    this.fxBaseCurrency = code;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  get convertedFxRates(): { code: string; name: string; symbol: string; flag: string; convertedValue: number }[] {
    const baseInfo = this.fxRates[this.fxBaseCurrency] || this.fxRates['USD'];
    const usdAmount = this.fxAmount / baseInfo.rateVsUsd;

    return Object.values(this.fxRates).map(rateInfo => {
      return {
        code: rateInfo.code,
        name: rateInfo.name,
        symbol: rateInfo.symbol,
        flag: rateInfo.flag,
        convertedValue: usdAmount * rateInfo.rateVsUsd
      };
    });
  }

  // 34-Year Temporal Time-Lapse Slider
  onYearInput(event: Event): void {
    this.selectedYear = parseInt((event.target as HTMLInputElement).value, 10);
    this.cdr.markForCheck();
  }

  toggleTimelinePlay(): void {
    this.isPlayingTimeline = !this.isPlayingTimeline;
    this.playUiSound('click');

    if (this.isPlayingTimeline) {
      if (this.selectedYear >= this.maxYear) {
        this.selectedYear = this.minYear;
      }
      this.timelineTimer = setInterval(() => {
        if (this.selectedYear < this.maxYear) {
          this.selectedYear++;
        } else {
          this.selectedYear = this.minYear;
        }
        this.cdr.markForCheck();
      }, 1000 / this.timelineSpeed);
    } else {
      if (this.timelineTimer) {
        clearInterval(this.timelineTimer);
        this.timelineTimer = null;
      }
    }
    this.cdr.markForCheck();
  }

  changeTimelineSpeed(): void {
    const speeds = [1, 2, 4];
    const nextIdx = (speeds.indexOf(this.timelineSpeed) + 1) % speeds.length;
    this.timelineSpeed = speeds[nextIdx];
    this.playUiSound('click');

    if (this.isPlayingTimeline) {
      this.toggleTimelinePlay();
      this.toggleTimelinePlay();
    }
  }

  // Web Audio Synthesizer Sound Engine
  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    if (!this.audioMuted) {
      this.playUiSound('click');
    }
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'hover' | 'select' | 'sweep' | 'zoom' | 'correct' | 'wrong'): void {
    if (this.audioMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'zoom') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // Hover Tooltip with SVG Event Delegation
  onSvgMouseMove(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target && target.tagName === 'path' && target.id) {
      const code = target.id;
      const name = target.getAttribute('name') || code;
      const upperCode = code.toUpperCase();
      const tooltipX = event.clientX + 16;
      const tooltipY = event.clientY - 12;

      if (this.hoveredCountryCode !== upperCode || !this.showTooltip) {
        this.hoveredCountryCode = upperCode;
        this.hoveredCountryName = name;
        this.tooltipX = tooltipX;
        this.tooltipY = tooltipY;
        this.showTooltip = true;

        if (this.quizMode && this.currentQuizQuestion) {
          this.hoveredMetricVal = `🎯 Quiz Target: Click map country to submit answer!`;
        } else {
          const data = COUNTRIES_DATA[upperCode];
          this.hoveredMetricVal = data ? `Region: ${data.region}` : 'Click to view full telemetry';
        }
        this.cdr.markForCheck();
      } else {
        this.tooltipX = tooltipX;
        this.tooltipY = tooltipY;
        const ttEl = document.querySelector('.floating-hud-tooltip') as HTMLElement;
        if (ttEl) {
          ttEl.style.left = `${tooltipX}px`;
          ttEl.style.top = `${tooltipY}px`;
        }
      }
      return;
    }
    if (this.showTooltip) {
      this.showTooltip = false;
      this.cdr.markForCheck();
    }
  }

  onSvgMouseLeave(): void {
    if (this.showTooltip) {
      this.showTooltip = false;
      this.cdr.markForCheck();
    }
  }



  // Live Marquee Ticker & Clocks
  private startTicker(): void {
    this.tickerTimer = setInterval(() => {
      this.livePopulation += Math.floor(Math.random() * 3) + 1;

      const now = new Date();
      this.utcTime = now.toUTCString().slice(17, 25) + ' UTC';
      this.nycTime = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      this.lndTime = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false });
      this.tyoTime = now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false });
      this.sydTime = now.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour12: false });
      this.dxbTime = now.toLocaleTimeString('en-AE', { timeZone: 'Asia/Dubai', hour12: false });

      this.cdr.markForCheck();
    }, 1000);
  }

  // Map & Controls logic
  setViewMode(mode: '2d' | '3d'): void {
    this.viewMode = mode;
    if (mode === '2d') {
      this.tiltStyle = '';
    }
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.viewMode !== '3d') {
      this.tiltStyle = '';
      return;
    }
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    
    const tiltX = py * 12;
    const tiltY = -px * 12;
    
    this.tiltStyle = `perspective(1200px) rotateX(${32 + tiltX}deg) rotateY(${-6 + tiltY}deg) rotateZ(-12deg)`;
    this.cdr.markForCheck();
  }

  onMouseLeave(): void {
    this.tiltStyle = '';
    this.cdr.markForCheck();
  }

  onCountrySelected(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target.tagName !== 'path') return;

    const countryCode = target.id;
    const countryName = target.getAttribute('name') || countryCode;

    if (this.quizMode && !this.quizAnswered && this.currentQuizQuestion) {
      this.submitQuizAnswer(countryCode);
      return;
    }

    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }
    target.classList.add('selected');

    if (countryCode) {
      this.selectedCountry = countryCode;
      this.playUiSound('select');
      this.fetchCountryData(countryCode);
      this.flyToCountry(countryCode);
    }
  }

  getCountryCodeFromIso3(iso3: string): string {
    const code = Object.keys(COUNTRIES_DATA).find(
      (key) => COUNTRIES_DATA[key].id.toLowerCase() === iso3.toLowerCase()
    );
    return code || '';
  }

  getCountryNameFromIso3(iso3: string): string {
    const code = this.getCountryCodeFromIso3(iso3);
    return code ? COUNTRIES_DATA[code].name : iso3;
  }

  selectNeighbour(iso3: string): void {
    const code = this.getCountryCodeFromIso3(iso3);
    if (!code) return;

    const prev = document.querySelector('path.selected');
    if (prev) prev.classList.remove('selected');

    const path = document.getElementById(code.toLowerCase());
    if (path) {
      path.classList.add('selected');
    }

    this.selectedCountry = code;
    this.playUiSound('select');
    this.fetchCountryData(code);
    this.flyToCountry(code);
  }

  getWindDirectionLabel(degrees: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(degrees / 22.5) % 16;
    return dirs[idx];
  }

  // World Bank Indicators Methods
  selectTopic(topicId: number): void {
    this.selectedTopicId = topicId;
    this.indicatorError = false;
    this.wbIndicatorData = [];
    this.indicatorSearchText = '';

    const indicators = this.wbService.getIndicatorsByTopic(topicId);
    this.wbIndicators = indicators;
    this.filteredIndicators = indicators;
    this.loadingIndicators = false;

    if (indicators.length > 0) {
      this.selectIndicator(indicators[0].id, indicators[0].name, indicators[0].sourceNote);
    }
  }

  onSearchInput(event: Event): void {
    this.indicatorSearchText = (event.target as HTMLInputElement).value;
    this.filterIndicators();
  }

  filterIndicators(): void {
    const q = this.indicatorSearchText.toLowerCase().trim();
    if (!q) {
      this.filteredIndicators = this.wbIndicators;
    } else {
      this.filteredIndicators = this.wbIndicators.filter(
        ind => ind.name.toLowerCase().includes(q) || ind.id.toLowerCase().includes(q)
      );
    }
  }

  selectIndicator(id: string, name: string, desc?: string): void {
    this.selectedIndicatorId = id;
    this.selectedIndicatorName = name;
    this.selectedIndicatorDesc = desc || '';
    this.playUiSound('click');
    this.fetchIndicatorData();
  }

  fetchIndicatorData(): void {
    if (!this.countryData || !this.selectedIndicatorId) return;
    this.loadingIndicatorData = true;
    this.wbIndicatorData = [];
    this.cdr.markForCheck();
    
    this.wbService.getIndicatorData(this.countryData.id, this.selectedIndicatorId).subscribe({
      next: (data) => {
        this.wbIndicatorData = data;
        this.loadingIndicatorData = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingIndicatorData = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Chart computations
  get chartPoints(): { year: number, value: number }[] {
    return this.wbIndicatorData.filter(d => d.value !== null) as { year: number, value: number }[];
  }

  get svgPath(): string {
    const points = this.chartPoints;
    if (points.length < 2) return '';

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.year)} ${yScale(p.value)}`)
      .join(' ');
  }

  get svgAreaPath(): string {
    const points = this.chartPoints;
    if (points.length < 2) return '';

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.year)} ${yScale(p.value)}`)
      .join(' ');

    const firstX = xScale(points[0].year);
    const lastX = xScale(points[points.length - 1].year);
    const bottomY = height - padding;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  get chartDots(): { year: number, value: number, cx: number, cy: number, formattedValue: string }[] {
    const points = this.chartPoints;
    if (points.length === 0) return [];

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    return points.map(p => ({
      year: p.year,
      value: p.value,
      cx: xScale(p.year),
      cy: yScale(p.value),
      formattedValue: this.formatNumber(p.value)
    }));
  }

  get chartLabels() {
    const points = this.chartPoints;
    if (points.length === 0) {
      return { minYear: '', maxYear: '', minVal: '', maxVal: '' };
    }
    const years = points.map(p => p.year);
    const vals = points.map(p => p.value);
    return {
      minYear: Math.min(...years).toString(),
      maxYear: Math.max(...years).toString(),
      minVal: this.formatNumber(Math.min(...vals)),
      maxVal: this.formatNumber(Math.max(...vals))
    };
  }

  formatNumber(val: number): string {
    if (val >= 1.0e+12) {
      return (val / 1.0e+12).toFixed(2) + 'T';
    }
    if (val >= 1.0e+9) {
      return (val / 1.0e+9).toFixed(2) + 'B';
    }
    if (val >= 1.0e+6) {
      return (val / 1.0e+6).toFixed(2) + 'M';
    }
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  private fetchCountryData(countryCode: string): void {
    this.loading = true;
    this.error = false;
    this.countryData = null;
    this.realtimeData = null;
    this.wbIndicatorData = [];
    this.cdr.markForCheck();

    this.countryService.getCountryData(countryCode).subscribe({
      next: (data) => {
        this.countryData = data;
        this.loading = false;
        if (!data) {
          this.error = true;
        } else {
          this.fetchRealtimeData(data.latitude, data.longitude);

          if (this.selectedIndicatorId) {
            this.fetchIndicatorData();
          } else {
            this.selectTopic(3);
          }
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.markForCheck();
      },
    });
  }

  private fetchRealtimeData(lat: string, lng: string): void {
    if (!lat || !lng) return;
    this.loadingRealtime = true;
    this.realtimeService.getRealtimeData(lat, lng).subscribe({
      next: (data) => {
        this.realtimeData = data;
        this.loadingRealtime = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingRealtime = false;
        this.cdr.markForCheck();
      },
    });
  }
}
