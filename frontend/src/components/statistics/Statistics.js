import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Statistics = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const goodVsDefectedData = [
        { name: 'Good Potatoes', value: data.good },
        { name: 'Defected Potatoes', value: data.defected.total },
    ];

    const defectedDetailsData = Object.keys(data.defected.details).map((key) => ({
        name: key,
        value: data.defected.details[key],
    }));

    return (
        <div className="statistics">
            <h2>Potato Quality Statistics</h2>
            <div className="charts">
                <div className="chart">
                    <h3>Good vs Defected Potatoes</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={goodVsDefectedData}
                            cx={200}
                            cy={200}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {goodVsDefectedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
                <div className="chart">
                    <h3>Defected Potatoes Breakdown</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={defectedDetailsData}
                            cx={200}
                            cy={200}
                            outerRadius={150}
                            fill="#82ca9d"
                            dataKey="value"
                            label
                        >
                            {defectedDetailsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Statistics;