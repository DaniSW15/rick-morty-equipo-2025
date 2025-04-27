export interface CharacterInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

interface Location {
  name: string;
  residents: {
    id: string;
    name: string;
  }[];
}

interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

export interface CharacterData {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Location;
  location: Location;
  image: string;
  episode: Episode[];
  created: string;
}

export interface CharactersResponse {
  characters: {
    info: CharacterInfo;
    results: CharacterData[];
  };
}

export interface CharacterResponse {
  character: CharacterData;
}
