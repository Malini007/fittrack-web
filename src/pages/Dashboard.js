import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, AppBar, Toolbar, IconButton,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Alert, Chip
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API = 'http://localhost:8080/api';

export default function Dashboard({ token, onLogout }) {
  const [stats, setStats] = useState('');
  const [runs, setRuns] = useState([]);
  const [form, setForm] = useState({ routeName: '', distanceKm: '', durationMinutes: '', runDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [statsRes, runsRes] = await Promise.all([
        axios.get(`${API}/runs/stats`, { headers }),
        axios.get(`${API}/runs/history`, { headers })
      ]);
      setStats(statsRes.data.stats);
      setRuns(runsRes.data);
    } catch {
      setError('Failed to load data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLog = async () => {
    try {
      await axios.post(`${API}/runs/log`, form, { headers });
      setSuccess('Run logged successfully! 🏃');
      setForm({ routeName: '', distanceKm: '', durationMinutes: '', runDate: '' });
      setError('');
      fetchData();
    } catch {
      setError('Failed to log run. Check all fields.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/runs/${id}`, { headers });
      fetchData();
    } catch {
      setError('Failed to delete run');
    }
  };

  const parseStats = () => {
    if (!stats) return {};
    const parts = stats.split(' | ');
    return {
      runs: parts[0]?.split(': ')[1],
      distance: parts[1]?.split(': ')[1],
      pace: parts[2]?.split(': ')[1],
      best: parts[3]?.split(': ')[1]
    };
  };

  const s = parseStats();

  const chartData = [...runs].reverse().map(r => ({
    date: r.runDate,
    distance: r.distanceKm,
    pace: parseFloat((r.durationMinutes / r.distanceKm).toFixed(2))
  }));

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#00e5ff' },
      '&.Mui-focused fieldset': { borderColor: '#00e5ff' }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <AppBar position="static" sx={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', boxShadow: 'none' }}>
        <Toolbar>
          <DirectionsRunIcon sx={{ color: '#00e5ff', mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 800, letterSpacing: 2 }}>
            FITTRACK
          </Typography>
          <IconButton onClick={onLogout} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
          {[
            { label: 'Total Runs', value: s.runs, emoji: '🏃' },
            { label: 'Total Distance', value: s.distance, emoji: '📍' },
            { label: 'Avg Pace', value: s.pace, emoji: '⚡' },
            { label: 'Best Run', value: s.best, emoji: '🏆' }
          ].map((stat) => (
            <Card key={stat.label} sx={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{stat.emoji}</Typography>
                <Typography variant="h5" sx={{ color: '#00e5ff', fontWeight: 800 }}>
                  {stat.value || '—'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
          {/* Log Run Form */}
          <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                <AddIcon sx={{ verticalAlign: 'middle', color: '#00e5ff' }} /> Log a Run
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Route Name" value={form.routeName}
                  onChange={e => setForm({ ...form, routeName: e.target.value })}
                  fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                  InputProps={{ style: { color: '#fff' } }} sx={inputSx} />
                <TextField label="Distance (km)" type="number" value={form.distanceKm}
                  onChange={e => setForm({ ...form, distanceKm: e.target.value })}
                  fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                  InputProps={{ style: { color: '#fff' } }} sx={inputSx} />
                <TextField label="Duration (minutes)" type="number" value={form.durationMinutes}
                  onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                  fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                  InputProps={{ style: { color: '#fff' } }} sx={inputSx} />
                <TextField label="Date" type="date" value={form.runDate}
                  onChange={e => setForm({ ...form, runDate: e.target.value })}
                  fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)', shrink: true } }}
                  InputProps={{ style: { color: '#fff' } }} sx={inputSx} />
                <Button onClick={handleLog} variant="contained" size="large" fullWidth
                  sx={{ py: 1.5, background: 'linear-gradient(90deg, #00e5ff, #2979ff)',
                    fontWeight: 800, borderRadius: 3,
                    '&:hover': { background: 'linear-gradient(90deg, #2979ff, #00e5ff)' }
                  }}>
                  LOG RUN 🏃
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                📈 Distance Over Time
              </Typography>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #00e5ff', borderRadius: 8 }}
                      labelStyle={{ color: '#fff' }} itemStyle={{ color: '#00e5ff' }} />
                    <Line type="monotone" dataKey="distance" stroke="#00e5ff" strokeWidth={2} dot={{ fill: '#00e5ff' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)' }}>Log your first run to see the chart!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Run History */}
        <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
              📋 Run History
            </Typography>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Route', 'Distance', 'Duration', 'Pace', 'Date', ''].map(h => (
                      <TableCell key={h} sx={{ color: '#00e5ff', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {runs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', border: 'none' }}>
                        No runs yet. Log your first run! 🏃
                      </TableCell>
                    </TableRow>
                  ) : runs.map(run => (
                    <TableRow key={run.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {run.routeName}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={`${run.distanceKm} km`} size="small"
                          sx={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff' }} />
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {run.durationMinutes} min
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {(run.durationMinutes / run.distanceKm).toFixed(2)} min/km
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {run.runDate}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <IconButton onClick={() => handleDelete(run.id)} sx={{ color: 'rgba(255,100,100,0.7)',
                          '&:hover': { color: '#ff6464' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}