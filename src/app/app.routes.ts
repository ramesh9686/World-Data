import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'world-data', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'map', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'geolibre', loadComponent: () => import('./geolibre/geolibre').then(m => m.GeolibreComponent) },
  { path: 'empires', loadComponent: () => import('./empires/empires').then(m => m.EmpiresComponent) },
  { path: 'maritime', loadComponent: () => import('./maritime/maritime').then(m => m.MaritimeComponent) },
  { path: 'forex', loadComponent: () => import('./forex/forex').then(m => m.ForexComponent) },
  { path: 'locate', loadComponent: () => import('./locate/locate').then(m => m.LocateComponent) },
  { path: 'quiz', loadComponent: () => import('./quiz/quiz').then(m => m.QuizComponent) },
  { path: 'spatial-sql', loadComponent: () => import('./spatial-sql/spatial-sql').then(m => m.SpatialSqlComponent) },
  { path: 'duckdb', redirectTo: 'spatial-sql' },
  { path: 'classic-map', loadComponent: () => import('./map/map').then(m => m.MapComponent) },
  { path: 'fishing', loadComponent: () => import('./fishing/fishing').then(m => m.FishingComponent) },
  { path: '**', redirectTo: 'home' }
];

