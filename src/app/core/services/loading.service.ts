import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = signal<boolean>(false);

  getLoading() {
    return this.loading;
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }
}