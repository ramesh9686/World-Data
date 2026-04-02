import { Routes } from '@angular/router';
import { MapComponent } from './map/map';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapComponent }
];
