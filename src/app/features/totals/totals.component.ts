import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Character } from '../../core/models/character.interface';

interface TotalItem {
  name: string;
  count: number;
}

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.css']
})
export class TotalsComponent implements OnInit, OnChanges {
  @Input() characters: Character[] = [];
  @Input() type: 'species' | 'type' = 'species';

  totals: TotalItem[] = [];

  ngOnInit(): void {
    this.calculateTotals();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['characters'] || changes['type']) {
      this.calculateTotals();
    }
  }

  private calculateTotals(): void {
    if (!this.characters.length) {
      this.totals = [];
      return;
    }

    const counts = this.characters.reduce((acc, char) => {
      const value = this.type === 'species' ? char.species : (char.type || 'Unknown');
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    this.totals = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
}
