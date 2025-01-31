import React, { useState, useEffect, useMemo, useCallback  } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
  CircularProgress,
  Checkbox,
  ListItemText,
  MenuItem,
} from "@mui/material";
import api from "../services/apiService";
import { API } from "../services/apiEndpoints";

const AdminAccess = () => {
  const [clients, setClients] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [assignedSheetIds, setAssignedSheetIds] = useState(new Set());
  const [loading, setLoading] = useState({
    clients: false,
    sheets: false,
    assignedSheets: false,
  });
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });

  const fetchClientSheets = useCallback(async (clientId) => {
    setLoading((prev) => ({ ...prev, assignedSheets: true }));
    try {
      const res = await api.get(API.GET_CLIENT_SHEETS(clientId));
      const assignedIds = new Set(res.data.map((sheet) => sheet._id));
      //console.log("Assigned IDs:", assignedIds)
      setAssignedSheetIds(assignedIds);
      const mark = setSelectedSheets(sheets.filter((sheet) => assignedIds.has(sheet.sheetId)));
      //console.log("preselected are: ", mark )
    } catch (error) {
      setAlert({ open: true, message: "Failed to fetch assigned sheets.", severity: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, assignedSheets: false }));
    }
  }, [sheets]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, clients: true, sheets: true }));
      try {
        const [clientsRes, sheetsRes] = await Promise.all([
          api.get(API.GET_ALL_CLIENTS),
          api.get(API.GET_ALL_SHEETS),
        ]);

        setClients(clientsRes.data || []);
        setSheets(sheetsRes.data.sheets || []);
      } catch (error) {
        setAlert({ open: true, message: "Failed to load data.", severity: "error" });
      } finally {
        setLoading((prev) => ({ ...prev, clients: false, sheets: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedClients.length === 1) {
      fetchClientSheets(selectedClients[0]._id);
    } else {
      setAssignedSheetIds(new Set());
      setSelectedSheets([]);
    }
  }, [selectedClients, fetchClientSheets]);


  const handleClientChange = (event, newValue) => {
    setSelectedClients(newValue);
  };

  const handleSheetChange = (event, newValue) => {
    setSelectedSheets(newValue);
  };

  const handleAssignSheet = async () => {
    if (selectedClients.length === 0) {
      setAlert({ open: true, message: "Please select at least one client.", severity: "warning" });
      return;
    }
  
    const newAssignedSheetIds = selectedSheets.map((sheet) => sheet.sheetId);
  
    try {
      if (selectedClients.length === 1) {
        // Overwrite sheets for a single client
        await api.post(API.ASSIGN_SHEET, {
          clientId: selectedClients[0]._id,
          addedSheetIds: newAssignedSheetIds, // Overwrite with new sheets
          removedSheetIds: [], 
        });
      } else {
        // Add sheets to existing ones for multiple clients
        for (const client of selectedClients) {
          const currentSheetsRes = await api.get(API.GET_CLIENT_SHEETS(client._id));
          const currentSheetIds = new Set(currentSheetsRes.data.map((sheet) => sheet._id));
  
          const updatedSheets = [...currentSheetIds, ...newAssignedSheetIds];
  
          await api.post(API.ASSIGN_SHEET, {
            clientId: client._id,
            addedSheetIds: Array.from(updatedSheets), // Merge existing + new sheets
            removedSheetIds: [], // Do not remove any existing sheets
          });
        }
      }
  
      setAlert({ open: true, message: "Sheets updated successfully!", severity: "success" });
      fetchClientSheets(selectedClients[0]._id);
    } catch (error) {
      setAlert({ open: true, message: "Error updating sheets.", severity: "error" });
    }
  };
  

  const sheetOptions = useMemo(() => {
    return sheets.map((sheet) => ({
      ...sheet,
      isSelected: assignedSheetIds.has(sheet.sheetId),
    }));
  }, [sheets, assignedSheetIds]);

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box
      p={2}
      bgcolor="#f8f9fa"
      sx={{ mb: 6 }}
    >
    <Paper style={{ padding: 30, maxWidth: 550, margin: "auto", marginTop: 15, marginBottom: 15 }}>
      <Typography variant="h5" gutterBottom style={{ fontWeight: "bold", textAlign: "center", marginBottom: 30 }}>
        Assign Sheets to Clients
      </Typography>

      <Box mb={3}>
        <Typography style={{fontWeight: "bold"}}>Select Clients:</Typography>
        <Autocomplete
          multiple
          options={clients}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          value={selectedClients}
          onChange={handleClientChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search Clients..."
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: loading.clients ? <CircularProgress size={20} /> : null,
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip key={option._id} label={option.name} {...getTagProps({ index })} />
            ))
          }
          disableCloseOnSelect
          filterSelectedOptions
        />
      </Box>

      <Box mb={3}>
        <Typography style={{fontWeight: "bold"}}>Select Sheets:</Typography>
        <Autocomplete
          multiple
          options={sheetOptions}
          getOptionLabel={(option) => option.sheetName}
          value={selectedSheets}
          onChange={handleSheetChange}
          disableCloseOnSelect
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.sheetId}>
              <Checkbox checked={selectedSheets.some((sel) => sel.sheetId === option.sheetId)} />
              <ListItemText primary={option.sheetName} />
            </MenuItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search Sheets..."
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: loading.assignedSheets ? <CircularProgress size={20} /> : null,
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.sheetId === value.sheetId}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleAssignSheet} fullWidth disabled={loading.assignedSheets}>
        {loading.assignedSheets ? "Assigning..." : "ASSIGN SHEETS"}
      </Button>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ position: "relative", top: 60, right: 30 }}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Paper>
    </Box>
  );
};

export default AdminAccess;