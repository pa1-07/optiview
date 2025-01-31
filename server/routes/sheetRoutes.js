const express = require('express');
const multer = require('multer');
const {
  importSheet,
  getPaginatedData,
  exportSheet,
  addRow,
  deleteRow,
  getAllSheets,
  getAllData,
  deleteSheet,
  updateRow
} = require('../controllers/sheetController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = multer(); // For file uploads
const router = express.Router();

router.post('/import', protect, authorize('admin'), upload.single('file'), importSheet);
router.get('/data', protect, authorize('admin'), getPaginatedData);
router.get('/all', protect, authorize('admin'), getAllSheets);
router.get('/allData', getAllData);
router.get('/export/:sheetId', protect, authorize('admin'), exportSheet);
router.post('/:sheetId/row', protect, authorize('admin'), addRow);
router.delete('/:sheetId/row/:rowIndex', protect, authorize('admin'), deleteRow);
router.put('/:sheetId/row/:rowIndex', protect, authorize('admin'), updateRow);
router.delete('/:sheetId', protect, authorize('admin'), deleteSheet);


module.exports = router;
