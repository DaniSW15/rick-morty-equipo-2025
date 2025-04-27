import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.interface';
import { favoritesSignal, toggleFavorite, isFavorite, clearFavorites, loadFavoritesFromStorage } from '../../state/signals/favorites.signal';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorite_characters';
  private favoritesSubject = new BehaviorSubject<number[]>([]);

  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    // Cargar favoritos al iniciar el servicio
    loadFavoritesFromStorage();
    // Sincronizar el BehaviorSubject con el signal
    this.favoritesSubject.next(favoritesSignal());
  }

  toggleFavorite(character: Character): void {
    toggleFavorite(character);
    this.favoritesSubject.next(favoritesSignal());
  }

  isFavorite(characterId: number): boolean {
    return isFavorite(characterId);
  }

  getFavorites(): number[] {
    return favoritesSignal();
  }

  getFavoritesCount(): number {
    return favoritesSignal().length;
  }

  clearFavorites(): void {
    clearFavorites();
    this.favoritesSubject.next([]);
  }
}
