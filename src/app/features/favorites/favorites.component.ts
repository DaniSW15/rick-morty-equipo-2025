import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Character } from '../../core/models/character.interface';
import { FavoritesService } from '../../core/services/favorites.service';
import { CharacterRestService } from '../../core/services/api/character-rest.service';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteCharacters = signal<Character[]>([]);
  loading = signal<boolean>(false);

  constructor(
    private favoritesService: FavoritesService,
    private characterService: CharacterRestService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteCharacters();
  }

  async loadFavoriteCharacters(): Promise<void> {
    this.loading.set(true);
    try {
      const favoriteIds = this.favoritesService.getFavorites();
      if (favoriteIds.length) {
        const characters = await lastValueFrom(
          this.characterService.getCharactersByIds(favoriteIds)
        );
        this.favoriteCharacters.set(characters);
      }
    } catch (error) {
      console.error('Error loading favorite characters:', error);
    } finally {
      this.loading.set(false);
    }
  }

  removeFromFavorites(character: Character): void {
    this.favoritesService.removeFavorite(character.id);
    this.favoriteCharacters.update(chars =>
      chars.filter(c => c.id !== character.id)
    );
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive': return 'green';
      case 'dead': return 'red';
      default: return 'gray';
    }
  }
}
