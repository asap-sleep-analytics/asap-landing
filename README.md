# A.S.A.P. Landing

Landing page de A.S.A.P. (Apnea Sleep Analytics Platform).

## Stack

- React (Vite)
- Tailwind CSS
- Lucide React

## Enfoque De Diseño

- Composición mobile-first centrada en uso smartphone
- Estética minimalista oscura con acentos mint
- Header sticky con CTA de registro persistente
- Mensajería de privacidad primero con transparencia técnica

## Secciones Incluidas

- Hero enfocado en descarga de app (simulada)
- Grid de funciones tipo bento
- Sección de transparencia técnica (Scikit-Learn v1.4.0)
- Flujo de arquitectura (App móvil -> FastAPI -> Núcleo ML)
- Formulario de waitlist
- Panel funcional de registro/login con JWT

## Conexión Con API

El formulario de waitlist envía datos a:

- `POST /api/leads`

El panel de acceso usa:

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `GET /api/auth/perfil`

El dashboard usa:

- `GET /api/dashboard/resumen`

Monitoreo de sueño usa:

- `POST /api/sleep/calibracion`
- `POST /api/sleep/sesiones/iniciar`
- `POST /api/sleep/sesiones/{session_id}/finalizar`
- `GET /api/sleep/sesiones?limit=20`

Ruta frontend:

- `/dashboard`

Configura la URL base del backend con:

```bash
VITE_API_BASE_URL=http://localhost:8001
```

Puedes copiar `.env.example` a `.env` y ajustar valores para local o producción.

## Ejecutar En Local

```bash
npm install
npm run dev
```

URL local por defecto:

- `http://localhost:5173`

## Build

```bash
npm run build
```
