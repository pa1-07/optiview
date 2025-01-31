import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, FormControlLabel, Checkbox, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import { API } from '../services/apiEndpoints';
import MainLayout from '../layouts/MainLayout';
import { jwtDecode } from 'jwt-decode';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (isLogin) {
        const res = await api.post(API.CLIENT_LOGIN, { name: form.name, password: form.password });
        localStorage.setItem('token', res.data.token);
        const decodedToken = jwtDecode(res.data.token);
        localStorage.setItem('role', decodedToken.role);
        if (decodedToken.role === 'client') {
          navigate('/client');
        } else {
          navigate('/admin');
        }
      } else {
        await api.post(API.CLIENT_SIGNUP, { name: form.name, email: form.email, password: form.password });
        setMessage('Signup successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/client'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || (isLogin ? 'Invalid credentials. Try again.' : 'Signup failed. Please try again.'));
    }
  };

  // Toggle show/hide password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <MainLayout clientNav={isLogin}>
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Paper style={{ padding: 40, width: 400, textAlign: 'center' }} elevation={3}>
          <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Typography>
          {error && <Typography color="error" style={{ marginBottom: '10px' }}>{error}</Typography>}
          {message && <Typography color="primary" style={{ marginBottom: '10px' }}>{message}</Typography>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                variant="outlined"
                margin="normal"
                value={form.email}
                onChange={handleChange}
                required
              />
            )}
            <TextField
              fullWidth
              label="Username"
              name="name"
              variant="outlined"
              margin="normal"
              value={form.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'} // Dynamically change input type
              variant="outlined"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControlLabel control={<Checkbox color="primary" />} label="Remember me" />

            <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
              {isLogin ? 'SIGN IN' : 'SIGN UP'}
            </Button>
          </form>

          <Typography style={{ marginTop: '20px' }}>
            {isLogin ? "Don't have an account? " : 'Already a member? '}
            <span
              style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default AuthForm;
