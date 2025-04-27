import { InjectionToken } from '@angular/core';
import { CharacterDataSource } from './character-data-source.interface';

export const CHARACTER_DATA_SOURCE = new InjectionToken<CharacterDataSource>('CharacterDataSource');