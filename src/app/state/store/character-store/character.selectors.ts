import { createSelector } from '@ngrx/store';
import { CharacterState } from './character.state';

export const selectCharacterState = (state: { character: CharacterState }) => state.character;

export const selectAllCharacters = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.characters
);

export const selectLoading = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.loading
);

export const selectError = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.error
);

export const selectPagination = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.pagination
);

export const selectFilters = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.filters
);

export const selectSelectedCharacter = createSelector(
  selectCharacterState,
  (state: CharacterState) => state.selectedCharacter
);
