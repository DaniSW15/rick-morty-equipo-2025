import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterRestService } from '../../core/services/api/character-rest.service';
import { Character } from '../../core/models/character.interface';
import { LoadingComponent } from '../../shared/ui/loading/loading.component';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    LoadingComponent
  ],
  templateUrl: './character-edit.component.html',
  styleUrls: ['./character-edit.component.css']
})
export class CharacterEditComponent implements OnInit {
  character?: Character;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private characterService: CharacterRestService
  ) {}

  ngOnInit(): void {
    this.loadCharacter();
  }

  private loadCharacter(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'ID de personaje no válido';
      this.loading = false;
      return;
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      this.error = 'ID de personaje debe ser un número';
      this.loading = false;
      return;
    }

    this.characterService.getCharacterById(numericId).subscribe({
      next: (character) => {
        this.character = character;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading character:', error);
        this.error = 'Error al cargar el personaje';
        this.loading = false;
      }
    });
  }

  onSave(): void {
    // Implementar lógica de guardado
    console.log('Guardando personaje:', this.character);
  }

  onCancel(): void {
    this.router.navigate(['/characters']);
  }
}
