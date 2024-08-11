import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Title from '../dashboard/Title';
import DefectConfigSlider from "./DefectConfigSlider";
import axios from 'axios';

const descriptions = {
    greening: 'Proportion of greening accepted on tuber.',
    dryRot: 'Proportion of dry rot accepted on tuber.',
    wetRot: 'Wet rot is just yes/no value.',
    wireWorm: 'Proportion of wire worm accepted on tuber.',
    malformed: 'Proportion of malformed accepted on tuber.',
    growthCrack: 'Proportion of growth crack accepted on tuber.',
    mechanicalDamage: 'Proportion of mechanical damage accepted on tuber.',
    dirtClod: 'Dirt Clod is just yes/no value.',
    stone: 'Stone is just yes/no value.',
};

export default function DefectConfig() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:8080/defect-config', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setConfig(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <React.Fragment>
            <Title>Defect Configs</Title>
            <Table size="small">
                <TableBody>
                    {config && Object.keys(config).map((key) => (
                        <TableRow key={key}>
                            <DefectConfigSlider
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                description={descriptions[key]}
                                defaultValue={config[key]}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}
