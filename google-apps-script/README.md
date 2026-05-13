# Google Sheets progress setup

Base creada:

https://docs.google.com/spreadsheets/d/16CoD1XkeBC3Vj33TsgdzpjLRE2qdK7tewLqa5Xm5uBg/edit

Usuarios iniciales:

- `luis` / `dada2026`
- `onboarding` / `onboarding2026`

Para activar guardado en Google Sheets:

1. Abre la hoja de Google Sheets.
2. Ve a Extensions > Apps Script.
3. Pega el contenido de `onboarding-progress.gs`.
4. Deploy > New deployment > Web app.
5. Ejecutar como: tu usuario.
6. Acceso: Anyone.
7. Copia la URL del Web App.
8. En `onboarding-gerente-operaciones.html`, pega esa URL en `GOOGLE_SHEETS_API_URL`.
9. Publica de nuevo el dashboard.

La pestana `Users` controla usuarios y claves. La pestana `Progress` guarda cada actividad marcada por usuario.
