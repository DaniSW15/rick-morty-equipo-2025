import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { Character } from '../../core/models/character.interface';
import { CharacterRestService } from '../../core/services/api/character-rest.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { FilterFormComponent } from './filters/filter-form/filter-form.component';
import { CharacterDetailComponent } from '../character-detail/character-detail.component';
import { TotalsComponent } from "../totals/totals.component";
import { lastValueFrom } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { EmptyValuePipe } from "../../core/pipes/empty-value.pipe";

@Component({
  selector: 'app-character-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatChipsModule,
    RouterModule,
    TranslatePipe,
    FilterFormComponent,
    CharacterDetailComponent,
    TotalsComponent,
    MatFormFieldModule,
    MatCardModule,
    EmptyValuePipe
],
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {
  // Signals para el estado
  characters = signal<Character[]>([]);
  selectedCharacter = signal<Character | undefined>(undefined);
  loading = signal<boolean>(false);
  favorites = signal<number[]>([]);
  currentPage = signal<number>(0);
  pageSize = signal<number>(5);
  totalItems = signal<number>(0);
  currentFilters = signal<any>({});

  constructor(
    private characterService: CharacterRestService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
    this.loadFavorites();
  }

  async loadCharacters(filters: any = {}): Promise<void> {
    try {
      this.loading.set(true);
      const response = await lastValueFrom(this.characterService.getAllCharacters(
        this.currentPage() + 1,
        filters.name,
        filters.status,
        filters.species,
        filters.gender,
        this.pageSize()
      ));

      this.characters.set(response.results);
      this.totalItems.set(response.info.count);
      this.currentFilters.set(filters);
      this.loading.set(false);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading characters:', error);
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }

  loadFavorites(): void {
    const favorites = this.favoritesService.getFavorites();
    this.favorites.set(favorites);
  }

  selectCharacter(character: Character): void {
    this.selectedCharacter.set(character);
  }

  selectFavoriteCharacter(id: number): void {
    const character = this.characters().find(c => c.id === id);
    if (character) {
      this.selectCharacter(character);
    }
  }

  getFavoriteCharacterName(id: number): string {
    const character = this.characters().find(c => c.id === id);
    return character?.name || `Character ${id}`;
  }

  toggleFavorite(character: Character): void {
    if (this.isFavorite(character.id)) {
      this.favoritesService.removeFavorite(character.id);
    } else {
      this.favoritesService.addFavorite(character.id);
    }
    this.loadFavorites();
  }

  isFavorite(id: number): boolean {
    return this.favorites().includes(id);
  }

  onFiltersChanged(filters: any): void {
    this.currentPage.set(0);
    this.loadCharacters(filters);
  }

  onClearFilters(): void {
    this.currentPage.set(0);
    this.loadCharacters();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadCharacters(this.currentFilters());
  }
}
