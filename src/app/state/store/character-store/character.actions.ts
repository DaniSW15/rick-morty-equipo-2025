import { createAction, props } from '@ngrx/store';
import { Character } from '../../../core/models/character.interface';
import { CharacterInfo } from '../../../core/services/api/character-data-source.interface';

export const loadCharacters = createAction(
  '[Character] Load Characters',
  props<{ page?: number; name?: string; status?: string }>()
);

export const loadCharactersSuccess = createAction(
  '[Character] Load Characters Success',
  props<{ characters: Character[]; info: CharacterInfo }>()
);

export const loadCharactersFailure = createAction(
  '[Character] Load Characters Failure',
  props<{ error: string }>()
);

export const selectCharacter = createAction(
  '[Character] Select Character',
  props<{ character: Character }>()
);

export const setLoading = createAction(
  '[Character] Set Loading',
  props<{ loading: boolean }>()
);