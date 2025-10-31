# UnaHur Anti-Social Net - Frontend (React + TypeScript + React-Bootstrap)

## Resumen
Proyecto frontend para la red social "UnaHur Anti-Social Net" desarrollado con React + TypeScript y React-Bootstrap.
Cumple las funcionalidades requeridas: login simulado, registro, feed, detalle de post, crear post, perfil de usuario, comentarios.

## Requisitos
- Node >= 18
- npm o yarn

## Instalación
1. Copiar `.env.example` a `.env` y configurar `VITE_API_BASE` con la URL del backend (por ejemplo la API del enunciado).
2. Instalar dependencias:
```bash
npm install
# o
yarn
```
3. Correr en modo desarrollo:
```bash
npm run dev
```

## Endpoints esperados
Ver enunciado — el frontend usa `VITE_API_BASE` como base para los endpoints:
- GET /users
- POST /users
- GET /posts
- GET /posts/:id
- POST /posts
- GET /tags
- GET /posts/:id/comments
- POST /comments
- POST /postimages
- GET /postimages/post/:postId

## Nota
Este repo es un scaffold funcional. Ajusta estilos, validaciones y tests según tu criterio.
