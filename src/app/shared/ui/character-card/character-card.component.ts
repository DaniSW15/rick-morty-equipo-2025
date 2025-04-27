import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { Character } from '../../../core/models/character.interface';
import { isFavorite } from '../../../state/signals/favorites.signal';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from "../../../core/pipes/translate.pipe";

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe
]
})
export class CharacterCardComponent {
  private characterSignal = signal<Character | null>(null);

  @Input() set character(value: Character) {
    this.characterSignal.set(value);
  }
  get character(): Character {
    return this.characterSignal()!;
  }

  isFavorite = computed(() => {
    const char = this.characterSignal();
    return char ? isFavorite(char.id) : false;
  });

  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<Event>();

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit();
  }

  onViewDetails(event: Event) {
    event.stopPropagation();
    this.viewDetails.emit(event);
  }

  getStatusInSpanish(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Alive': 'Vivo',
      'Dead': 'Muerto',
      'unknown': 'Desconocido'
    };
    return statusMap[status] || status;
  }

  getCharacterStats() {
    return [
      { label: 'Nombre', value: this.character.name },
      { label: 'Estado', value: this.getStatusInSpanish(this.character.status) },
      { label: 'Especie', value: this.character.species },
      { label: 'Tipo', value: this.character.type || 'N/A' },
      { label: 'Género', value: this.character.gender },
      { label: 'Creado', value: new Date(this.character.created).toLocaleDateString() }
    ];
  }
}
