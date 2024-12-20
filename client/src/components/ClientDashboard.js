import React, { useState, useEffect } from 'react';
import api from '../services/apiService';
import { API } from '../services/apiEndpoints';

const ClientDashboard = () => {
  const [data, setData] = useState([]);

  const fetchClientSheets = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get(API.CLIENT_SHEETS, { headers: { Authorization: `Bearer ${token}` } });
    setData(res.data);
  };

  useEffect(() => {
    fetchClientSheets();
  }, []);

  return (
    <div>
      <h2>Client Dashboard</h2>
      <ul>
        {data.map((sheet) => (
          <li key={sheet._id}>{sheet.sheetName}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientDashboard;
