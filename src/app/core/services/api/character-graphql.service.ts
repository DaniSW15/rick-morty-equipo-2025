import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { Character } from '../../../core/models/character.interface';
import { Location } from '../../../core/models/location.interface';
import { Episode } from '../../../core/models/episode.interface';
import { CharacterDataSource, CharacterResponse } from './character-data-source.interface';
import { GET_CHARACTER, GET_CHARACTERS, GET_EPISODE, GET_LOCATION } from '../../graphql/queries/character.queries';


@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService implements CharacterDataSource {
  private characterCache = new Map<any, Observable<Character>>();

  constructor(private apollo: Apollo) { }

  getAllCharacters(
    page: any = 1,
    name?: any,
    status?: any,
    species?: any,
    type?: any,
    gender?: any
  ): Observable<CharacterResponse> {
    const filter: any = {};
    if (name) filter.name = name;
    if (status) filter.status = status;
    if (species) filter.species = species;
    if (type) filter.type = type;
    if (gender) filter.gender = gender;

    return this.apollo.watchQuery<any>({
      query: GET_CHARACTERS,
      variables: {
        page,
        filter: Object.keys(filter).length > 0 ? filter : undefined
      }
    }).valueChanges.pipe(
      map(({ data }) => data.characters),
      shareReplay(1)
    );
  }

  getCharacterById(id: any): Observable<Character> {
    if (!this.characterCache.has(id)) {
      const character$ = this.apollo.watchQuery<any>({
        query: GET_CHARACTER,
        variables: { id }
      }).valueChanges.pipe(
        map(({ data }) => data.character),
        shareReplay(1)
      );
      this.characterCache.set(id, character$);
    }
    return this.characterCache.get(id)!;
  }

  private getLocationDetails(url: any): Observable<Location & { residents: Character[] }> {
    const id = this.extractIdFromUrl(url);
    return this.apollo.watchQuery<any>({
      query: GET_LOCATION,
      variables: { id }
    }).valueChanges.pipe(
      map(({ data }) => data.location),
      map(location => ({
        ...location,
        residents: location.residents.slice(0, 1).map((url: any) => this.getCharacterById(this.extractIdFromUrl(url)))
      })),
      shareReplay(1)
    );
  }

  private getEpisodeDetails(url: any): Observable<Episode> {
    const id = this.extractIdFromUrl(url);
    return this.apollo.watchQuery<any>({
      query: GET_EPISODE,
      variables: { id }
    }).valueChanges.pipe(
      map(({ data }) => data.episode),
      shareReplay(1)
    );
  }

  loadCharacterComplete(character: Character): Observable<{
    origin: (Location & { residents: Character[] }) | null;
    location: (Location & { residents: Character[] }) | null;
    episode: Episode | null;
  }> {
    return forkJoin({
      origin: character.origin?.url ? this.getLocationDetails(character.origin.url) : of(null),
      location: character.location?.url ? this.getLocationDetails(character.location.url) : of(null),
      episode: character.episode?.[0] ? this.getEpisodeDetails(character.episode[0]) : of(null)
    }).pipe(
      shareReplay(1)
    );
  }

  private extractIdFromUrl(url: any): any {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
