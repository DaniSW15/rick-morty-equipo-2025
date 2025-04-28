import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'characters',
    loadComponent: () => import('./features/character-table/character-table.component')
      .then(m => m.CharacterTableComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component')
      .then(m => m.FavoritesComponent)
  },
  {
    path: '**',
    redirectTo: 'characters'
  }
];
