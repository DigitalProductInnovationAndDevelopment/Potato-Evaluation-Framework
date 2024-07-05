import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slider, TextField, Button, Typography, Box, Select, MenuItem, IconButton, Tooltip, Collapse } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './parameterSelection.css';

const descriptions = [
  'Proportion of greening accepted on tuber.',
  'Proportion of dry rot accepted on tuber.',
  'Wet rot is just yes/no value.',
  'Proportion of wire worm accepted on tuber.',
  'Proportion of growth accepted on tuber.',
  'Proportion of mechanical accepted on tuber.',
  'Proportion of mechanical accepted on tuber.',
  'Dirt Clod is just yes/no value.',
  'Stone is just yes/no value.'
];

const ParameterSelection = () => {
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [presets, setPresets] = useState([]);
  const [currentParameters, setCurrentParameters] = useState({});
  const [infoVisible, setInfoVisible] = useState({});

  useEffect(() => {
    fetchParameters();
  }, []);

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
      const initialPreset = presetKeys[0] || 'dynamic_defekt_proportion_thresholds';
      setSelectedPreset(initialPreset);
      setCurrentParameters(fetchedParameters[initialPreset]);
    } catch (error) {
      console.error('Error fetching parameters:', error);
    }
  };

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

  const handleInfoToggle = (key) => {
    setInfoVisible(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
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
        // Refetch parameters after a successful update
        await fetchParameters();
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
        <Box sx={{ width: 400, marginTop: 8, marginLeft: 0.5, padding: 1, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" style={{ color: '#114511' }}>
            Parameter Selection
          </Typography>
          <Box display="flex" alignItems="center">
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
          <Button sx={{ marginLeft: 10 }}
              variant="contained"
              style={{ backgroundColor: '#114511', color: '#ffffff' }}
              onClick={handleSubmit}
              disabled={loading}
          >
            {loading && <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />}
            {loading ? 'Loading...' : 'Apply'}
          </Button>
          </Box>
          {Object.keys(currentParameters).map((key, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Box display="flex" alignItems="center">
                  <Typography gutterBottom>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Tooltip title="More info">
                    <IconButton onClick={() => handleInfoToggle(key)}>
                      <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#114511'}} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box display="flex" alignItems="center">
                  <Slider
                      value={typeof currentParameters[key] === 'number' ? currentParameters[key] : 0}
                      style={{ color: '#114511', flex: 1,  marginRight: 20 }}
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
                        step: 0.5,
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
                <Collapse in={infoVisible[key]}>
                  <Typography variant="body2" style={{ marginTop: '10px' }}>
                    {descriptions[index]}
                  </Typography>
                </Collapse>
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
