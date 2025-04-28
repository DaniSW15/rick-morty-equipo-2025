import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  isMobileMenuOpen = signal(false);
  favoriteCount = signal(0);
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) {
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteCount.set(favorites.length);
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
