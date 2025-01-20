import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PopulationData {
  year: number;
  population: number;
  prefecture: string;
}

interface PopulationChartProps {
  chartData: PopulationData[];
  selectedPrefectures: string[];
}

const PopulationChart: React.FC<PopulationChartProps> = ({ chartData, selectedPrefectures }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={Object.values(
          chartData.reduce((acc, { year, population, prefecture }) => {
            if (!acc[year]) {
              acc[year] = { year };
            }
            acc[year][prefecture] = population;
            return acc;
          }, {} as Record<number, { year: number } & Record<string, number>>)
        )}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {selectedPrefectures.map((prefecture) => (
          <Line
            key={prefecture}
            type="monotone"
            dataKey={prefecture}
            name={prefecture}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PopulationChart;
