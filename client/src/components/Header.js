import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    if (role === "client") {
      navigate("/signup");
    } else {
      navigate("/");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Fixed Material UI AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#2C3E50", // Professional dark blue-gray
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
          }}
        >
          {/* Portal Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "1px",
              cursor: "pointer",
              ":hover": { color: "#F39C12" },
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="rotating-o">O</span>
            ptiView
          </Typography>

          {/* Buttons: Admin, Client, and Logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {role === "admin" && (
              <>
              <Button
                component={Link}
                to="/admin"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  ":hover": {
                    color: "#FFB74D",
                    backgroundColor: "rgba(255, 183, 77, 0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Admin
              </Button>

              <Button
                component={Link}
                to="/admin/access"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  ":hover": {
                    color: "#FFB74D",
                    backgroundColor: "rgba(255, 183, 77, 0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Access
              </Button>

              </>
            )}
            {role === "client" && (
              <Button
                component={Link}
                to="/client"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontFamily: "Poppins, sans-serif",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  ":hover": {
                    color: "#FFB74D",
                    backgroundColor: "rgba(255, 183, 77, 0.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Client
              </Button>
            )}

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              sx={{
                backgroundColor: "#FF6347",
                color: "#FFFFFF",
                fontWeight: 500,
                textTransform: "none",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.9rem",
                padding: "6px 16px",
                ":hover": {
                  backgroundColor: "#FF4500",
                  boxShadow: "0 4px 8px rgba(255, 99, 71, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Offset Toolbar to handle AppBar height */}
      <Toolbar />
    </Box>
  );
};

export default Header;
