import { computed, signal } from '@angular/core';
import { Character } from '../../core/models/character.interface';

// Constantes
const STORAGE_KEY = 'favorite_characters';
const initialState: number[] = [];

// Señales
export const favoritesSignal = signal<number[]>(initialState);

// Selectores computados
export const favorites = computed(() => favoritesSignal());
export const favoritesCount = computed(() => favoritesSignal().length);
export const hasFavorites = computed(() => favoritesCount() > 0);

// Acciones
export function loadFavoritesFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      favoritesSignal.set(initialState);
      return;
    }

    const favorites = JSON.parse(stored);
    if (!Array.isArray(favorites)) {
      console.error('Invalid favorites format in storage');
      favoritesSignal.set(initialState);
      return;
    }

    // Asegurar que solo tengamos IDs válidos
    const validFavorites = favorites.filter((id): id is number =>
      typeof id === 'number' && !isNaN(id) && id > 0
    );

    favoritesSignal.set(validFavorites);
  } catch (error) {
    console.error('Error loading favorites:', error);
    favoritesSignal.set(initialState);
  }
}

export function toggleFavorite(character: Character): void {
  if (!character?.id || typeof character.id !== 'number') {
    console.error('Invalid character ID');
    return;
  }

  const favorites = favoritesSignal();
  const index = favorites.indexOf(character.id);

  if (index === -1) {
    addFavorite(character);
  } else {
    removeFavorite(character.id);
  }
}

export function isFavorite(characterId: number): boolean {
  if (!characterId || typeof characterId !== 'number') return false;
  return favoritesSignal().includes(characterId);
}

export function addFavorite(character: Character): void {
  if (!character?.id || typeof character.id !== 'number') {
    console.error('Invalid character ID');
    return;
  }

  const favorites = favoritesSignal();
  if (!favorites.includes(character.id)) {
    try {
      const newFavorites = [...favorites, character.id];
      favoritesSignal.set(newFavorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  }
}

export function removeFavorite(characterId: number): void {
  if (!characterId || typeof characterId !== 'number') {
    console.error('Invalid character ID');
    return;
  }

  try {
    const favorites = favoritesSignal();
    const newFavorites = favorites.filter(id => id !== characterId);
    favoritesSignal.set(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function clearFavorites(): void {
  try {
    favoritesSignal.set(initialState);
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}
