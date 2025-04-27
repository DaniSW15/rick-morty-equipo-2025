import { Pipe, PipeTransform } from '@angular/core';

type TranslationType = 'status' | 'species' | 'gender' | 'type';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  private readonly translations = {
    status: {
      'Alive': 'Vivo',
      'Dead': 'Muerto',
      'unknown': 'Desconocido'
    },
    species: {
      'Human': 'Humano',
      'Humanoid': 'Humanoide',
      'Alien': 'Alienígena',
      'Robot': 'Robot',
      'Animal': 'Animal',
      'unknown': 'Desconocido'
    },
    gender: {
      'Male': 'Masculino',
      'Female': 'Femenino',
      'Genderless': 'Sin género',
      'unknown': 'Desconocido'
    }
  };

  transform(value: string, type: TranslationType): string {
    if (!value) return 'N/A';
    if (type === 'type') return value || 'N/A';

    const translations:any = this.translations[type];
    return translations[value] || value;
  }
}