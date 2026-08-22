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
8. En `index.html`, pega esa URL en `GOOGLE_SHEETS_API_URL`.
9. Publica de nuevo el dashboard.

La pestana `Users` controla usuarios y claves. La pestana `Progress` guarda cada actividad marcada por usuario.

## Nuevo rol: Merchant Junior

El dashboard ya reconoce el rol Merchant Junior (checklist, plan 90 días, organigrama y
responsabilidades propios). Para que el login funcione contra Google Sheets falta agregar
la fila del usuario en la pestana `Users`:

- `user_id`: `merchant-jr`
- `nombre`: nombre de la persona
- `rol`: debe contener la palabra "Merchant" (por ejemplo `Merchant Junior`) — el dashboard
  detecta el rol por esa palabra clave en `index.html`.
- `pin`: la clave que se le entregue a la persona
- `activo`: `TRUE`

Mientras esa fila no exista, el login remoto devolverá "Usuario o clave incorrecta." para
ese usuario. El fallback local (`LOCAL_USERS` en el HTML, usado solo si `GOOGLE_SHEETS_API_URL`
está deshabilitada) ya incluye un PIN de prueba (`Merchdada2026`) que conviene rotar o alinear
con el PIN real que se registre en la hoja.

## Nuevo rol: Comunicación y POS

El dashboard también reconoce el rol de Comunicación y POS con semana tipo, responsabilidades,
herramientas, recursos, organigrama y checklist de 90 días propios. La detección se activa cuando
el campo `rol` contiene `POS`.

Configuración esperada en la pestaña `Users`:

- `user_id`: `POS`
- `nombre`: `POS - Marketing` o el nombre de la persona
- `rol`: debe contener `POS` (por ejemplo `POS - Marketing`)
- `pin`: la clave entregada a la persona
- `activo`: `TRUE`

El selector de acceso y el fallback local de `index.html` ya incluyen el usuario `POS`. Si se
cambia su PIN en Google Sheets, conviene mantener alineado el PIN local para pruebas sin API.

## Panel "Progreso del Equipo" (rol Administrador)

`onboarding-progress.gs` ahora expone dos acciones nuevas: `listUsers` y `getUserProgress`,
que permiten a cualquier usuario cuyo `rol` contenga la palabra "Administrador" consultar
desde el propio dashboard el avance de checklist de cualquier otro usuario activo (sin
necesidad de abrir la hoja de cálculo).

**Este archivo por sí solo no actualiza el Web App ya desplegado.** Google Apps Script
sirve el código que se pegó manualmente en el editor la última vez. Para que el panel
funcione en producción:

1. Abre la hoja de Google Sheets → Extensions > Apps Script.
2. Reemplaza el contenido por el de este `onboarding-progress.gs` actualizado.
3. Deploy > Manage deployments > icono de lápiz sobre el deployment existente (el que
   genera la URL ya usada en `GOOGLE_SHEETS_API_URL`) > Version: **New version** > Deploy.
   Importante: usar "New version" del mismo deployment, no crear uno nuevo, para no
   cambiar la URL que ya está publicada en el dashboard.

Nota de seguridad: al igual que el resto de esta API (`getProgress`/`saveProgress` ya
aceptan cualquier `user_id` sin verificar contraseña), `listUsers`/`getUserProgress` solo
validan que el `requester_id` enviado tenga rol Administrador en la hoja — no verifican
contraseña en cada llamada. Es el mismo nivel de confianza que ya tenía el resto del
sistema (cualquiera con la URL del Web App podría, en teoría, forjar un `requester_id`
desde la consola del navegador). No es una regresión introducida por este cambio, pero
si en algún momento se requiere un nivel de seguridad mayor, este API necesitaría
autenticación real (tokens de sesión) en vez de confiar en el user_id que envía el cliente.
