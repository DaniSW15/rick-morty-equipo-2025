import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as CharacterActions from './character.actions';
import { CharacterGraphqlService } from '../../../core/services/api/character-graphql.service';
import { CharacterResponse } from '../../../core/services/api/character-data-source.interface';

@Injectable()
export class CharacterEffects {
  loadCharacters$;

  constructor(
    private readonly actions$: Actions,
    private readonly characterService: CharacterGraphqlService
  ) {
    this.loadCharacters$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CharacterActions.loadCharacters),
        mergeMap(({ page, name, status }) =>
          this.characterService.getAllCharacters(page, name, status).pipe(
            map((response: CharacterResponse) =>
              CharacterActions.loadCharactersSuccess({
                characters: response.results,
                info: response.info
              })
            ),
            catchError(error =>
              of(CharacterActions.loadCharactersFailure({
                error: error.message || 'Error loading characters'
              }))
            )
          )
        )
      )
    );
  }
}