import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  private translations: { [key: string]: { [key: string]: string } } = {
    status: {
      'alive': 'Vivo',
      'dead': 'Muerto',
      'unknown': 'Desconocido'
    },
    gender: {
      'female': 'Femenino',
      'male': 'Masculino',
      'genderless': 'Sin género',
      'unknown': 'Desconocido'
    },
    species: {
      'human': 'Humano',
      'alien': 'Alienígena',
      'humanoid': 'Humanoide',
      'poopybutthole': 'Poopybutthole',
      'mythological': 'Mitológico',
      'unknown': 'Desconocido',
      'animal': 'Animal',
      'disease': 'Enfermedad',
      'robot': 'Robot',
      'cronenberg': 'Cronenberg',
      'planet': 'Planeta'
    }
  };

  transform(value: string | undefined | null, type: keyof typeof this.translations): string {
    if (!value) return 'Desconocido';

    const category = this.translations[type];
    const key = value.toLowerCase();
    return category[key] || value;
  }
}
