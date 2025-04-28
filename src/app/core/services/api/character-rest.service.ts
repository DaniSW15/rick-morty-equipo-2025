import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, shareReplay, switchMap } from 'rxjs/operators';
import { Character } from '../../models/character.interface';
import { Location, LocationWithResidents } from '../../models/location.interface';
import { Episode } from '../../models/episode.interface';
import { CharacterDataSource, CharacterResponse } from './character-data-source.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterRestService implements CharacterDataSource {
  private readonly API_URL = 'https://rickandmortyapi.com/api';
  private characterCache = new Map<number, Observable<Character>>();
  private locationCache = new Map<string, Observable<LocationWithResidents>>();
  private episodeCache = new Map<string, Observable<Episode>>();

  constructor(private http: HttpClient) {}

  getAllCharacters(
    page?: number,
    name?: string,
    status?: string,
    pageSize: number = 20
  ): Observable<CharacterResponse> {
    const queryParams = new URLSearchParams();

    // Asegurarse de que la página sea válida
    if (page !== undefined) {
      queryParams.append('page', Math.max(1, page).toString());
    }

    // Agregar otros parámetros si están presentes
    if (name) queryParams.append('name', name);
    if (status) queryParams.append('status', status);

    return this.http.get<CharacterResponse>(`${this.API_URL}/character?${queryParams.toString()}`).pipe(
      map(response => ({
        ...response,
        results: response.results.slice(0, pageSize)
      })),
      shareReplay(1)
    );
  }

  getCharacterById(id: number): Observable<Character> {
    return this.loadCharacterComplete(id);
  }

  private loadCharacterComplete(id: number): Observable<Character> {
    if (!this.characterCache.has(id)) {
      const details$:any = this.http.get<Character>(`${this.API_URL}/character/${id}`).pipe(
        switchMap(character => {
          const locationUrl = character.location?.url;
          const originUrl = character.origin?.url;
          const episodeUrls:any = character.episode;

          // Cargar ubicación actual
          const location$ = locationUrl ? this.getLocationWithResidents(locationUrl) : of(null);
          // Cargar origen
          const origin$ = originUrl ? this.getLocationWithResidents(originUrl) : of(null);
          // Cargar primer episodio
          const episode$ = episodeUrls?.length ?
            this.getEpisodeByUrl(episodeUrls[0]) : of(null);

          return forkJoin({
            location: location$,
            origin: origin$,
            episode: episode$
          }).pipe(
            map(details => ({
              ...character,
              location: details.location || character.location,
              origin: details.origin || character.origin,
              episode: details.episode ? [details.episode] : []
            }))
          );
        }),
        shareReplay(1)
      );
      this.characterCache.set(id, details$);
    }
    return this.characterCache.get(id)!;
  }

  private getLocationWithResidents(url: string): Observable<LocationWithResidents> {
    if (!this.locationCache.has(url)) {
      const location$ = this.http.get<Location>(url).pipe(
        switchMap(location => {
          // Extraer los IDs de los residentes de las URLs
          const residentIds = location.residents.map(url => {
            const matches = url.match(/\/(\d+)$/);
            return matches ? parseInt(matches[1]) : null;
          }).filter((id): id is number => id !== null);

          // Cargar los primeros 5 residentes
          const residentRequests = residentIds
            .slice(0, 5)
            .map(id => this.http.get<Character>(`${this.API_URL}/character/${id}`));

          return forkJoin(residentRequests).pipe(
            map(residents => ({
              ...location,
              residents: residents.map(r => ({
                id: r.id,
                name: r.name,
                image: r.image
              })),
              totalResidents: residentIds.length
            })),
            catchError(() => of({
              ...location,
              residents: [],
              totalResidents: 0
            }))
          );
        }),
        shareReplay(1)
      );
      this.locationCache.set(url, location$);
    }
    return this.locationCache.get(url)!;
  }

  private getEpisodeByUrl(url: string): Observable<Episode> {
    if (!this.episodeCache.has(url)) {
      const episode$ = this.http.get<Episode>(url).pipe(shareReplay(1));
      this.episodeCache.set(url, episode$);
    }
    return this.episodeCache.get(url)!;
  }

  getCharactersByIds(ids: number[]): Observable<Character[]> {
    if (!ids.length) return of([]);
    return forkJoin(ids.map(id => this.getCharacterById(id)));
  }
}
