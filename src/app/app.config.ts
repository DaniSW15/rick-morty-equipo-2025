import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';
import { CharacterGraphqlService } from './core/services/api/character-graphql.service';
import { initializeCharacterService } from './state/signals/character.signal';
import { loadFavoritesFromStorage } from './state/signals/favorites.signal';
import { CHARACTER_DATA_SOURCE } from './core/services/api/character-data-source.token';
import { TotalsService } from './core/services/totals.service';
import { FavoritesService } from './core/services/favorites.service';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        loadingInterceptor,
        errorInterceptor
      ])
    ),
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => ({
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'https://rickandmortyapi.com/graphql'
        })
      }),
      deps: [HttpLink]
    },
    Apollo,
    CharacterGraphqlService,
    {
      provide: CHARACTER_DATA_SOURCE,
      useExisting: CharacterGraphqlService
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (service: CharacterGraphqlService) => {
        return () => {
          initializeCharacterService(service);
          loadFavoritesFromStorage();
        };
      },
      deps: [CharacterGraphqlService],
      multi: true
    },
    TotalsService,
    FavoritesService
  ]
};
