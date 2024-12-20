import React from 'react';
import { Button, TextField, InputAdornment, Box } from '@mui/material';
import { Search, Upload } from '@mui/icons-material';

const TableToolbar = ({ onSearch, onImport }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <TextField
      placeholder="Search..."
      variant="outlined"
      onChange={(e) => onSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
    <Button variant="contained" component="label" startIcon={<Upload />}>
      Import
      <input type="file" hidden onChange={onImport} />
    </Button>
  </Box>
);

export default TableToolbar;
