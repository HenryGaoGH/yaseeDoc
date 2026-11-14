import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 150 },
  { name: 'Apr', value: 300 },
];

interface ChartLineProp {
  name: string;
  value: number;
}

export default function ChartLine(props: {
  datas?: ChartLineProp[],
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={ props.datas ?? data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
