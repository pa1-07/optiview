const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Sheet = require('../models/Sheet');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Import Excel Sheet
exports.importSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheets = workbook.SheetNames;

    const importedSheets = [];
    for (const sheetName of sheets) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const columns = Object.keys(jsonData[0] || {});
      const sheet = await Sheet.create({
        sheetName,
        data: jsonData,
        columns,
      });

      importedSheets.push(sheet);
    }

    return res.status(201).json({
      message: 'Sheets imported successfully',
      sheets: importedSheets,
      sheetId: importedSheets[0]?._id, // Return the first sheetId
    });
  } catch (error) {
    console.error('Error importing sheet:', error.message);
    return res.status(500).json({ message: 'Error importing sheet' });
  }
};

exports.getPaginatedData = async (req, res) => {
  const { sheetId, page = 1, limit = 10, search = '', sortField, sortOrder } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(sheetId)) {
      return res.status(400).json({ message: 'Invalid sheetId' });
    }

    const sheet = await Sheet.findById(sheetId);
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

    let filteredData = sheet.data;

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortField && sortOrder) {
      filteredData.sort((a, b) =>
        sortOrder === 'asc'
          ? String(a[sortField] || '').localeCompare(String(b[sortField] || ''))
          : String(b[sortField] || '').localeCompare(String(a[sortField] || ''))
      );
    }

    const totalRecords = filteredData.length;

    // Handle "limit=0" to fetch all rows
    const paginatedData = limit == 0 ? filteredData : filteredData.slice((page - 1) * limit, page * limit);

    res.json({
      data: paginatedData,
      columns: sheet.columns,
      totalRecords,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};


// Fetch All Sheets and Metadata
exports.getAllSheets = async (req, res) => {
  try {
    const sheets = await Sheet.find().sort({ createdAt: -1 });

    if (!sheets.length) {
      return res.status(404).json({ message: 'No sheets available' });
    }

    const allSheets = sheets.map((sheet) => ({
      sheetId: sheet._id,
      sheetName: sheet.sheetName,
      columns: sheet.columns,
    }));

    res.json({ sheets: allSheets });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sheets', error: error.message });
  }
};


exports.getAllData = async (req, res) => {
  const { sheetId } = req.query;

  try {
    // Validate the sheet ID
    if (!mongoose.Types.ObjectId.isValid(sheetId)) {
      return res.status(400).json({ message: "Invalid sheetId" });
    }

    // Find the sheet by ID
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }

    // Return all data
    res.json({
      data: sheet.data,
      columns: sheet.columns,
    });
  } catch (error) {
    console.error("Error fetching all data:", error.message);
    res.status(500).json({ message: "Error fetching all data" });
  }
};





// Export Excel Sheet
exports.exportSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const sheet = await Sheet.findById(sheetId);
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });

    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', `attachment; filename="${sheet.sheetName}.xlsx"`);
    res.type('application/octet-stream').send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting sheet', error: error.message });
  }
};

// Add Row
exports.addRow = async (req, res) => {
  const { sheetId } = req.params;
  const { row } = req.body;

  try {
    const sheet = await Sheet.findById(sheetId);

    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }

    sheet.data.push(row);
    await sheet.save();

    res.status(201).json({ message: 'Row added successfully', row });
  } catch (error) {
    console.error('Error adding row:', error.message);
    res.status(500).json({ message: 'Error adding row' });
  }
};

// Delete Row
exports.deleteRow = async (req, res) => {
  const { sheetId, rowIndex } = req.params;

  try {
    const sheet = await Sheet.findById(sheetId);

    if (!sheet) {
      return res.status(404).json({ message: 'Sheet not found' });
    }

    sheet.data.splice(rowIndex, 1);
    await sheet.save();

    res.json({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error('Error deleting row:', error.message);
    res.status(500).json({ message: 'Error deleting row' });
  }
};

exports.deleteSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    await Sheet.findByIdAndDelete(sheetId);
    res.status(200).json({ message: "Sheet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sheet", error });
  }
};

