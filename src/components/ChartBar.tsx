import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

// 原有数据结构
interface ChartBarProp {
  name: string;
  value: number;
  color?: string;
}

// 新增数据结构
interface ChartBarMeasurement {
  label: string;
  measurements: ChartBarProp[];
}

// 默认数据
const defaultData: ChartBarProp[] = [
  { name: 'Flutter', value: 400, color: '#8884d8' },
  { name: 'React', value: 300, color: '#82ca9d' },
  { name: 'Vue', value: 500, color: '#ffc658' },
  { name: 'Angular', value: 200, color: '#ff8042' },
];

interface ChartBarProps {
  datas?: ChartBarProp[];
  data?: ChartBarMeasurement[];
  height?: number;
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088FE',
  '#00C49F',
];

export default function ChartBar({
  datas,
  data,
  height = 300
}: ChartBarProps) {

  // 新数据结构：多系列柱状图
  if (data) {
    const series = Array.from(
      new Set(data.flatMap(item => item.measurements.map(m => m.name)))
    );

    const chartData = data.map(item => {
      const row: Record<string, string | number> = {
        name: item.label
      };

      item.measurements.forEach(m => {
        row[m.name] = m.value;
      });

      return row;
    });

    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {series.map((name, index) => {
            const measurement = data
              .flatMap(item => item.measurements)
              .find(m => m.name === name);

            return (
              <Bar
                key={name}
                dataKey={name}
                name={name}
                fill={measurement?.color ?? COLORS[index % COLORS.length]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // 原有数据结构：单系列柱状图
  const chartData = (datas ?? defaultData).map(item => ({
    name: item.name,
    users: item.value,
    color: item.color ?? '#8884d8'
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="users">
          {chartData.map((item, index) => (
            <Cell key={`cell-${index}`} fill={item.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
