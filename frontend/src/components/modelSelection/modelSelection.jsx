import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Typography, Box } from '@mui/material';

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);
  const [currentModelName, setCurrentModelName] = useState('');
  const [currentModelDescription, setCurrentModelDescription] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/models', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        setModels(response.data); // Assuming response.data is an array of models

        // Set selectedModel to the _id of the first model
        if (response.data.length > 0) {
          setSelectedModel(response.data[0]._id);
          setCurrentModelDescription(response.data[0].description); // Default to first model's description
        }

        // Find the currently selected model with isCurrent === true
        const currentModel = response.data.find(model => model.isCurrent === true);
        if (currentModel) {
          setCurrentModelName(currentModel.name);
          setCurrentModelDescription(currentModel.description);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = (event) => {
    const selectedModelId = event.target.value;
    setSelectedModel(selectedModelId);
    // Find and set the current model name and description based on selected model _id
    const selectedModel = models.find(model => model._id === selectedModelId);
    if (selectedModel) {
      setCurrentModelName(selectedModel.name);
      setCurrentModelDescription(selectedModel.description);
    }
  };

  return (
    <div className="model-selection">
      <Box sx={{ width: 400, marginTop: 10, marginLeft: 40, padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
        <Typography variant="h8" gutterBottom>
          Currently using model: {currentModelName}
        </Typography>
        
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          style={{ color: '#114511' }}
        >
          Model Selection
        </Typography>
        <Select
          value={selectedModel}
          onChange={handleModelChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{ marginLeft: 'auto' }}
        >
          {models.map((model) => (
            <MenuItem key={model._id} value={model._id}>
              {model.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body1" gutterBottom>
        Description: {currentModelDescription}
        </Typography>
      </Box>
    </div>
  );
};

export default ModelSelection;
