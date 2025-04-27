import { createReducer, on } from '@ngrx/store';
import * as CharacterActions from './character.actions';
import { CharacterState, initialState } from './character.state';

export const characterReducer = createReducer(
  initialState,

  on(CharacterActions.loadCharacters, (state, { page, name, status }) => ({
    ...state,
    loading: true,
    error: null,
    filters: {
      ...state.filters,
      name,
      status
    }
  })),

  on(CharacterActions.loadCharactersSuccess, (state, { characters, info }) => ({
    ...state,
    loading: false,
    error: null,
    characters,
    pagination: {
      currentPage: info.next ? info.next - 1 : info.pages,
      totalItems: info.count,
      totalPages: info.pages,
      nextPage: info.next,
      prevPage: info.prev
    }
  })),

  on(CharacterActions.loadCharactersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    characters: [],
    pagination: {
      currentPage: 1,
      totalItems: 0,
      totalPages: 0,
      nextPage: null,
      prevPage: null
    }
  }))
);