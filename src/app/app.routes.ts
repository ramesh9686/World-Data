import { Routes } from '@angular/router';
import { MapComponent } from './map/map';
import { QuizComponent } from './quiz/quiz';
import { LocateComponent } from './locate/locate';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'locate', component: LocateComponent },
  { path: '**', redirectTo: 'map' }
];
