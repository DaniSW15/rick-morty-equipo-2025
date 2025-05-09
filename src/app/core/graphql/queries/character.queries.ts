import { gql } from 'apollo-angular';

export const GET_CHARACTERS = gql`
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
        created
        origin {
          name
          residents {
            id
            name
          }
        }
        location {
          name
          residents {
            id
            name
          }
        }
        image
        episode {
          id
          name
          air_date
          episode
        }
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      created
      origin {
        name
        residents {
          id
          name
        }
      }
      location {
        name
        residents {
          id
          name
        }
      }
      image
      episode {
        id
        name
        air_date
        episode
      }
    }
  }
`;

export const GET_LOCATION = gql`
  query GetLocation($id: ID!) {
    location(id: $id) {
      id
      name
      type
      dimension
      residents
      created
    }
  }
`;

export const GET_EPISODE = gql`
  query GetEpisode($id: ID!) {
    episode(id: $id) {
      id
      name
      air_date
      episode
      characters
      created
    }
  }
`;