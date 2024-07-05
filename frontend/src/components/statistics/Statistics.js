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
        <div className="box">
            <div className="h2" style={{textAlign: "center"}}>Potato Quality Statistics </div>
            <div className="charts mx">
                <div className="chart" style={{marginLeft: "50px"}}>
                    <div className="h3" style={{textAlign: "center"}}>Good/Bad Potatoes</div>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={goodVsDefectedData}
                            cx={150}
                            cy={150}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {goodVsDefectedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
                <div className="chart" style={{marginLeft: "50px"}}>
                    <div className="h3" style={{textAlign: "center"}}>Defected Potatoes</div>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={defectedDetailsData}
                            cx={150}
                            cy={150}
                            outerRadius={120}
                            fill="#82ca9d"
                            dataKey="value"
                            label
                        >
                            {defectedDetailsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Statistics;