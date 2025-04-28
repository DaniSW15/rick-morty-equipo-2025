import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'characters',
    loadComponent: () => import('./features/character-table/character-table.component')
      .then(m => m.CharacterTableComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./features/character-detail/character-detail.component')
      .then(m => m.CharacterDetailComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./features/character-edit/character-edit.component')
      .then(m => m.CharacterEditComponent)
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
