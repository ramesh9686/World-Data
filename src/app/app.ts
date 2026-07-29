import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly title = signal('World Explorer');
  public sidebarCollapsed: boolean = false;

  constructor(public router: Router) {}

  get isHomePage(): boolean {
    const url = this.router.url;
    return url === '/' || url.includes('home');
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSelectModule(event: Event): void {
    const target = (event.target as HTMLSelectElement).value;
    if (target) {
      this.router.navigate([target]);
    }
  }
}
