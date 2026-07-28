const SPREADSHEET_ID = '16CoD1XkeBC3Vj33TsgdzpjLRE2qdK7tewLqa5Xm5uBg';
const USERS_SHEET = 'Users';
const PROGRESS_SHEET = 'Progress';

function doGet() {
  return jsonResponse({ ok: true, service: 'Dada Group On-Boarding Progress API' });
}

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || '{}');
    const data = handleAction(payload);
    return jsonResponse(Object.assign({ ok: true }, data));
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || String(error) });
  }
}

function handleAction(payload) {
  switch (payload.action) {
    case 'login':
      return loginUser(payload.user_id, payload.pin);
    case 'getProgress':
      return { progress: getProgress(payload.user_id) };
    case 'saveProgress':
      saveProgress(payload.user_id, payload.item_id, payload.completed, payload.source);
      return { progress: getProgress(payload.user_id) };
    case 'listUsers':
      return { users: listUsersForAdmin(payload.requester_id) };
    case 'getUserProgress':
      return { progress: getUserProgressForAdmin(payload.requester_id, payload.target_user_id) };
    default:
      throw new Error('Accion no soportada.');
  }
}

function loginUser(userId, pin) {
  const users = readSheetObjects(USERS_SHEET);
  const user = users.find(row => row.user_id === userId && isActive(row.activo));

  if (!user || user.pin !== pin) {
    throw new Error('Usuario o clave incorrecta.');
  }

  return {
    user: {
      user_id: user.user_id,
      nombre: user.nombre,
      rol: user.rol
    },
    progress: getProgress(user.user_id)
  };
}

function isAdminRol(rol) {
  return String(rol || '').toLowerCase().indexOf('administrador') !== -1;
}

function requireAdmin(requesterId) {
  const users = readSheetObjects(USERS_SHEET);
  const requester = users.find(row => row.user_id === requesterId && isActive(row.activo));
  if (!requester || !isAdminRol(requester.rol)) {
    throw new Error('No autorizado.');
  }
}

function listUsersForAdmin(requesterId) {
  requireAdmin(requesterId);
  const users = readSheetObjects(USERS_SHEET);
  return users
    .filter(row => isActive(row.activo))
    .map(row => ({ user_id: row.user_id, nombre: row.nombre, rol: row.rol }));
}

function getUserProgressForAdmin(requesterId, targetUserId) {
  requireAdmin(requesterId);
  if (!targetUserId) throw new Error('Falta el usuario a consultar.');
  return getProgress(targetUserId);
}

function getProgress(userId) {
  const rows = readSheetObjects(PROGRESS_SHEET);
  return rows.reduce((progress, row) => {
    if (row.user_id === userId && String(row.completed).toUpperCase() === 'TRUE') {
      progress[row.item_id] = true;
    }
    return progress;
  }, {});
}

function saveProgress(userId, itemId, completed, source) {
  if (!userId || !itemId) throw new Error('Faltan datos para guardar el progreso.');

  const sheet = getSpreadsheet().getSheetByName(PROGRESS_SHEET);
  const values = sheet.getDataRange().getValues();
  const now = new Date();
  const completedValue = completed ? 'TRUE' : 'FALSE';
  const sourceValue = source || 'dashboard';

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === userId && values[i][1] === itemId) {
      sheet.getRange(i + 1, 3, 1, 3).setValues([[completedValue, now, sourceValue]]);
      return;
    }
  }

  sheet.appendRow([userId, itemId, completedValue, now, sourceValue]);
}

function readSheetObjects(sheetName) {
  const sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('No existe la pestana ' + sheetName + '.');

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(header => String(header).trim());
  return values.slice(1).filter(row => row.some(Boolean)).map(row => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {});
  });
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function isActive(value) {
  return value === true || String(value).toUpperCase() === 'TRUE';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
