import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SeoService } from './services/seo.service';
import { CurvedBottomNavComponent } from './components/curved-bottom-nav/curved-bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CurvedBottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly title = signal('World Explorer');
  public showPrivacyModal: boolean = false;

  constructor(
    public router: Router,
    private seoService: SeoService
  ) {}

  get isHomePage(): boolean {
    const url = this.router.url;
    return url === '/' || url.includes('home');
  }

  togglePrivacyModal(): void {
    this.showPrivacyModal = !this.showPrivacyModal;
  }
}
