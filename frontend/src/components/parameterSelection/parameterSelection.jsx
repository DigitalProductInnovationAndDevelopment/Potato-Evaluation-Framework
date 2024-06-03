import React, { useState } from 'react';
import { Slider, TextField, Button, Typography, Box } from '@mui/material';

const Dashboard = () => {
  const [parameters, setParameters] = useState([
    { name: 'Parameter 1', value: 50 },
    { name: 'Parameter 2', value: 50 },
    { name: 'Parameter 3', value: 50 }
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
    <Box sx={{ width: 300, margin: 45, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Parameter Selection
      </Typography>
      {parameters.map((param, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
          <Typography gutterBottom>{param.name}</Typography>
          <Slider
            value={typeof param.value === 'number' ? param.value : 0}
            onChange={(event, newValue) => handleSliderChange(index, newValue)}
            aria-labelledby="input-slider"
            min={0}
            max={100}
          />
          <TextField
            value={param.value}
            margin="dense"
            onChange={(event) => handleInputChange(index, event)}
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider'
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
