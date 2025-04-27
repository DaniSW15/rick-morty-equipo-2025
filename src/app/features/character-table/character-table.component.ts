import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { Character } from '../../core/models/character.interface';
import { CharacterGraphqlService } from '../../core/services/api/character-graphql.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { FilterFormComponent } from './filters/filter-form/filter-form.component';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';
import { CharacterCardComponent } from '../../shared/ui/character-card/character-card.component';
import { CharacterDetailComponent } from '../character-detail/character-detail.component';
import { TotalsComponent } from '../totals/totals.component';

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
    RouterModule,
    TranslatePipe,
    FilterFormComponent,
    LoadingComponent,
    CharacterCardComponent,
    TotalsComponent,
    CharacterDetailComponent
  ],
  templateUrl: './character-table.component.html',
  styleUrls: ['./character-table.component.css']
})
export class CharacterTableComponent implements OnInit {
  characters = signal<Character[]>([]);
  loading = signal(false);
  selectedCharacter = signal<Character | undefined>(undefined);
  isGridView = signal<boolean>(false);
  isDrawerMouseOver = signal(false);
  displayedColumns = ['image', 'name', 'status', 'species', 'type', 'gender', 'created', 'actions'];
  pagination = signal({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0
  });
  filters = signal({
    name: '',
    species: '',
    status: '',
    gender: ''
  });

  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private characterService: CharacterGraphqlService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(page: number = 1): void {
    this.loading.set(true);
    const filter = {
      name: this.filters().name,
      species: this.filters().species,
      status: this.filters().status,
      gender: this.filters().gender
    };

    this.characterService.getAllCharacters(
      page,
      filter.name,
      filter.status,
      filter.species,
      '',
      filter.gender
    ).subscribe({
      next: (response) => {
        this.characters.set(response.results);
        this.pagination.set({
          ...this.pagination(),
          currentPage: page,
          totalItems: response.info.count,
          totalPages: response.info.pages
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.characters.set([]);
        this.pagination.set({
          ...this.pagination(),
          totalItems: 0,
          totalPages: 0
        });
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    const newPage = event.pageIndex + 1;
    this.pagination.set({
      ...this.pagination(),
      currentPage: newPage,
      itemsPerPage: event.pageSize
    });
    this.loadCharacters(newPage);
  }

  toggleFavoriteCharacter(character: Character): void {
    this.favoritesService.toggleFavorite(character);
  }

  isFavoriteCharacter(id: any): boolean {
    return this.favoritesService.isFavorite(id);
  }

  toggleView(): void {
    this.isGridView.update(current => !current);
  }

  getDataSource(): Character[] {
    return this.characters();
  }

  onFilterChange(filterType: string, value: string): void {
    this.filters.set({
      ...this.filters(),
      [filterType]: value
    });
    this.loadCharacters(1); // Reset to first page when filter changes
  }

  clearFilters(): void {
    this.filters.set({
      name: '',
      species: '',
      status: '',
      gender: ''
    });
    this.loadCharacters(1);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  selectCharacter(character: Character): void {
    if (!character) return;
    this.selectedCharacter.set(character);
    this.drawer.open();
  }

  closeCharacterDetail(): void {
    this.drawer.close();
    this.selectedCharacter.set(undefined);
  }

  onDrawerMouseEnter(): void {
    this.isDrawerMouseOver.set(true);
  }

  onDrawerMouseLeave(): void {
    this.isDrawerMouseOver.set(false);
  }
}
