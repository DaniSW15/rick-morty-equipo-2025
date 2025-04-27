import { Character } from "./character.interface";
import { RestApiInfo } from "./rest.api.info.interface";

export interface RestApiResponse {
  info: RestApiInfo;
  results: Character[];
}