const BASE_URL = "http://localhost:5000/api";

export const API = {
  ADMIN_LOGIN: `${BASE_URL}/auth/admin/login`,
  CLIENT_SIGNUP: `${BASE_URL}/auth/signup`,
  IMPORT_SHEET: `${BASE_URL}/sheets/import`,
  GET_ALL_SHEETS: '/sheets/all',
  GET_ALL_DATA: `${BASE_URL}/sheets/allData`,
  GET_PAGINATED_DATA: `${BASE_URL}/sheets/data`,
  EXPORT_SHEET: `${BASE_URL}/sheets/export/:sheetId`,
  ADD_ROW: (sheetId) => `${BASE_URL}/sheets/${sheetId}/row`,
  DELETE_ROW: (sheetId, rowIndex) => `${BASE_URL}/sheets/${sheetId}/row/${rowIndex}`,
  DELETE_SHEET: `${BASE_URL}/sheets/:sheetId`
};
