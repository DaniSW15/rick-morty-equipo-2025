# Rick & Morty Explorer

Una aplicación web moderna construida con Angular que permite explorar el universo de Rick & Morty.

## Características

- **Exploración de Personajes**: Visualiza y busca todos los personajes de la serie
- **Detalles Detallados**: Información completa de cada personaje, incluyendo:
  - Estado y especie
  - Ubicación actual y origen
  - Episodios donde aparece
- **Favoritos**: Guarda tus personajes favoritos para acceso rápido
- **Modo Responsivo**: Diseño adaptable para móviles y escritorio
- **Carga Optimizada**: Implementación de lazy loading para mejor rendimiento

## Tecnologías

- Angular 18.2.12
- Apollo GraphQL
- Angular Material
- RxJS
- CSS Variables para theming

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/yourusername/rick-morty-equipo-2025.git
```

2. Instala las dependencias:
```bash
cd rick-morty-equipo-2025
npm install
```

3. Inicia el servidor de desarrollo:
```bash
ng serve
```

4. Abre http://localhost:4200 en tu navegador

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/           # Servicios core y utilidades
│   ├── features/       # Componentes principales
│   ├── shared/        # Componentes y utilidades compartidas
│   └── app.routes.ts  # Configuración de rutas
```

## Rutas Principales

- `/characters` - Lista de personajes
- `/favorites` - Personajes favoritos

## Scripts Disponibles

- `ng serve` - Inicia servidor de desarrollo
- `ng build` - Compila el proyecto
- `ng test` - Ejecuta tests unitarios
- `ng lint` - Ejecuta linting

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Equipo

- [Nombre del Desarrollador 1]
- [Nombre del Desarrollador 2]
- [Nombre del Desarrollador 3]
