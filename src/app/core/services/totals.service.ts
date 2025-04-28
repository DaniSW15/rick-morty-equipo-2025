import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CharacterTotals } from '../models/character.totals.interface';


@Injectable({
  providedIn: 'root'
})
export class TotalsService {
  private totalsSubject = new BehaviorSubject<CharacterTotals>({
    total: 0,
    alive: 0,
    dead: 0,
    unknown: 0
  });

  totals$ = this.totalsSubject.asObservable();

  updateTotals(characters: any[]): void {
    const totals = characters.reduce((acc, char) => {
      acc.total++;
      switch (char.status.toLowerCase()) {
        case 'alive':
          acc.alive++;
          break;
        case 'dead':
          acc.dead++;
          break;
        default:
          acc.unknown++;
      }
      return acc;
    }, {
      total: 0,
      alive: 0,
      dead: 0,
      unknown: 0
    });

    this.totalsSubject.next(totals);
  }

  getTotals(): CharacterTotals {
    return this.totalsSubject.value;
  }
}