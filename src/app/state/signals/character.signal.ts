import { computed, signal, WritableSignal } from '@angular/core';
import { Character } from '../../core/models/character.interface';
import { CharacterGraphqlService } from '../../core/services/api/character-graphql.service';

// Interfaces
interface CharacterState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
  filters: {
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
  };
  selectedCharacter: Character | null;
}

// Estado inicial
const initialState: CharacterState = {
  characters: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0
  },
  filters: {
    name: '',
    status: '',
    species: '',
    type: '',
    gender: ''
  },
  selectedCharacter: null
};

// Señales
export const characterState = signal<CharacterState>(initialState);

// Selectores
export const characters: WritableSignal<Character[]> = signal([]);
export const loading: WritableSignal<boolean> = signal(false);
export const selectedCharacter: WritableSignal<Character | null> = signal(null);

export interface Filters {
  name: string;
  species: string;
  status: string;
  type: string;
  gender: string;
}

export const filters: WritableSignal<Filters> = signal({
  name: '',
  species: '',
  status: '',
  type: '',
  gender: ''
});

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export const pagination: WritableSignal<Pagination> = signal({
  currentPage: 1,
  itemsPerPage: 20,
  totalItems: 0
});

// Acciones
export function setCharacters(characters: Character[]) {
  characterState.update(state => ({
    ...state,
    characters
  }));
}

export function setLoading(loading: boolean) {
  characterState.update(state => ({
    ...state,
    loading
  }));
}

export function setError(error: string | null) {
  characterState.update(state => ({
    ...state,
    error
  }));
}

export function setPagination(pagination: Partial<CharacterState['pagination']>) {
  characterState.update(state => ({
    ...state,
    pagination: { ...state.pagination, ...pagination }
  }));
}

export function setFilters(filters: Partial<CharacterState['filters']>) {
  characterState.update(state => ({
    ...state,
    filters: { ...state.filters, ...filters }
  }));
}

export function setSelectedCharacter(character: Character | null) {
  characterState.update(state => ({
    ...state,
    selectedCharacter: character
  }));
}

export function resetState() {
  characterState.set(initialState);
}

export function setFiltersWritable(newFilters: Partial<Filters>) {
  filters.update(current => ({ ...current, ...newFilters }));
}

export function setPaginationWritable(newPagination: Partial<Pagination>) {
  pagination.update(current => ({ ...current, ...newPagination }));
}

// Efectos
let characterService: CharacterGraphqlService;

export function initializeCharacterService(service: CharacterGraphqlService) {
  characterService = service;
}

export function loadCharacters() {
  if (!characterService) {
    console.error('CharacterService not initialized');
    return;
  }

  const currentFilters = filters();
  const currentPagination = pagination();

  loading.set(true);

  characterService
    .getAllCharacters(
      currentPagination.currentPage,
      currentFilters.name,
      currentFilters.status,
      currentFilters.species,
      currentFilters.type,
      currentFilters.gender
    )
    .subscribe({
      next: (response) => {
        if (response?.info && response?.results) {
          characters.set(response.results);
          setPaginationWritable({
            totalItems: response.info.count,
            currentPage: currentPagination.currentPage,
            itemsPerPage: currentPagination.itemsPerPage
          });
        } else {
          console.error('Invalid response format:', response);
          characters.set([]);
        }
        loading.set(false);
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        characters.set([]);
        loading.set(false);
      }
    });
}
