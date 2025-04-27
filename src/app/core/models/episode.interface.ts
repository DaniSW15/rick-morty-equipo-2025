export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters?: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  url: string;
  created: string;
}
