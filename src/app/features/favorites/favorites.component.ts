import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Character } from '../../core/models/character.interface';
import {
  favorites as favoritesSignal,
  toggleFavorite,
  favoritesCount
} from '../../state/signals/favorites.signal';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  readonly favorites = favoritesSignal;
  readonly totalFavorites = favoritesCount;
  displayedColumns: string[] = ['image', 'name', 'status', 'species', 'type', 'gender', 'actions'];

  constructor(private router: Router) {}

  viewCharacterDetails(character: Character): void {
    this.router.navigate(['/characters', character.id]);
  }

  removeFromFavorites(character: Character): void {
    toggleFavorite(character);
  }
}
