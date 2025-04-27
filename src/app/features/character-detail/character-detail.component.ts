import { Component, Input, Output, EventEmitter, OnInit, WritableSignal, signal, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Character } from '../../core/models/character.interface';
import { Location } from '../../core/models/location.interface';
import { Episode } from '../../core/models/episode.interface';
import { TranslatePipe } from "../../core/pipes/translate.pipe";
import { EmptyValuePipe } from "../../core/pipes/empty-value.pipe";
import { CharacterGraphqlService } from '../../core/services/api/character-graphql.service';
import { LoadingComponent } from "../../shared/ui/loading/loading.component";
import { FavoritesService } from '../../core/services/favorites.service';
import { of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    EmptyValuePipe,
    LoadingComponent
  ],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent implements OnInit {
  @Input() character?: Character;
  @Input() isDrawer = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<Character>();

  @HostBinding('class')
  get hostClass(): string {
    return this.isDrawer ? 'drawer' : 'standalone';
  }

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  originLocation: WritableSignal<Location> = signal(this.createEmptyLocation('origen'));
  currentLocation: WritableSignal<Location> = signal(this.createEmptyLocation('actual'));
  firstEpisode: WritableSignal<Episode | null> = signal(null);

  constructor(
    private characterService: CharacterGraphqlService,
    private favoriteService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loading.set(true);
        this.characterService.getCharacterById(id)
          .pipe(
            catchError((err) => {
              console.error('Error loading character:', err);
              return of({
                id: 0,
                name: 'Personaje no encontrado',
                status: 'unknown',
                species: 'Unknown',
                type: '',
                gender: 'unknown',
                origin: { name: 'Unknown', url: '' },
                location: { name: 'Unknown', url: '' },
                image: 'assets/images/placeholder.png',
                episode: [],
                url: '',
                created: new Date().toISOString()
              } as Character);
            }),
            finalize(() => this.loading.set(false))
          )
          .subscribe(character => {
            this.character = character;
            this.loadOriginLocation();
            this.loadCurrentLocation();
            this.loadFirstEpisode();
          });
      }
    });
  }

  private loadCharacterDetails(): void {
    if (!this.character) {
      this.error.set('No se encontró información del personaje');
      return;
    }

    try {
      this.loadOriginLocation();
      this.loadCurrentLocation();
      this.loadFirstEpisode();
    } catch (err) {
      console.error('Error initializing character detail:', err);
      this.error.set('Error cargando los detalles del personaje');
      this.loading.set(false);
    }
  }

  private loadOriginLocation(): void {
    const originUrl = this.character?.origin?.url;
    const originId = originUrl ? this.extractIdFromUrl(originUrl) : null;

    if (originId) {
      this.characterService.getLocation(originId)
        .pipe(
          catchError((err) => {
            console.error('Error loading origin location:', err);
            return of(this.createEmptyLocation('origen'));
          })
        )
        .subscribe(location => this.originLocation.set(location));
    } else {
      this.originLocation.set(this.createEmptyLocation('origen'));
    }
  }

  private loadCurrentLocation(): void {
    const locationUrl:any = this.character?.location?.url;
    const locationId:any = locationUrl ? this.extractIdFromUrl(locationUrl) : null;

    if (locationId) {
      this.characterService.getLocation(locationId)
        .pipe(
          catchError((err) => {
            console.error('Error loading current location:', err);
            return of(this.createEmptyLocation('actual'));
          })
        )
        .subscribe(location => this.currentLocation.set(location));
    } else {
      this.currentLocation.set(this.createEmptyLocation('actual'));
    }
  }

  private loadFirstEpisode(): void {
    if (this.character?.episode?.length) {
      const firstEpisode = this.character.episode[0];
      const episodeId = typeof firstEpisode === 'string'
        ? this.extractIdFromUrl(firstEpisode)
        : firstEpisode.id;

      if (episodeId) {
        this.characterService.getEpisode(episodeId)
          .pipe(
            catchError((err) => {
              console.error('Error loading episode:', err);
              return of(this.createEmptyEpisode());
            })
          )
          .subscribe(episode => this.firstEpisode.set(episode));
      } else {
        this.firstEpisode.set(this.createEmptyEpisode());
      }
    } else {
      this.firstEpisode.set(this.createEmptyEpisode());
    }
  }

  private extractIdFromUrl(url: string | undefined): string | null {
    if (!url) return null;
    const matches = url.match(/\/(\d+)$/);
    return matches ? matches[1] : null;
  }

  private createEmptyLocation(type: 'origen' | 'actual'): Location {
    return {
      id: 0,
      name: `Ubicación ${type} desconocida`,
      type: 'Unknown',
      dimension: 'Unknown',
      residents: [],
      url: '',
      created: new Date().toISOString()
    };
  }

  private createEmptyEpisode(): Episode {
    return {
      id: 0,
      name: 'Episodio desconocido',
      air_date: 'Desconocida',
      episode: 'S00E00',
      characters: [{
        id: 0,
        name: 'Sin información',
        image: 'assets/images/placeholder.png'
      }],
      url: '',
      created: new Date().toISOString()
    };
  }

  isFavorite(): boolean {
    return this.character ? this.favoriteService.isFavorite(this.character.id) : false;
  }

  onToggleFavorite(): void {
    if (this.character) {
      this.toggleFavorite.emit(this.character);
    }
  }

  closeDialog(): void {
    if (this.close.observed) {
      this.close.emit();
    } else {
      this.router.navigate(['/characters']);
    }
  }
}
