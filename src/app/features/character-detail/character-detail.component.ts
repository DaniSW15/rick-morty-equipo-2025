import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { Character } from '../../core/models/character.interface';
import { LocationView, Location } from '../../core/models/location.interface';
import { Episode } from '../../core/models/episode.interface';
import { CharacterGraphqlService } from '../../core/services/api/character-graphql.service';
import { CharacterRestService } from '../../core/services/api/character-rest.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { MatExpansionModule } from '@angular/material/expansion';

interface CharacterDetailsView {
  origin: LocationView;
  location: LocationView;
  episode: Episode | null;
}

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ]
})
export class CharacterDetailComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private characterSubject = new BehaviorSubject<Character | undefined>(undefined);

  @Input() set character(value: Character | undefined) {
    if (value?.id !== this.characterSubject.value?.id) {
      this.characterSubject.next(value);
      this.cdr.detectChanges();
    }
  }
  get character(): Character | undefined {
    return this.characterSubject.value;
  }

  @Input() isDrawer = false;
  @Output() close = new EventEmitter<void>();

  isLoading = false;
  error: string | null = null;
  useGraphQL = false;

  characterDetails$: Observable<CharacterDetailsView | null> = this.characterSubject.pipe(
    switchMap((character: Character | undefined) => {
      if (!character) return of(null);
      this.isLoading = true;
      this.error = null;
      this.cdr.detectChanges();

      return (this.useGraphQL ? this.graphqlService.getCharacterById(character.id) : this.restService.getCharacterById(character.id))
        .pipe(
          map((details: Character) => {
            const originView: LocationView = {
              id: details.origin.id,
              name: details.origin.name,
              type: details.origin.type,
              dimension: details.origin.dimension,
              url: details.origin.url,
              created: details.origin.created,
              residents: details.origin.residents?.map((r:any) => ({
                id: r.id,
                name: r.name
              })),
              totalResidents: details.origin.residents?.length || 0
            };

            const locationView: LocationView = {
              id: details.location.id,
              name: details.location.name,
              type: details.location.type,
              dimension: details.location.dimension,
              url: details.location.url,
              created: details.location.created,
              residents: details.location.residents?.map((r: any) => ({
                id: r.id,
                name: r.name
              })),
              totalResidents: details.location.residents?.length || 0
            };

            return {
              origin: originView,
              location: locationView,
              episode: Array.isArray(details.episode) && details.episode.length > 0
                ? details.episode[0] as Episode
                : null
            };
          }),
          tap(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }),
          catchError(error => {
            console.error('Error loading details:', error);
            this.error = 'Error al cargar los detalles del personaje';
            this.isLoading = false;
            this.cdr.detectChanges();
            return of(null);
          })
        );
    }),
    takeUntil(this.destroy$)
  );

  constructor(
    private graphqlService: CharacterGraphqlService,
    private restService: CharacterRestService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }

  toggleFavorite(id: number): void {
    if (this.isFavorite(id)) {
      this.favoritesService.removeFavorite(id);
    } else {
      this.favoritesService.addFavorite(id);
    }
    this.cdr.detectChanges();
  }

  reloadDetails(): void {
    const currentCharacter = this.characterSubject.value;
    if (currentCharacter) {
      this.characterSubject.next(currentCharacter);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
