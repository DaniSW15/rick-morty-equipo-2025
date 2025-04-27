import { Routes } from '@angular/router';
import { CharacterTableComponent } from './features/character-table/character-table.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CharacterEditComponent } from './features/character-edit/character-edit.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: 'characters',
    component: CharacterTableComponent
  },
  {
    path: 'characters/:id',
    component: CharacterEditComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: '**',
    redirectTo: 'characters'
  }
];
