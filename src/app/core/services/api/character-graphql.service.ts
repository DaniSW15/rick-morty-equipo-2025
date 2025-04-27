import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Character } from '../../../core/models/character.interface';
import { CharacterResponse, CharacterResult, FilterCharacter } from '../../../core/models/character.response.interface';
import { Location } from '../../../core/models/location.interface';
import { Episode } from '../../../core/models/episode.interface';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        origin {
          name
        }
        location {
          name
        }
        image
        episode {
          episode
        }
        created
      }
    }
  }
`;

const GET_LOCATION = gql`
  query GetLocation($id: ID!) {
    location(id: $id) {
      id
      name
      type
      dimension
      residents {
        id
        name
        image
      }
      created
    }
  }
`;

const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      id
      name
      air_date
      episode
      characters {
        id
        name
        image
      }
    }
  }
`;

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin {
        id
        name
        type
        dimension
      }
      location {
        id
        name
        type
        dimension
      }
      image
      episode {
        id
        name
        air_date
        episode
      }
      created
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class CharacterGraphqlService {
  constructor(private apollo: Apollo) { }

  getAllCharacters(
    page: number = 1,
    name: string = '',
    status: string = '',
    species: string = '',
    type: string = '',
    gender: string = ''
  ): Observable<CharacterResult> {
    const filter: FilterCharacter = {};

    if (name) filter.name = name;
    if (status) filter.status = status;
    if (species) filter.species = species;
    if (type) filter.type = type;
    if (gender) filter.gender = gender;

    return this.apollo
      .watchQuery<CharacterResponse>({
        query: GET_CHARACTERS,
        variables: {
          page,
          filter: Object.keys(filter).length > 0 ? filter : undefined
        }
      })
      .valueChanges.pipe(
        map(({ data }) => ({
          info: data.characters.info,
          results: data.characters.results
        }))
      );
  }

  getLocation(id: string): Observable<Location> {
    return this.apollo
      .watchQuery<{ location: Location }>({
        query: GET_LOCATION,
        variables: { id }
      })
      .valueChanges.pipe(
        map(({ data }) => data.location)
      );
  }

  getEpisode(id: string | number): Observable<Episode> {
    return this.apollo
      .watchQuery<{ episode: Episode }>({
        query: GET_EPISODE,
        variables: { id },
        errorPolicy: 'all'
      })
      .valueChanges
      .pipe(
        map(result => {
          if (result.error) {
            throw result.error;
          }
          if (!result.data || !result.data.episode) {
            throw new Error('Episodio no encontrado');
          }
          return result.data.episode;
        })
      );
  }

  getCharacterById(id: string | number): Observable<Character> {
    console.log('Service - Requesting character with ID:', id); // Debug
    return this.apollo
      .watchQuery<{ character: Character }>({
        query: GET_CHARACTER,
        variables: { id },
        errorPolicy: 'all',
        fetchPolicy: 'network-only' // Forzar petición al servidor
      })
      .valueChanges
      .pipe(
        map(result => {
          console.log('Service - GraphQL response:', result); // Debug
          if (result.error) {
            console.error('Service - GraphQL error:', result.error); // Debug
            throw result.error;
          }
          if (!result.data || !result.data.character) {
            console.error('Service - No character data received'); // Debug
            throw new Error('Personaje no encontrado');
          }
          return result.data.character;
        })
      );
  }
}
