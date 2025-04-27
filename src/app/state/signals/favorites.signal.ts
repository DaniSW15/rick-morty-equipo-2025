import { computed, signal } from '@angular/core';
import { Character } from '../../core/models/character.interface';

// Estado inicial
const initialState: number[] = [];

// Señales
export const favoritesSignal = signal<any[]>(initialState);

// Selectores
export const favorites = computed(() => favoritesSignal());
export const favoritesCount = computed(() => favoritesSignal().length);

// Acciones
export function loadFavoritesFromStorage() {
  try {
    const stored = localStorage.getItem('favorite_characters');
    const favorites = stored ? JSON.parse(stored) : [];
    favoritesSignal.set(favorites);
  } catch (error) {
    console.error('Error loading favorites:', error);
    favoritesSignal.set([]);
  }
}

export function toggleFavorite(character: Character) {
  if (!character?.id) return;

  const favorites = favoritesSignal();
  const index = favorites.indexOf(character.id);

  if (index === -1) {
    addFavorite(character);
  } else {
    removeFavorite(character.id);
  }
}

export function isFavorite(characterId: number): boolean {
  if (!characterId) return false;
  return favoritesSignal().includes(characterId);
}

export function addFavorite(character: Character) {
  if (!character?.id) return;

  const favorites = favoritesSignal();
  if (!favorites.includes(character.id)) {
    const newFavorites = [...favorites, character.id];
    favoritesSignal.set(newFavorites);
    localStorage.setItem('favorite_characters', JSON.stringify(newFavorites));
  }
}

export function removeFavorite(characterId: number) {
  if (!characterId) return;

  const favorites = favoritesSignal();
  const newFavorites = favorites.filter(id => id !== characterId);
  favoritesSignal.set(newFavorites);
  localStorage.setItem('favorite_characters', JSON.stringify(newFavorites));
}

export function clearFavorites() {
  favoritesSignal.set([]);
  localStorage.removeItem('favorite_characters');
}
