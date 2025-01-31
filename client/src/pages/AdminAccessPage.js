import React from "react";
import AdminAccess from "../components/AdminAccess";
import MainLayout from "../layouts/MainLayout";

const AdminAccessPage = () => {
  return (
    <div>
      <MainLayout>
        {/* <h2>Manage Client Access</h2> */}
        <AdminAccess />
      </MainLayout>
    </div>
  );
};

export default AdminAccessPage;
