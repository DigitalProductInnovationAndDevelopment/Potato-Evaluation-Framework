import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, axisClasses } from '@mui/x-charts';
import Title from '../dashboard/Title';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

function createData(label, value) {
    return { label, value };
}

export default function TrackingHistory() {
    const theme = useTheme();
    const [potatoData, setPotatoData] = useState([]);
    const [otherData, setOtherData] = useState([]);

    useEffect(() => {
        // Fetch the latest tracking history data from the backend
        const fetchTrackingHistory = async () => {
            try {
                const response = await axios.get('http://localhost:8080/tracking-history/latest', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const history = response.data[0];

                // Map the response data for the first bar chart (Good Potatoes and Bad Potatoes)
                const potatoChartData = [
                    createData('Good Potatoes', history.goodPotatoes),
                    createData('Bad Potatoes', history.badPotatoes),
                ];

                // Map the response data for the second bar chart (other data)
                const otherChartData = [
                    createData('Greening', history.greening),
                    createData('Dry Rot', history.dryRot),
                    createData('Wet Rot', history.wetRot),
                    createData('Wire Worm', history.wireWorm),
                    createData('Malformed', history.malformed),
                    createData('Growth Crack', history.growthCrack),
                    createData('Mechanical Damage', history.mechanicalDamage),
                    createData('Dirt Clod', history.dirtClod),
                    createData('Stone', history.stone),
                ];

                setPotatoData(potatoChartData);
                setOtherData(otherChartData);
            } catch (error) {
                console.error('Error fetching tracking history:', error);
            }
        };

        fetchTrackingHistory();
    }, []);

    return (
        <React.Fragment>
            <Title>Tracking History</Title>

            <Grid container spacing={2}>
                {/* First Bar Chart: Good Potatoes and Bad Potatoes */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 1,  // Reduced padding to fit within the height constraint
                            display: 'flex',
                            flexDirection: 'column',
                            height: 150,  // Adjusted height to fit within the parent container
                        }}
                    >
                        <BarChart
                            dataset={potatoData}
                            margin={{
                                top: 8,
                                right: 8,
                                left: 40,
                                bottom: 20,
                            }}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    dataKey: 'label',
                                    tickNumber: potatoData.length,
                                    tickLabelStyle: theme.typography.body2,
                                },
                            ]}
                            yAxis={[
                                {
                                    label: 'Count',
                                    labelStyle: {
                                        ...theme.typography.body1,
                                        fill: theme.palette.text.primary,
                                    },
                                    tickLabelStyle: theme.typography.body2,
                                    tickNumber: 3,
                                },
                            ]}
                            series={[
                                {
                                    dataKey: 'value',
                                    color: theme.palette.primary.light,
                                },
                            ]}
                            sx={{
                                [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                                [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                                    transform: 'translateX(-20px)',
                                },
                            }}
                        />
                    </Paper>
                </Grid>

                {/* Second Bar Chart: Other Data */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 1,  // Reduced padding to fit within the height constraint
                            display: 'flex',
                            flexDirection: 'column',
                            height: 150,  // Adjusted height to fit within the parent container
                        }}
                    >
                        <BarChart
                            dataset={otherData}
                            margin={{
                                top: 8,
                                right: 8,
                                left: 40,
                                bottom: 20,
                            }}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    dataKey: 'label',
                                    tickNumber: otherData.length,
                                    tickLabelStyle: theme.typography.body2,
                                },
                            ]}
                            yAxis={[
                                {
                                    label: 'Count',
                                    labelStyle: {
                                        ...theme.typography.body1,
                                        fill: theme.palette.text.primary,
                                    },
                                    tickLabelStyle: theme.typography.body2,
                                    tickNumber: 3,
                                },
                            ]}
                            series={[
                                {
                                    dataKey: 'value',
                                    color: theme.palette.secondary.light,
                                },
                            ]}
                            sx={{
                                [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
                                [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
                                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                                    transform: 'translateX(-20px)',
                                },
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
