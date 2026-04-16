import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendChartProps {
  data?: Array<{ day: string; riskScore: number; interactions: number; mood: number }>;
  type?: 'line' | 'bar';
}

const weeklyData = [
  { day: 'Mon', riskScore: 35, interactions: 5, mood: 3 },
  { day: 'Tue', riskScore: 42, interactions: 4, mood: 2 },
  { day: 'Wed', riskScore: 55, interactions: 3, mood: 2 },
  { day: 'Thu', riskScore: 68, interactions: 2, mood: 1 },
  { day: 'Fri', riskScore: 72, interactions: 2, mood: 1 },
  { day: 'Sat', riskScore: 65, interactions: 3, mood: 2 },
  { day: 'Sun', riskScore: 78, interactions: 1, mood: 1 },
];

export const TrendChart = ({ data = weeklyData, type = 'line' }: TrendChartProps) => {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="day" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e2e8f0' }} />
          <Legend />
          <Bar dataKey="riskScore" fill="#f87171" radius={[8, 8, 0, 0]} />
          <Bar dataKey="interactions" fill="#7dd3fc" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
        <XAxis dataKey="day" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Line type="monotone" dataKey="riskScore" stroke="#f87171" strokeWidth={3} dot={{ fill: '#f87171' }} />
        <Line type="monotone" dataKey="mood" stroke="#86efac" strokeWidth={3} dot={{ fill: '#86efac' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
