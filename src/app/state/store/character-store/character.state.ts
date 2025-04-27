import { Character } from '../../../core/models/character.interface';

export interface CharacterPagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface CharacterFilters {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface CharacterState {
  loading: boolean;
  error: string | null;
  characters: Character[];
  selectedCharacter: Character | null;
  pagination: CharacterPagination;
  filters: CharacterFilters;
}

export const initialState: CharacterState = {
  loading: false,
  error: null,
  characters: [],
  selectedCharacter: null,
  pagination: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null
  },
  filters: {
    name: undefined,
    status: undefined
  }
};
