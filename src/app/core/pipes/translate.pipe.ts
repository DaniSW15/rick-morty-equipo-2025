import { Pipe, PipeTransform } from '@angular/core';

interface TranslationMap {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: TranslationMap = {
  status: {
    'Alive': 'Vivo',
    'Dead': 'Muerto',
    'unknown': 'Desconocido'
  },
  gender: {
    'Male': 'Masculino',
    'Female': 'Femenino',
    'Genderless': 'Sin género',
    'unknown': 'Desconocido'
  },
  species: {
    'Human': 'Humano',
    'Alien': 'Alienígena',
    'Humanoid': 'Humanoide',
    'Robot': 'Robot',
    'Animal': 'Animal',
    'Disease': 'Enfermedad',
    'Poopybutthole': 'Poopybutthole',
    'Mythological Creature': 'Criatura Mitológica',
    'unknown': 'Desconocido'
  }
};

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  transform(value: string, category: string): string {
    if (!value || !category) {
      return value;
    }

    const categoryTranslations = translations[category.toLowerCase()];
    if (!categoryTranslations) {
      return value;
    }

    return categoryTranslations[value] || value;
  }
}
