import React, { useState } from 'react';
import axios from 'axios';
import { Log } from '../utils/log';
import { Box, Button, Grid, TextField, Typography, Alert, Paper } from '@mui/material';

const MAX_URLS = 5;

const initialUrlState = { url: '', validity: '', shortcode: '' };

function ShortenUrlForm() {
  const [urls, setUrls] = useState(Array(MAX_URLS).fill({ ...initialUrlState }));
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (idx, field, value) => {
    const newUrls = urls.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    setUrls(newUrls);
  };

  const validateInput = ({ url, validity, shortcode }) => {
    try {
      if (!url) return 'URL is required';
      new URL(url); 
      if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) return 'Validity must be a positive integer';
      if (shortcode && !/^[a-zA-Z0-9]{3,20}$/.test(shortcode)) return 'Shortcode must be alphanumeric (3-20 chars)';
      return '';
    } catch {
      return 'Invalid URL format';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    let hasError = false;
    for (let i = 0; i < MAX_URLS; i++) {
        if (!urls[i].url) continue; 
      const err = validateInput(urls[i]);
      if (err) {
        setError(`Row ${i + 1}: ${err}`);
        hasError = true;
        break;
      }
    }
    if (hasError) return;
    try {
      const responses = await Promise.all(urls.map(async ({ url, validity, shortcode }) => {
        if (!url) return null;
        await Log('frontend', 'info', 'api', `User submitted URL: ${url}`);
        const payload = { url };
        if (validity) payload.validity = Number(validity);
        if (shortcode) payload.shortcode = shortcode;
        const res = await axios.post('http://localhost:5000/api/shorten', payload);
        await Log('frontend', 'info', 'api', `Shortened URL received: ${res.data.shortUrl}`);
        return {
          originalUrl: url,
          shortUrl: res.data.shortUrl,
          expiry: res.data.expiry,
          shortcode: res.data.shortcode
        };
      }));
      setResults(responses.filter(Boolean));
    } catch (err) {
      setError('Failed to shorten one or more URLs');
      await Log('frontend', 'error', 'api', `Error shortening URLs: ${err.message}`);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {urls.map((row, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label={`Original URL #${idx + 1}`}
                    value={row.url}
                    onChange={e => handleChange(idx, 'url', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Validity (min)"
                    value={row.validity}
                    onChange={e => handleChange(idx, 'validity', e.target.value)}
                    fullWidth
                    size="small"
                    type="number"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    label="Custom Shortcode"
                    value={row.shortcode}
                    onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Paper>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button variant="contained" color="primary" type="submit">Shorten URLs</Button>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 2 }}>
              <Typography>Original: {res.originalUrl}</Typography>
              <Typography>Short URL: <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">{res.shortUrl}</a></Typography>
              <Typography>Shortcode: {res.shortcode}</Typography>
              <Typography>Expires at: {res.expiry ? new Date(res.expiry).toLocaleString() : 'N/A'}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ShortenUrlForm; 