import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Typography, Box, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const mockModels = [
  { _id: '1', name: 'Model 1', description: 'Description for Model 1', isCurrent: false },
  { _id: '2', name: 'Model 2', description: 'Description for Model 2', isCurrent: true },
  { _id: '3', name: 'Model 3', description: 'Description for Model 3', isCurrent: false }
];

const ModelSelection = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);
  const [currentModelName, setCurrentModelName] = useState('');
  const [currentModelDescription, setCurrentModelDescription] = useState('');
  const [loading, setLoading] = useState(false);


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
        setModels(mockModels);
        setSelectedModel(mockModels[0]._id);
        setCurrentModelDescription(mockModels[0].description);
        const currentModel = mockModels.find(model => model.isCurrent === true);
        if (currentModel) {
          setCurrentModelName(currentModel.name);
          setCurrentModelDescription(currentModel.description);
        }
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

  const handleClick = () => {
    console.log("Model changed");
    // handleSubmit logic here after meeting with karevo
  };

  return (
    <div className="model-selection">
      <Box sx={{ width: 400, marginTop: -2, marginLeft: 0, padding: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#ffffff' }}>
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
        <Box display="flex" alignItems="center">
        <Select
          value={selectedModel}
          onChange={handleModelChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {models.map((model) => (
            <MenuItem key={model._id} value={model._id}>
              {model.name}
            </MenuItem>
          ))}
        </Select>
        <Button sx={{ marginLeft: 10 }}
              variant="contained"
              style={{ backgroundColor: '#114511', color: '#ffffff' }}
              onClick={handleClick}
              disabled={loading}
          >
            {loading && <FontAwesomeIcon icon={faSpinner} spin style={{ marginRight: '8px' }} />}
            Apply
          </Button>
        </Box>
        <Typography variant="body1" gutterBottom>
        Description: {currentModelDescription}
        </Typography>
      </Box>
    </div>
  );
};

export default ModelSelection;
