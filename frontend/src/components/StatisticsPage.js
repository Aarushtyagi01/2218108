import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Log } from '../utils/log';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function StatisticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError('');
      try {
        await Log('frontend', 'info', 'api', 'Fetching analytics');
        const res = await axios.get('http://localhost:5000/api/analytics');
        setData(res.data.data || []);
        await Log('frontend', 'info', 'api', 'Fetched analytics successfully');
      } catch (err) {
        setError('Failed to fetch analytics');
        await Log('frontend', 'error', 'api', `Error fetching analytics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener Statistics</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Shortcode</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Expires At</TableCell>
                <TableCell>Total Clicks</TableCell>
                <TableCell>Click Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell><a href={row.shortUrl} target="_blank" rel="noopener noreferrer">{row.shortUrl}</a></TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.originalUrl}</TableCell>
                  <TableCell>{row.shortcode}</TableCell>
                  <TableCell>{row.createdAt ? new Date(row.createdAt).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{row.expiresAt ? new Date(row.expiresAt).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{row.clicks ? row.clicks.length : 0}</TableCell>
                  <TableCell>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>View Clicks</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {row.clicks && row.clicks.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {row.clicks.map((click, cidx) => (
                              <li key={cidx}>
                                {new Date(click.timestamp).toLocaleString()} - {click.source || 'unknown'}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Typography>No clicks yet</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default StatisticsPage; 