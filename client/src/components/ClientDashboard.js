import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Toolbar,
  Select,
  MenuItem,
  InputAdornment,
  TextField,
  IconButton,
} from "@mui/material";
import { Search, MoreHoriz } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../services/apiService";
import { API } from "../services/apiEndpoints";
import { disableCopy } from "../utils/disableCopy";
import { jwtDecode } from "jwt-decode";

const ClientDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [clientSheets, setClientSheets] = useState([]);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch sheets accessible to the client
  const fetchClientSheets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      if (!userId) throw new Error("User ID not found in token");

      const { data } = await api.get(API.GET_CLIENT_SHEETS(userId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClientSheets(data || []);
      if (data.length > 0) setSheetId(data[0]._id);
    } catch (error) {
      console.error("Error fetching client sheets:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error fetching client sheets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sheet data when sheetId changes
  const fetchSheetData = useCallback(async () => {
    if (!sheetId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get(API.GET_ALL_DATA, {
        params: { sheetId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedRows = data.data.map((row, index) => ({
        ...row,
        id: `${sheetId}-${index}`,
      }));

      setAllData(updatedRows);

      const allColumns = data.columns;
      const firstColumn = allColumns.length > 0 ? allColumns[0] : "Name";

      // Define columns: first column + "..." button, and other columns hidden initially
      setColumns([
        { field: firstColumn, headerName: firstColumn, flex: 1 },
        {
          field: "Actions",
          headerName: "",
          width: 80,
          sortable: false,
          renderCell: (params) => (
            // <IconButton onClick={() => toggleRow(params.row.id)} size="small">
            //   <MoreHoriz sx={{ fontSize: "1.8rem", color: "#555" }}/>
            // </IconButton>

            <button
              onClick={() => toggleRow(params.row.id)}
              style={{
                background: "none",
                border: "none",
                color: "#2C3E50",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              } 
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")} 
            >
              View
            </button>
          ),
        },
        ...allColumns.slice(1).map((col) => ({
          field: col,
          headerName: col,
          flex: 1,
          hide: true, // Hide additional columns initially
        })),
      ]);
    } catch (error) {
      console.error("Error fetching sheet data:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error fetching sheet data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [sheetId]);

  // Toggle row expansion
  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // Filter sheets based on dropdown search
  const getFilteredSheets = useCallback(() => {
    return clientSheets.filter((sheet) =>
      sheet.sheetName?.toLowerCase().includes(dropdownSearch.toLowerCase())
    );
  }, [clientSheets, dropdownSearch]);

  // Filter rows based on search input and manage expanded rows
  const getFilteredRows = useCallback(() => {
    return allData
      .filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      )
      .map((row) => {
        if (expandedRows[row.id]) {
          return row; // Show full row if expanded
        } else {
          // Show only first column initially
          const firstColumnKey = columns.length > 1 ? columns[0].field : "Name";
          return { id: row.id, [firstColumnKey]: row[firstColumnKey] };
        }
      });
  }, [allData, search, expandedRows, columns]);

  useEffect(() => {
    fetchClientSheets();
  }, [fetchClientSheets]);

  useEffect(() => {
    if (sheetId) fetchSheetData();
  }, [sheetId, fetchSheetData]);

  useEffect(() => {
    disableCopy();
  }, []);

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
        Client Dashboard
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
            style={{ minWidth: "180px" }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  width: 230,
                  overflowY: "auto",
                  marginTop: 8,
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected) return "Select a sheet";
              const selectedSheet = clientSheets.find(
                (sheet) => sheet._id === selected
              );
              return selectedSheet ? selectedSheet.sheetName : "Select a sheet";
            }}
          >
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
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>

            {getFilteredSheets().length > 0 ? (
              getFilteredSheets().map((sheet) => (
                <MenuItem key={sheet._id} value={sheet._id}>
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
      </Toolbar>

      <Box
        sx={{
          height: "70vh",
          width: "100%",
          overflow: "auto",
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
            rows={getFilteredRows()}
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
    </Box>
  );
};

export default ClientDashboard;
