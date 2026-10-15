import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SeoService } from './services/seo.service';
import { MinimalSidebarComponent } from './components/minimal-sidebar/minimal-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MinimalSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly title = signal('Atlas');
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
