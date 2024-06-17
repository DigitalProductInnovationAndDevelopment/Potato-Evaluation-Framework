import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, TextField, Button, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await axios.get('http://localhost:8080/parameters');
        const fetchedParameters = response.data;
        const formattedParameters = Object.keys(fetchedParameters).map((key) => ({
          name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: fetchedParameters[key]
        }));
        setParameters(formattedParameters);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    };

    fetchParameters();
  }, []);

  const handleSliderChange = (index, newValue) => {
    const newParameters = [...parameters];
    newParameters[index].value = newValue;
    setParameters(newParameters);
  };

  const handleInputChange = (index, event) => {
    const newParameters = [...parameters];
    newParameters[index].value = event.target.value === '' ? '' : Number(event.target.value);
    setParameters(newParameters);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMessage('');
    debugger;

    const formattedParameters = {
      dynamic_defekt_proportion_thresholds: parameters.reduce((acc, param) => {
        const key = param.name.toLowerCase().replace(/ /g, '_');
        acc[key] = param.value;
        return acc;
      }, {})
    };

    try {
      const response = await axios.post('http://localhost:8080/parameters/update', formattedParameters, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
      if (response.status === 200) {
        setIsSuccess(true);
        setResponseMessage('Success! Your request was processed.');
      } else if (response.status === 500) {
        setIsSuccess(false);
        setResponseMessage('Error! Server encountered an issue.');
      } else {
        setIsSuccess(false);
        setResponseMessage('Error! Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsSuccess(false);
      setResponseMessage('Error! Something went wrong.');
    } finally {
      setLoading(false);
    }

    // Clear the response message after 6 seconds
    setTimeout(() => {
      setResponseMessage('');
    }, 6000);
  };

  return (
    <Box sx={{ width: 400, marginTop: 10, marginLeft: 40, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Parameter Selection
      </Typography>
      {parameters.map((param, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography gutterBottom>{param.name}</Typography>
          <Slider
            value={typeof param.value === 'number' ? param.value : 0}
            onChange={(event, newValue) => handleSliderChange(index, newValue)}
            aria-labelledby="input-slider"
            step={0.1}
            min={0.0}
            max={1.0}
          />
          <TextField
            value={param.value}
            onChange={(event) => handleInputChange(index, event)}
            inputProps={{
              step: 0.1,
              min: 0.0,
              max: 1.0,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
            style={{
              width: '80px',
              height: '50px',
              margin: '5px',
              color: '#333',
              fontSize: '16px',
            }}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
        {loading && <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />}
        {loading ? 'Loading...' : 'Apply'}
      </Button>
      {responseMessage && (
        <p style={{ color: isSuccess ? 'green' : 'red' }}>{responseMessage}</p>
      )}
    </Box>
  );
};

export default Dashboard;
