import { Routes } from '@angular/router';
import { MapComponent } from './map/map';
import { QuizComponent } from './quiz/quiz';
import { LocateComponent } from './locate/locate';
import { ForexComponent } from './forex/forex';
import { MaritimeComponent } from './maritime/maritime';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'geolibre', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'classic-map', component: MapComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'locate', component: LocateComponent },
  { path: 'forex', component: ForexComponent },
  { path: 'maritime', component: MaritimeComponent },
  { path: '**', redirectTo: 'map' }
];
