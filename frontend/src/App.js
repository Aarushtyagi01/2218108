import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ShortenUrlForm from './components/ShortenUrlForm';
import StatisticsPage from './components/StatisticsPage';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import './App.css';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Shorten URLs</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/" element={<ShortenUrlForm />} />
            <Route path="/stats" element={<StatisticsPage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
