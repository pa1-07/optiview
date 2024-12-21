import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Toolbar,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  Modal,
} from "@mui/material";
import { DataGrid  } from "@mui/x-data-grid";
import { Upload, Download, Delete, Search } from "@mui/icons-material";
import api from "../services/apiService";
import { API } from "../services/apiEndpoints";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]); // All rows data
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState(""); // Row-level search
  const [sheetId, setSheetId] = useState("");
  const [allSheets, setAllSheets] = useState([]);
 

  const [dropdownSearch, setDropdownSearch] = useState(""); // Sheet dropdown search
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sheetToDelete, setSheetToDelete] = useState(null);

  // Fetch all sheets
  const fetchAllSheets = useCallback(async () => {
    try {
      const { data } = await api.get(API.GET_ALL_SHEETS);
      setAllSheets(data.sheets);
      if (data.sheets.length > 0) setSheetId(data.sheets[0].sheetId);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching sheets",
        severity: "error",
      });
    }
  }, []);

  // Fetch all data for the selected sheet
  const fetchAllData = useCallback(async () => {
    if (!sheetId) return;

    setLoading(true);
    try {
      const { data } = await api.get(API.GET_ALL_DATA, {
        params: { sheetId },
      });

      const updatedRows = data.data.map((row, index) => ({
        ...row,
        id: `${sheetId}-${index}`, // Unique ID for each row
      }));

      setAllData(updatedRows); // Store all rows
      setColumns(
        data.columns.map((col) => ({
          field: col,
          headerName: col,
          flex: 1,
        }))
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [sheetId]);

  // Filter sheets based on dropdown search
  const getFilteredSheets = useCallback(() => {
    return allSheets.filter((sheet) =>
      sheet.sheetName.toLowerCase().includes(dropdownSearch.toLowerCase())
    );
  }, [allSheets, dropdownSearch]);

  // Filter rows based on search
  const getFilteredRows = useCallback(() => {
    return allData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [allData, search]);

  useEffect(() => {
    fetchAllSheets();
  }, [fetchAllSheets]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDeleteSheet = async () => {
    try {
      await api.delete(
        `${API.DELETE_SHEET.replace(":sheetId", sheetToDelete)}`
      );
      setSnackbar({
        open: true,
        message: "Sheet deleted successfully",
        severity: "success",
      });
      setOpenDeleteModal(false);
      setSheetToDelete(null);
      await fetchAllSheets();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete sheet",
        severity: "error",
      });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(API.IMPORT_SHEET, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbar({
        open: true,
        message: "File imported successfully",
        severity: "success",
      });

      // Fetch updated sheet data and set the new sheet
      await fetchAllSheets();
      const newSheetId = response.data.sheetId;
      setSheetId(newSheetId);
      await fetchAllData();

      // Reset the file input to allow re-importing the same file or another file
      e.target.value = null;
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to import file",
        severity: "error",
      });

      // Reset the file input in case of error
      e.target.value = null;
    }
  };

  const handleDownload = async () => {
    if (!sheetId) {
      setSnackbar({
        open: true,
        message: "Please select a sheet to download",
        severity: "warning",
      });
      return;
    }
  
    try {
      // Get filtered and sorted rows
      const visibleRows = getFilteredRows(); // Use the existing function to get the visible rows
      const exportData = visibleRows.map((row) =>
        columns.reduce((acc, col) => {
          acc[col.headerName] = row[col.field] || ""; // Match column header with data
          return acc;
        }, {})
      );
  
      // Convert data to CSV format
      const csvContent = [
        columns.map((col) => col.headerName).join(","), // Header row
        ...exportData.map((row) =>
          columns.map((col) => JSON.stringify(row[col.headerName])).join(",")
        ), // Data rows
      ].join("\n");
  
      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `OPT_Data_${sheetId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setSnackbar({
        open: true,
        message: "File downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Export error:", error);
      setSnackbar({
        open: true,
        message: "Failed to download file",
        severity: "error",
      });
    }
  };
  
  

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      minHeight="80vh"
      bgcolor="#f8f9fa"
      sx={{ mb: 6 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        Admin Dashboard
      </Typography>

      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginBottom: 2,
          padding: "8px 12px",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box display="flex" gap={1} alignItems="center">
          <Select
            size="small"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            displayEmpty
            variant="outlined"
            style={{
              minWidth: "180px", // Adjust width for better visibility
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: 230, // Align dropdown width
                  overflowY: "auto",
                  marginTop: 8, // Space between input and dropdown
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected) return "Select a sheet"; // Placeholder text
              const selectedSheet = allSheets.find(
                (sheet) => sheet.sheetId === selected
              );
              return selectedSheet ? selectedSheet.sheetName : "Select a sheet";
            }}
          >
            {/* Search Bar Inside Dropdown */}
            <MenuItem>
              <TextField
                size="small"
                placeholder="Search Sheets..."
                value={dropdownSearch}
                onChange={(e) => setDropdownSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoFocus // Automatically focus on the search bar
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
            </MenuItem>

            {/* Filtered Sheet List */}
            {getFilteredSheets().length > 0 ? (
              getFilteredSheets().map((sheet) => (
                <MenuItem key={sheet.sheetId} value={sheet.sheetId}>
                  {sheet.sheetName}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No sheets found</MenuItem>
            )}
          </Select>

          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            style={{ minWidth: "150px", maxWidth: "180px" }}
          />
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            component="label"
            startIcon={<Upload />}
            style={{ minWidth: "80px" }}
          >
            Import
            <input type="file" hidden onChange={handleImport} />
          </Button>

          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<Download />}
            disabled={!sheetId}
            style={{ minWidth: "80px" }}
            onClick={handleDownload}
          >
            Download
          </Button>

          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              setOpenDeleteModal(true);
              setSheetToDelete(sheetId);
            }}
            style={{ minWidth: "80px" }}
          >
            Delete
          </Button>
        </Box>
      </Toolbar>

      <Box
        sx={{
          height: "70vh", // Fixed height for consistent layout
          width: "100%", // Full container width
          overflow: "auto", // Enable both horizontal and vertical scrollbars
          border: "1px solid #ddd",
          borderRadius: "5px",
          backgroundColor: "#fff",
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={getFilteredRows()} // Apply external search filter first
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[100]}
            autoHeight={false}
            disableExtendRowFullWidth
            componentsProps={{
              basePopper: {
                disablePortal: true, // Ensure no portal-based detachments
              },
              virtualScroller: {
                role: "presentation", // Avoid unnecessary focusable roles
                inert: loading ? "true" : "false", // Use inert when loading
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                backgroundColor: "#f1f1f1",
                zIndex: 1,
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  fontSize: "0.9rem",
                },
              },
              "& .MuiDataGrid-verticalScroller": {
                overflowX: "auto !important", // Enable horizontal scrolling
              },
              "& .MuiDataGrid-scrollbar": {
                visibility: loading ? "hidden" : "visible", // Hide scrollbars during loading
                pointerEvents: loading ? "none" : "auto", // Prevent interaction during loading
              },
            }}
          />
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            boxShadow: 24,
            p: 4,
            width: 300,
          }}
        >
          <Typography variant="h6">Confirm Delete</Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this sheet?
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSheet}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminDashboard;
