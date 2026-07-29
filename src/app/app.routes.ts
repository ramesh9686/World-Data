import { Routes } from '@angular/router';
import { MapComponent } from './map/map';
import { QuizComponent } from './quiz/quiz';
import { LocateComponent } from './locate/locate';
import { ForexComponent } from './forex/forex';
import { MaritimeComponent } from './maritime/maritime';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'world-data', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'map', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'geolibre', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'empires', loadComponent: () => import('./empires/empires').then(m => m.EmpiresComponent) },
  { path: 'maritime', component: MaritimeComponent },
  { path: 'forex', component: ForexComponent },
  { path: 'locate', component: LocateComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'spatial-sql', loadComponent: () => import('./spatial-sql/spatial-sql').then(m => m.SpatialSqlComponent) },
  { path: 'duckdb', redirectTo: 'spatial-sql' },
  { path: 'classic-map', component: MapComponent },
  { path: '**', redirectTo: 'home' }
];
