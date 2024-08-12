import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Title from '../dashboard/Title';
import DefectConfigSlider from './DefectConfigSlider';
import Button from '@mui/material/Button'; // Import the Button component
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for the success message
import Alert from '@mui/material/Alert'; // Import Alert for the Snackbar content

// Converts camelCase to "Camel Case"
function camelCaseToSentence(camelCaseString) {
    return camelCaseString
        .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}

export default function DefectConfig() {
    const [configData, setConfigData] = React.useState({});
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    React.useEffect(() => {
        // Fetch the config data from the backend
        fetch('http://localhost:8080/defect-config', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }})
            .then((response) => response.json())
            .then((data) => {
                // Filter out fields starting with "_"
                const filteredData = Object.entries(data)
                    .filter(([key]) => !key.startsWith('_'))
                    .reduce((obj, [key, value]) => {
                        // do the conversion
                        obj[key] = Math.round(value * 100);
                        return obj;
                    }, {});

                setConfigData(filteredData);
            })
            .catch((error) => console.error('Error fetching defect config:', error));
    }, []);

    const handleSliderChange = (key, newValue) => {
        // Update the state with the new value
        setConfigData((prevData) => ({
            ...prevData,
            [key]: newValue, // Value is already in the 0-100 range
        }));
    };

    const handleApplyClick = () => {
        // Prepare the data for POST request
        const postData = Object.entries(configData).reduce((obj, [key, value]) => {
            obj[key] = value / 100; // Convert back to 0-1 range
            return obj;
        }, {});

        // Send POST request to update the backend
        fetch('http://localhost:8080/defect-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(postData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Defect config updated:', data);
                setOpenSnackbar(true); // Show the success message
                setTimeout(() => setOpenSnackbar(false), 3000); // Hide after 3 seconds
            })
            .catch((error) => console.error('Error updating defect config:', error));
    };

    const descriptions = {
        greening: 'Proportion of greening accepted on tuber.',
        dryRot: 'Proportion of dry rot accepted on tuber.',
        wetRot: 'Wet rot is just yes/no value.',
        wireWorm: 'Proportion of wire worm accepted on tuber.',
        malformed: 'Proportion of growth accepted on tuber.',
        growthCrack: 'Proportion of growth accepted on tuber.',
        mechanicalDamage: 'Proportion of mechanical damage accepted on tuber.',
        dirtClod: 'Dirt Clod is just yes/no value.',
        stone: 'Stone is just yes/no value.',
    };

    return (
        <React.Fragment>
            <Title>Defect Configs</Title>
            <Table size="small">
                <TableBody>
                    {Object.entries(configData).map(([key, value]) => (
                        <TableRow key={key}>
                            <DefectConfigSlider
                                label={camelCaseToSentence(key)}  // Convert camelCase to sentence
                                description={descriptions[key] || 'Description'}
                                value={value}
                                onChange={(newValue) => handleSliderChange(key, newValue)}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button
                variant="contained"
                color="primary"
                onClick={handleApplyClick}
                sx={{ marginTop: 2 }}
            >
                Apply
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                    Defect configuration updated successfully!
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
