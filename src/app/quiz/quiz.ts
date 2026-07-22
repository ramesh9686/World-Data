import { Component, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COUNTRIES_DATA } from '../countries-data';

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

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit, OnDestroy {
  quizScore = 0;
  quizStreak = 0;
  quizCurrentIndex = 1;
  quizTotalQuestions = 10;
  quizAnswered = false;
  quizFeedback: string | null = null;
  quizIsCorrect = false;
  quizCompleted = false;
  currentQuestion: QuizQuestion | null = null;

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
    { questionText: "Which country is home to the iconic ivory-white marble Taj Mahal?", countryCode: "IN", countryName: "India", correctAnswer: "India", explanation: "Built in 1632 in Agra by Shah Jahan" },
    { questionText: "In which country can you visit the ancient Great Pyramids of Giza?", countryCode: "EG", countryName: "Egypt", correctAnswer: "Egypt", explanation: "Constructed over 4,500 years ago along the Nile" },
    { questionText: "Which nation is home to the Eiffel Tower and the Louvre Museum?", countryCode: "FR", countryName: "France", correctAnswer: "France", explanation: "The Louvre is the world's largest art museum" },
    { questionText: "Which country features the ancient Colosseum and the floating canals of Venice?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Heart of ancient Roman architecture" },
    { questionText: "Which country built the historic Great Wall extending over 13,000 miles?", countryCode: "CN", countryName: "China", correctAnswer: "China", explanation: "Built across ancient northern borders" },
    { questionText: "Which country is home to the historic 15th-century Inca citadel of Machu Picchu?", countryCode: "PE", countryName: "Peru", correctAnswer: "Peru", explanation: "Perched high in the Andes Mountains" },
    { questionText: "Which country features the iconic sail-shaped Sydney Opera House?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "World Heritage landmark on Sydney Harbour" },
    { questionText: "Which country received the Statue of Liberty as a gift from France in 1886?", countryCode: "US", countryName: "United States", correctAnswer: "United States", explanation: "Stands on Liberty Island in New York Harbor" },
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startQuiz();
  }

  ngOnDestroy(): void {}

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

    const isGeneralTrivia = Math.random() < 0.75 && this.generalTriviaBank.length > 0;

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

      this.currentQuestion = {
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

      this.currentQuestion = {
        id: targetKey,
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

    this.cdr.markForCheck();
  }

  submitQuizAnswer(chosenAnswer: string): void {
    if (this.quizAnswered || !this.currentQuestion) return;

    this.quizAnswered = true;
    const choice = chosenAnswer.trim().toLowerCase();
    const correct = this.currentQuestion.correctAnswer.trim().toLowerCase();
    const cCode = this.currentQuestion.countryCode.toLowerCase();
    const cName = this.currentQuestion.countryName.toLowerCase();

    const isCorrect = (choice === correct || choice === cCode || choice === cName);
    this.quizIsCorrect = isCorrect;

    if (isCorrect) {
      this.quizStreak++;
      const bonus = (this.quizStreak > 1) ? this.quizStreak * 5 : 0;
      this.quizScore += 100 + bonus;
      const exp = this.currentQuestion.explanation ? ` — ${this.currentQuestion.explanation}` : '';
      this.quizFeedback = `🎉 Correct! ${this.currentQuestion.countryName}${exp}`;
      this.playUiSound('correct');
    } else {
      this.quizStreak = 0;
      const exp = this.currentQuestion.explanation ? ` — ${this.currentQuestion.explanation}` : '';
      this.quizFeedback = `❌ Incorrect. Correct answer: ${this.currentQuestion.correctAnswer}${exp}`;
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
