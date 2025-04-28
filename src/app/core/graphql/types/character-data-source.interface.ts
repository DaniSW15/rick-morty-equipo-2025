import { Observable } from 'rxjs';
import { Character } from '../../models/character.interface';

export interface CharacterInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharacterResponse {
  results: Character[];
  info: CharacterInfo;
}

export interface CharacterDataSource {
  getAllCharacters(
    page?: number,
    name?: string,
    status?: string,
    species?: string,
    pageSize?: number
  ): Observable<CharacterResponse>;
  getCharacterById(id: number): Observable<Character>;
}
