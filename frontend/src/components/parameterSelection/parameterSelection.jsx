import React, { useState } from 'react';
import { Slider, TextField, Button, Typography, Box } from '@mui/material';

const Dashboard = () => {
  const [parameters, setParameters] = useState([
    { name: 'Greening', value: 0.2 },
    { name: 'Dry Rot', value: 0.1 },
    { name: 'Wet Rot', value: 0.0 },
    { name: 'Wire Worm', value: 0.0 },
    { name: 'Malformed', value: 0.7 },
    { name: 'Growth Crack', value: 0.1 },
    { name: 'Mechanical Damage 2', value: 0.0 },
    { name: 'Dirt Clod', value: 0.0 },
    { name: 'Stone', value: 0.0 }
  ]);

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

  const handleSubmit = () => {
    console.log('Parameters:', parameters);
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Apply
      </Button>
    </Box>
  );
};

export default Dashboard;
