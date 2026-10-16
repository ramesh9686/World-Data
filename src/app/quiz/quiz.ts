import { Component, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COUNTRIES_DATA } from '../countries-data';
import { WORLD_SVG_COUNTRY_PATHS, SVGCountryPath } from '../world-svg-paths';

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

import { RouterLink } from '@angular/router';
import { DecryptedTextComponent, CountUpComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, DecryptedTextComponent, CountUpComponent, SpotlightDirective],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit, OnDestroy {
  public readonly worldPaths: SVGCountryPath[] = WORLD_SVG_COUNTRY_PATHS;

  quizScore = 0;
  quizStreak = 0;
  maxStreak = 0;
  correctCount = 0;
  quizCurrentIndex = 1;
  quizTotalQuestions = 10;
  quizAnswered = false;
  quizFeedback: string | null = null;
  quizIsCorrect = false;
  quizCompleted = false;
  currentQuestion: QuizQuestion | null = null;

  // 15-Second Speed-Run Timer Engine
  timerSeconds = 15;
  readonly maxTimerSeconds = 15;
  private timerInterval: any = null;
  speedBonus = 0;

  // QC Tracking: Prevent Duplicate Questions Per Round
  private visitedQuestionIds = new Set<string>();

  // Viewport camera properties for interactive SVG map
  zoom = 1.0;
  panX = 0;
  panY = 0;

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  // Web Audio Synthesizer SFX Engine
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  // General World & Cultural Trivia Bank
  private generalTriviaBank = [
    { id: "IN_TAJ", questionText: "Which country is home to the iconic ivory-white marble Taj Mahal?", countryCode: "IN", countryName: "India", correctAnswer: "India", explanation: "Built in 1632 in Agra by Shah Jahan" },
    { id: "EG_PYR", questionText: "In which country can you visit the ancient Great Pyramids of Giza?", countryCode: "EG", countryName: "Egypt", correctAnswer: "Egypt", explanation: "Constructed over 4,500 years ago along the Nile" },
    { id: "FR_LOUVRE", questionText: "Which nation is home to the Eiffel Tower and the Louvre Museum?", countryCode: "FR", countryName: "France", correctAnswer: "France", explanation: "The Louvre is the world's largest art museum" },
    { id: "IT_COL", questionText: "Which country features the ancient Colosseum and the floating canals of Venice?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Heart of ancient Roman architecture" },
    { id: "CN_WALL", questionText: "Which country built the historic Great Wall extending over 13,000 miles?", countryCode: "CN", countryName: "China", correctAnswer: "China", explanation: "Built across ancient northern borders" },
    { id: "PE_MACHU", questionText: "Which country is home to the historic 15th-century Inca citadel of Machu Picchu?", countryCode: "PE", countryName: "Peru", correctAnswer: "Peru", explanation: "Perched high in the Andes Mountains" },
    { id: "AU_SYD", questionText: "Which country features the iconic sail-shaped Sydney Opera House?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "World Heritage landmark on Sydney Harbour" },
    { id: "US_LIB", questionText: "Which country received the Statue of Liberty as a gift from France in 1886?", countryCode: "US", countryName: "United States", correctAnswer: "United States", explanation: "Stands on Liberty Island in New York Harbor" },
    { id: "BR_CHRIST", questionText: "Which nation features the 98-foot tall Christ the Redeemer statue in Rio de Janeiro?", countryCode: "BR", countryName: "Brazil", correctAnswer: "Brazil", explanation: "Overlooks Rio from Corcovado mountain" },
    { id: "JP_FUJI", questionText: "Which island nation is famous for Mount Fuji and cherry blossom gardens?", countryCode: "JP", countryName: "Japan", correctAnswer: "Japan", explanation: "Mount Fuji is an active volcanic peak" },
    { id: "BR_AMAZON", questionText: "Which South American nation contains the vast majority of the Amazon Rainforest?", countryCode: "BR", countryName: "Brazil", correctAnswer: "Brazil", explanation: "Contains 60% of the Amazon basin" },
    { id: "NO_FJORDS", questionText: "Which Scandinavian country is world-famous for its dramatic natural fjords and Northern Lights?", countryCode: "NO", countryName: "Norway", correctAnswer: "Norway", explanation: "Features over 1,000 coastal sea fjords" },
    { id: "IS_ICE", questionText: "Which island nation is nicknamed the 'Land of Fire and Ice' due to volcanoes and glaciers?", countryCode: "IS", countryName: "Iceland", correctAnswer: "Iceland", explanation: "Home to over 130 active and extinct volcanoes" },
    { id: "JO_PETRA", questionText: "Which Middle Eastern country is home to the ancient rock-cut city of Petra?", countryCode: "JO", countryName: "Jordan", correctAnswer: "Jordan", explanation: "Carved into rose-red sandstone cliffs" },
    { id: "JP_SUN", questionText: "Which East Asian nation is traditionally known around the world as the 'Land of the Rising Sun'?", countryCode: "JP", countryName: "Japan", correctAnswer: "Japan", explanation: "Nihon means origin of the sun" },
    { id: "IT_PIZZA", questionText: "Which country is world-renowned as the birthplace of Pizza, Pasta, and Gelato?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Culinary capital of Europe" },
    { id: "MX_TACO", questionText: "Which nation is famous for Tacos, Mariachi music, and ancient Mayan pyramids?", countryCode: "MX", countryName: "Mexico", correctAnswer: "Mexico", explanation: "Home to Chichen Itza and Teotihuacan" },
    { id: "CA_MAPLE", questionText: "Which country produces over 70% of the world's pure Maple Syrup?", countryCode: "CA", countryName: "Canada", correctAnswer: "Canada", explanation: "Quebec is the top producer" },
    { id: "GR_OLYMPIC", questionText: "Which Mediterranean country is celebrated as the birthplace of the Olympic Games?", countryCode: "GR", countryName: "Greece", correctAnswer: "Greece", explanation: "First Olympic games held in 776 BC" },
    { id: "NL_TULIP", questionText: "Which European country is famous for its colorful Tulip fields, Windmills, and Canals?", countryCode: "NL", countryName: "Netherlands", correctAnswer: "Netherlands", explanation: "Famous for Keukenhof gardens" },
    { id: "ES_FLAMENCO", questionText: "Which European nation is famous for Flamenco dancing, Tapas cuisine, and Bullfighting?", countryCode: "ES", countryName: "Spain", correctAnswer: "Spain", explanation: "Home to Antoni Gaudí's architecture" },
    { id: "KR_KPOP", questionText: "Which Asian country is globally famous for K-Pop, Kimchi, and Taekwondo?", countryCode: "KR", countryName: "South Korea", correctAnswer: "South Korea", explanation: "Seoul is a high-tech global capital" },
    { id: "AU_REEF", questionText: "Which country contains the Great Barrier Reef, the largest coral reef system on Earth?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "Composed of over 2,900 individual reefs" },
    { id: "AU_KOALA", questionText: "Which nation is the natural habitat of wild Kangaroos, Koalas, and Platypuses?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "80% of mammals are native only here" },
    { id: "TZ_KILI", questionText: "Which East African nation is home to Serengeti National Park and Mount Kilimanjaro?", countryCode: "TZ", countryName: "Tanzania", correctAnswer: "Tanzania", explanation: "Kilimanjaro is Africa's highest peak" }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startQuiz();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // Keyboard Hotkeys: 1-4, A-D, Enter to Next
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.quizCompleted) return;

    if (this.quizAnswered) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.nextQuizQuestion();
      }
      return;
    }

    if (!this.currentQuestion || !this.currentQuestion.options) return;

    const key = event.key.toLowerCase();
    let index = -1;

    if (key === '1' || key === 'a') index = 0;
    else if (key === '2' || key === 'b') index = 1;
    else if (key === '3' || key === 'c') index = 2;
    else if (key === '4' || key === 'd') index = 3;

    if (index >= 0 && index < this.currentQuestion.options.length) {
      event.preventDefault();
      this.submitQuizAnswer(this.currentQuestion.options[index]);
    }
  }

  startQuiz(): void {
    this.quizScore = 0;
    this.quizStreak = 0;
    this.maxStreak = 0;
    this.correctCount = 0;
    this.quizCurrentIndex = 1;
    this.quizCompleted = false;
    this.visitedQuestionIds.clear();
    this.generateQuizQuestion();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerSeconds = this.maxTimerSeconds;
    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      if (this.timerSeconds <= 0) {
        this.stopTimer();
        this.handleTimerExpired();
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private handleTimerExpired(): void {
    if (this.quizAnswered || !this.currentQuestion) return;
    this.submitQuizAnswer('__TIMEOUT__');
  }

  private isCleanCountryName(name: string): boolean {
    if (!name) return false;
    const lower = name.toLowerCase();
    if (lower.includes('(') || lower.includes('income') || lower.includes('total') || lower.includes('world') || lower.includes('eligible') || lower.includes('&')) {
      return false;
    }
    return true;
  }

  generateQuizQuestion(): void {
    this.stopTimer();
    this.quizAnswered = false;
    this.quizFeedback = null;
    this.speedBonus = 0;

    const countryKeys = Object.keys(COUNTRIES_DATA);
    if (countryKeys.length === 0) return;

    // Filter unvisited trivia items
    const availableTrivia = this.generalTriviaBank.filter(q => !this.visitedQuestionIds.has(q.id));
    const isGeneralTrivia = Math.random() < 0.75 && availableTrivia.length > 0;

    if (isGeneralTrivia) {
      const qItem = availableTrivia[Math.floor(Math.random() * availableTrivia.length)];
      this.visitedQuestionIds.add(qItem.id);

      // QC Rule: Pick 3 clean, real country distractors + 1 correct answer, shuffle all 4 randomly
      const distractors = new Set<string>();
      let attempts = 0;
      while (distractors.size < 3 && attempts < 100) {
        attempts++;
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rData = COUNTRIES_DATA[rKey];
        if (rData && this.isCleanCountryName(rData.name) && rData.name.toLowerCase() !== qItem.correctAnswer.toLowerCase()) {
          distractors.add(rData.name);
        }
      }

      const options = [qItem.correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuestion = {
        id: qItem.id,
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
      // Find unvisited capital target
      let targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
      let attempts = 0;
      while ((!this.isCleanCountryName(COUNTRIES_DATA[targetKey]?.name) || this.visitedQuestionIds.has(`CAP_${targetKey}`)) && attempts < 30) {
        targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        attempts++;
      }
      this.visitedQuestionIds.add(`CAP_${targetKey}`);
      const target = COUNTRIES_DATA[targetKey];

      // QC Rule: Pick 3 clean, real capital distractors + 1 correct answer, shuffle all 4 randomly
      const distractors = new Set<string>();
      let capAttempts = 0;
      while (distractors.size < 3 && capAttempts < 100) {
        capAttempts++;
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rData = COUNTRIES_DATA[rKey];
        if (rData && this.isCleanCountryName(rData.name) && rData.capitalCity && rData.capitalCity.trim() && rData.capitalCity.toLowerCase() !== target.capitalCity.toLowerCase()) {
          distractors.add(rData.capitalCity);
        }
      }

      const options = [target.capitalCity, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuestion = {
        id: `CAP_${targetKey}`,
        type: 'capital',
        questionText: `What is the capital city of ${target.name}?`,
        countryCode: targetKey,
        countryName: target.name,
        correctAnswer: target.capitalCity,
        options,
        explanation: `${target.capitalCity} is the official capital of ${target.name}`
      };

      this.flyToCountry(targetKey);
    }

    this.startTimer();
    this.cdr.markForCheck();
  }

  submitQuizAnswer(chosenAnswer: string): void {
    if (this.quizAnswered || !this.currentQuestion) return;

    this.stopTimer();
    this.quizAnswered = true;
    const choice = chosenAnswer.trim().toLowerCase();
    const correct = this.currentQuestion.correctAnswer.trim().toLowerCase();
    const cCode = this.currentQuestion.countryCode.toLowerCase();
    const cName = this.currentQuestion.countryName.toLowerCase();

    const isTimeout = (chosenAnswer === '__TIMEOUT__');
    const isCorrect = !isTimeout && (choice === correct || choice === cCode || choice === cName);
    this.quizIsCorrect = isCorrect;

    const exp = this.currentQuestion.explanation ? ` — ${this.currentQuestion.explanation}` : '';

    if (isCorrect) {
      this.correctCount++;
      this.quizStreak++;
      if (this.quizStreak > this.maxStreak) this.maxStreak = this.quizStreak;

      // Speed bonus: 10 Aura per second remaining
      this.speedBonus = Math.max(0, this.timerSeconds * 10);
      const streakBonus = (this.quizStreak > 1) ? this.quizStreak * 25 : 0;
      const totalEarned = 100 + this.speedBonus + streakBonus;

      this.quizScore += totalEarned;

      const genZPraise = [
        `🎉 No cap, spot on! 💅 (+${totalEarned} Aura)`,
        `🔥 Left no crumbs! (+${totalEarned} Aura)`,
        `🗿 W Rizz Geography! (+${totalEarned} Aura)`,
        `⚡ High key genius! (+${totalEarned} Aura)`
      ];
      const praise = genZPraise[Math.floor(Math.random() * genZPraise.length)];

      this.quizFeedback = `${praise}${exp}`;
      this.playUiSound('correct');
    } else if (isTimeout) {
      this.quizStreak = 0;
      this.quizFeedback = `⏰ Time's up! You got cooked by the clock 💀 Correct: ${this.currentQuestion.correctAnswer}${exp}`;
      this.playUiSound('wrong');
    } else {
      this.quizStreak = 0;
      const genZRoast = [
        `💀 Cooked! L Take 📉`,
        `❌ It's giving miscalculation...`,
        `📉 Lost some Aura on that one!`
      ];
      const roast = genZRoast[Math.floor(Math.random() * genZRoast.length)];
      this.quizFeedback = `${roast} Correct: ${this.currentQuestion.correctAnswer}${exp}`;
      this.playUiSound('wrong');
    }

    this.cdr.markForCheck();
  }

  nextQuizQuestion(): void {
    if (this.quizCurrentIndex >= this.quizTotalQuestions) {
      this.quizCompleted = true;
      this.stopTimer();
      this.playUiSound('select');
    } else {
      this.quizCurrentIndex++;
      this.generateQuizQuestion();
    }
    this.cdr.markForCheck();
  }

  onCountrySelected(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target.tagName !== 'path') return;

    const countryCode = target.id;
    if (!this.quizAnswered && this.currentQuestion) {
      this.submitQuizAnswer(countryCode);
    }
  }

  flyToCountry(code: string): void {
    const el = document.getElementById(code.toLowerCase()) as unknown as SVGGraphicsElement;
    if (el && typeof el.getBBox === 'function') {
      try {
        const bbox = el.getBBox();
        const svgCenterX = bbox.x + bbox.width / 2;
        const svgCenterY = bbox.y + bbox.height / 2;
        this.panX = (505 - svgCenterX) * 1.3;
        this.panY = (333 - svgCenterY) * 1.3;
        this.zoom = 1.3;
        this.cdr.markForCheck();
      } catch (e) {}
    }
  }

  get genZRankBadge(): { title: string; subtitle: string; icon: string } {
    if (this.quizScore >= 1400) {
      return { title: '👑 Certified Geo God', subtitle: 'Unstoppable Aura! You own the globe, fr no cap.', icon: '🏆' };
    } else if (this.quizScore >= 900) {
      return { title: '🗿 Main Character Explorer', subtitle: 'Huge W! High key cartography skills.', icon: '🥇' };
    } else if (this.quizScore >= 500) {
      return { title: '⚡ Valid Map Scholar', subtitle: 'Not bad! You survived the round with decent Aura.', icon: '🥈' };
    } else {
      return { title: '💀 Absolutely Cooked', subtitle: 'L Take... Time to hit the atlas and regain your Aura!', icon: '🥉' };
    }
  }

  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'select' | 'correct' | 'wrong'): void {
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

      if (type === 'correct') {
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
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  }
}

