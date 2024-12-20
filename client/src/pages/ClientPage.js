import React from 'react';
import ClientDashboard from '../components/ClientDashboard';
import MainLayout from '../layouts/MainLayout';

const ClientPage = () => {
  return (
    <MainLayout>
      <ClientDashboard />
    </MainLayout>
  );
};

export default ClientPage;
