import { Character } from './character.interface';

export interface FilterCharacter {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
}

export interface CharacterInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharacterResult {
  info: CharacterInfo;
  results: Character[];
}

export interface CharacterResponse {
  characters: CharacterResult;
}
