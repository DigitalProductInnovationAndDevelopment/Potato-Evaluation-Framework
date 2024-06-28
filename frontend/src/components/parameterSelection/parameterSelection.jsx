import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './parameterSelection.css';

const ParameterSelection = () => {
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('dynamic_defekt_proportion_thresholds');
  const [presets, setPresets] = useState([]);
  const [currentParameters, setCurrentParameters] = useState({});

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
        setParameters(fetchedParameters);
        const presetKeys = Object.keys(fetchedParameters).filter(key => key.startsWith('preset_'));
        setPresets(presetKeys);
        setCurrentParameters(fetchedParameters['dynamic_defekt_proportion_thresholds']);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    };

    fetchParameters();
  }, []);

  const handleSliderChange = (key, newValue) => {
    setCurrentParameters(prevParams => ({
      ...prevParams,
      [key]: newValue
    }));
  };

  const handleInputChange = (key, event) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    setCurrentParameters(prevParams => ({
      ...prevParams,
      [key]: newValue
    }));
  };

  const handleDropdownChange = (event) => {
    const selectedKey = event.target.value;
    setSelectedPreset(selectedKey);
    setCurrentParameters(parameters[selectedKey]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMessage('');
    const formattedParameters = {
      preset_name: selectedPreset,
      defekt_proportion_thresholds: currentParameters
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/parameters/update', formattedParameters, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setIsSuccess(true);
        setResponseMessage('Success! Your request was processed.');
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

    setTimeout(() => {
      setResponseMessage('');
    }, 5000);
  };

  return (
      <div className="parameter-selection">
        <Box sx={{ width: 400, marginTop: 10, marginLeft: 40, padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: '#114511' }}>
            Parameter Selection
          </Typography>
          <Select
              value={selectedPreset}
              onChange={handleDropdownChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginBottom: 20 }}
          >
            <MenuItem value="dynamic_defekt_proportion_thresholds">
              <em>Dynamic Thresholds</em>
            </MenuItem>
            {presets.map(preset => (
                <MenuItem key={preset} value={preset}>
                  {preset.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MenuItem>
            ))}
          </Select>
          {Object.keys(currentParameters).map((key, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Typography gutterBottom>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Typography>
                <Slider
                    value={typeof currentParameters[key] === 'number' ? currentParameters[key] : 0}
                    style={{ color: '#114511' }}
                    onChange={(event, newValue) => handleSliderChange(key, newValue)}
                    aria-labelledby="input-slider"
                    step={0.1}
                    min={0.0}
                    max={1.0}
                />
                <TextField
                    value={currentParameters[key]}
                    onChange={(event) => handleInputChange(key, event)}
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
          <Button
              variant="contained"
              style={{ backgroundColor: '#114511', color: '#ffffff' }}
              onClick={handleSubmit}
              disabled={loading}
          >
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
