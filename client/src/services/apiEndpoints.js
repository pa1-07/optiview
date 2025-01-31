const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API = {
  ADMIN_LOGIN: `${BASE_URL}/auth/admin/login`,
  CLIENT_SIGNUP: `${BASE_URL}/auth/signup`,
  CLIENT_LOGIN: `${BASE_URL}/auth/login`,
  GET_ALL_CLIENTS: `${BASE_URL}/access/all-clients`,
  GET_CLIENT_SHEETS: (clientId) => `${BASE_URL}/access/client-sheets/${clientId}`,
  IMPORT_SHEET: `${BASE_URL}/sheets/import`,
  GET_ALL_SHEETS: `${BASE_URL}/sheets/all`,
  GET_ALL_DATA: `${BASE_URL}/sheets/allData`,
  GET_PAGINATED_DATA: `${BASE_URL}/sheets/data`,
  EXPORT_SHEET: `${BASE_URL}/sheets/export/:sheetId`,
  ADD_ROW: (sheetId) => `${BASE_URL}/sheets/${sheetId}/row`,
  UPDATE_ROW: (sheetId, rowIndex) => `${BASE_URL}/sheets/${sheetId}/row/${rowIndex}`,
  DELETE_ROW: (sheetId, rowIndex) =>
    `${BASE_URL}/sheets/${sheetId}/row/${rowIndex}`,
  DELETE_SHEET: `${BASE_URL}/sheets/:sheetId`,
  ASSIGN_SHEET: `${BASE_URL}/access/assign-sheet`,
};
