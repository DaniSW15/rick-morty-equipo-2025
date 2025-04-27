import { Injectable } from '@angular/core';

interface CharacterNotes {
  [characterId: number]: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterNotesService {
  private readonly STORAGE_KEY = 'character_notes';

  getNotes(characterId: number): string {
    const notes = this.getAllNotes();
    return notes[characterId] || '';
  }

  saveNotes(characterId: number, notes: string): void {
    const allNotes = this.getAllNotes();
    allNotes[characterId] = notes;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allNotes));
  }

  private getAllNotes(): CharacterNotes {
    const notes = localStorage.getItem(this.STORAGE_KEY);
    return notes ? JSON.parse(notes) : {};
  }
}