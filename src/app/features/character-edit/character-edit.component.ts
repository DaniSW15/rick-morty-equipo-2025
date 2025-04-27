import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../core/models/character.interface';
import { CharacterGraphqlService } from '../../core/services/api/character-graphql.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { LoadingComponent } from "../../shared/ui/loading/loading.component";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    TranslatePipe,
    LoadingComponent
  ],
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.css']
})
export class CharacterEditComponent implements OnInit, OnDestroy {
  character?: Character;
  isFavorite = false;
  loading = false;
  error: string | null = null;
  private favoritesSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterGraphqlService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID recibido:', id); // Debug
      if (id && id !== 'undefined') {
        this.loadCharacter(id);
      } else {
        this.error = 'ID de personaje no válido';
        this.router.navigate(['/characters']);
      }
    });

    // Suscribirse a cambios en favoritos
    this.favoritesSub = this.favoritesService.favorites$.subscribe(() => {
      if (this.character) {
        this.isFavorite = this.favoritesService.isFavorite(this.character.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.favoritesSub?.unsubscribe();
  }

  private loadCharacter(id: string): void {
    console.log('Cargando personaje con ID:', id); // Debug
    this.loading = true;
    this.error = null;

    if (!/^\d+$/.test(id)) {
      console.log('ID no válido:', id); // Debug
      this.error = 'ID de personaje no válido';
      this.loading = false;
      this.router.navigate(['/characters']);
      return;
    }

    this.characterService.getCharacterById(id)
      .subscribe({
        next: (character) => {
          console.log('Personaje recibido:', character); // Debug
          if (!character) {
            this.error = 'Personaje no encontrado';
            this.loading = false;
            this.router.navigate(['/characters']);
            return;
          }
          this.character = character;
          this.isFavorite = this.favoritesService.isFavorite(character.id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error completo:', err); // Debug detallado
          this.error = err.message === 'Personaje no encontrado'
            ? 'Personaje no encontrado'
            : 'Error al cargar el personaje. Por favor, inténtalo de nuevo.';
          this.loading = false;
          this.router.navigate(['/characters']);
        }
      });
  }

  toggleFavorite(): void {
    if (this.character) {
      this.favoritesService.toggleFavorite(this.character);
      this.isFavorite = this.favoritesService.isFavorite(this.character.id);
    }
  }
}
