import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';
  private favoritesSubject = new BehaviorSubject<number[]>(this.loadFavorites());

  favorites$ = this.favoritesSubject.pipe(
    distinctUntilChanged((prev, curr) =>
      prev.length === curr.length &&
      prev.every((id, i) => id === curr[i])
    ),
    shareReplay(1)
  );

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): number[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  addFavorite(characterId: number): void {
    if (!this.favoritesSubject.value.includes(characterId)) {
      const updated = [...this.favoritesSubject.value, characterId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      this.favoritesSubject.next(updated);
    }
  }

  removeFavorite(characterId: number): void {
    const index = this.favoritesSubject.value.indexOf(characterId);
    if (index > -1) {
      const updated = this.favoritesSubject.value.filter(id => id !== characterId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      this.favoritesSubject.next(updated);
    }
  }

  toggleFavorite(characterId: number): void {
    const currentFavorites = this.favoritesSubject.value;
    const index = currentFavorites.indexOf(characterId);

    const updated = index === -1
      ? [...currentFavorites, characterId]
      : currentFavorites.filter(id => id !== characterId);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.favoritesSubject.next(updated);
  }

  isFavorite(characterId: number): boolean {
    return this.favoritesSubject.value.includes(characterId);
  }

  getFavorites(): number[] {
    return this.favoritesSubject.value;
  }

  clearFavorites(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.favoritesSubject.next([]);
  }
}
