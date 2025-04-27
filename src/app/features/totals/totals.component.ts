import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import {
  favoritesCount
} from '../../state/signals/favorites.signal';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent {
  @Input() totalCharacters: number = 0;
  readonly totalFavorites = favoritesCount;

  // Valores por defecto para asegurar que siempre hay algo que mostrar
  getItemsPerPage(): number {
    return 20;
  }

  getTotalItems(): number {
    return this.totalCharacters;
  }

  getCurrentPage(): number {
    return 1;
  }

  getDisplayRange(): string {
    const itemsPerPage = this.getItemsPerPage();
    const currentPage = this.getCurrentPage();
    const totalItems = this.getTotalItems();

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return `${start} - ${end} de ${totalItems}`;
  }
}
