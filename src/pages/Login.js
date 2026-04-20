import React, { useState } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, Tab, Tabs
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export default function Login({ onLogin }) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        username: form.username,
        password: form.password
      });
      onLogin(res.data.token);
    } catch {
      setError('Invalid username or password');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/register`, form);
      setSuccess('Registered successfully! Please login.');
      setTab(0);
      setError('');
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card sx={{
        width: 400,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 45px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <DirectionsRunIcon sx={{ fontSize: 50, color: '#00e5ff' }} />
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, letterSpacing: 2 }}>
              FITTRACK
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Track every run. Own every mile.
            </Typography>
          </Box>

          <Tabs value={tab} onChange={(e, v) => { setTab(v); setError(''); setSuccess(''); }}
            centered sx={{ mb: 3,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)' },
              '& .Mui-selected': { color: '#00e5ff' },
              '& .MuiTabs-indicator': { backgroundColor: '#00e5ff' }
            }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Username" name="username" value={form.username}
              onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00e5ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e5ff' } } }}
            />
            {tab === 1 && (
              <TextField label="Email" name="email" value={form.email}
                onChange={handleChange} fullWidth
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: '#00e5ff' },
                  '&.Mui-focused fieldset': { borderColor: '#00e5ff' } } }}
              />
            )}
            <TextField label="Password" name="password" type="password" value={form.password}
              onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00e5ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e5ff' } } }}
            />
            <Button onClick={tab === 0 ? handleLogin : handleRegister}
              variant="contained" size="large" fullWidth
              sx={{ mt: 1, py: 1.5, background: 'linear-gradient(90deg, #00e5ff, #2979ff)',
                fontWeight: 800, letterSpacing: 2, borderRadius: 3,
                '&:hover': { background: 'linear-gradient(90deg, #2979ff, #00e5ff)' }
              }}>
              {tab === 0 ? 'LOGIN' : 'REGISTER'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}