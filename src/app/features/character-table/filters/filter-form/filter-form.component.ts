import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.css']
})
export class FilterFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  filterForm: FormGroup;

  @Input() set filters(value: any) {
    if (value && this.filterForm) {
      this.filterForm.patchValue(value, { emitEvent: false });
    }
  }

  @Output() nameChange = new EventEmitter<string>();
  @Output() speciesChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();
  @Output() genderChange = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      species: [''],
      status: [''],
      gender: ['']
    });

    // Inicializar el formulario con los filtros actuales
    this.filterForm.patchValue(this.filters);

    // Nombre con debounce
    this.filterForm.get('name')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.nameChange.emit(value));

    // Especie con debounce
    this.filterForm.get('species')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.speciesChange.emit(value));

    // Estado
    this.filterForm.get('status')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.statusChange.emit(value));

    // Género
    this.filterForm.get('gender')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.genderChange.emit(value));
  }

  onClearFilters(): void {
    this.filterForm.reset({
      name: '',
      species: '',
      status: '',
      gender: ''
    });
    this.nameChange.emit('');
    this.speciesChange.emit('');
    this.statusChange.emit('');
    this.genderChange.emit('');
    this.clearFilters.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
