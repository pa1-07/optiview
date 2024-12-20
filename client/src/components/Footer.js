import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <AppBar
      position="fixed"
      style={{
        top: "auto",
        bottom: 0,
        backgroundColor: "#f0f0f0",
        color: "black",
      }}
    >
      <Toolbar style={{ minHeight: "50px", justifyContent: "" }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Optiview All rights reserved
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
