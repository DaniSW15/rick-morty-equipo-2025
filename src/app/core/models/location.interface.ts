import { Character } from "./character.interface";

// Interfaz base con los campos comunes
interface BaseLocation {
  id: number;
  name: string;
  type: string;
  dimension: string;
  url: string;
  created: string;
}

// Location como viene de la API
export interface Location extends BaseLocation {
  residents: string[];  // URLs de los residentes
}

// Location con los residentes cargados
export interface LocationWithResidents extends BaseLocation {
  residents: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  totalResidents: number;
}

export interface LocationResponse {
  location: Location;
}

// Para uso en la vista de detalles
export interface LocationView extends BaseLocation {
  residents?: Array<{
    id: number;
    name: string;
  }>;
  totalResidents?: number;
}
