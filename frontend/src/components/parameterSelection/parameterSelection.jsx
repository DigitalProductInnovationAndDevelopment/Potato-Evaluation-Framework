import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './parameterSelection.css';


const ParameterSelection = () => {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');



  useEffect(() => {
    const fetchParameters = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/parameters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/parameters/update', formattedParameters, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    }, 5000);
  };

  return (
    <div className="parameter-selection">
    <Box sx={{ width: 400, marginTop: 10, marginLeft: 40, padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
      <Typography
  variant="h6"
  gutterBottom
  fontWeight="bold"
  style={{ color: '#114511' }} // Added style for text color
>
  Parameter Selection
</Typography>
<Select
            value={selectedOption}
            onChange={handleDropdownChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            style={{ marginLeft: 'auto' }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
      {parameters.map((param, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography gutterBottom>{param.name}</Typography>
          <Slider
            value={typeof param.value === 'number' ? param.value : 0}
            style={{ color: '#114511' }}
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
      <Button variant="contained"   style={{ backgroundColor: '#114511', color: '#ffffff' }}
 onClick={handleSubmit} disabled={loading}>
        {loading && <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />}
        {loading ? 'Loading...' : 'Apply'}
      </Button>
      {responseMessage && (
        <p style={{ color: isSuccess ? 'green' : 'red' }}>{responseMessage}</p>
      )}
    </Box>
    </div>
  );
};

export default ParameterSelection;
