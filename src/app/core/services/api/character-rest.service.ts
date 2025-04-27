import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../../models/character.interface';
import { Episode } from '../../models/episode.interface';
import { Location } from '../../models/location.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterRestService {
  private baseUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, filter?: any): Observable<any> {
    let url = `${this.baseUrl}/character/?page=${page}`;
    if (filter) {
      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          url += `&${key}=${filter[key]}`;
        }
      });
    }
    return this.http.get<any>(url);
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/location/${id}`);
  }

  getEpisode(id: number): Observable<Episode> {
    return this.http.get<Episode>(`${this.baseUrl}/episode/${id}`);
  }

  searchCharacters(name?: string, species?: string, status?: string): Observable<any> {
    let url = `${this.baseUrl}/character/?`;
    if (name) url += `name=${name}&`;
    if (species) url += `species=${species}&`;
    if (status) url += `status=${status}`;
    return this.http.get<any>(url);
  }
}
