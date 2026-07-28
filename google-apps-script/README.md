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

## Nuevo rol: Merchant Junior

El dashboard ya reconoce el rol Merchant Junior (checklist, plan 90 días, organigrama y
responsabilidades propios). Para que el login funcione contra Google Sheets falta agregar
la fila del usuario en la pestana `Users`:

- `user_id`: `merchant-jr`
- `nombre`: nombre de la persona
- `rol`: debe contener la palabra "Merchant" (por ejemplo `Merchant Junior`) — el dashboard
  detecta el rol por esa palabra clave en `onboarding-gerente-operaciones.html`.
- `pin`: la clave que se le entregue a la persona
- `activo`: `TRUE`

Mientras esa fila no exista, el login remoto devolverá "Usuario o clave incorrecta." para
ese usuario. El fallback local (`LOCAL_USERS` en el HTML, usado solo si `GOOGLE_SHEETS_API_URL`
está deshabilitada) ya incluye un PIN de prueba (`Merchdada2026`) que conviene rotar o alinear
con el PIN real que se registre en la hoja.
