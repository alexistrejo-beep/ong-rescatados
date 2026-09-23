# Huellitas de Amor

## Persistencia compartida

La aplicación usa Supabase Realtime para que adopciones, avisos de animales perdidos, comentarios y reacciones se vean entre dispositivos. Si no hay conexión, `usePetsSync` conserva la última lectura en `localStorage`, encola altas, cambios y eliminaciones, y las reintenta al volver online.

1. Creá un proyecto en Supabase.
2. Ejecutá [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor.
3. Copiá [`.env.example`](.env.example) a `.env.local` y completá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Configurá `ADMIN_PASSWORD` únicamente como variable del servidor o del entorno de Vite dev. La contraseña nunca se incluye en el bundle.

La clave `service_role` no debe usarse en React. Las políticas SQL incluidas habilitan publicaciones públicas; para producción conviene reemplazar la edición/eliminación pública por una Edge Function autenticada y limitar esas políticas por usuario/rol.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
