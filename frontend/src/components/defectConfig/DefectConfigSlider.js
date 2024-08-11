import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const Input = styled(MuiInput)`
    width: 42px;
`;

export default function DefectConfigSlider({ label = '', description = '', value = 0, onChange }) {
    // Use effect to sync internal state with external value
    React.useEffect(() => {
        setSliderValue(value);
    }, [value]);

    const [sliderValue, setSliderValue] = React.useState(value);

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
        onChange(newValue); // Notify parent of the new value
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value === '' ? 0 : Number(event.target.value);
        setSliderValue(inputValue);
        onChange(inputValue); // Notify parent of the new value
    };

    const handleBlur = () => {
        if (sliderValue < 0) {
            setSliderValue(0);
        } else if (sliderValue > 100) {
            setSliderValue(100);
        }
    };

    return (
        <Box sx={{ width: 750 }}>
            <Grid container alignItems="center" spacing={1}>
                <Grid item>
                    <Typography id="input-slider" gutterBottom>
                        {label}
                    </Typography>
                </Grid>
                <Grid item>
                    <Tooltip title={description} arrow>
                        <IconButton>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={sliderValue}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        size={"medium"}
                        min={0}
                        max={100}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={sliderValue}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
