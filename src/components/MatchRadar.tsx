import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

type Point = { name: string; value: number };

export default function MatchRadar({ data }: { data: Point[] }) {
  return <ResponsiveContainer width="100%" height={234}>
    <RadarChart data={data} outerRadius="70%">
      <PolarGrid stroke="var(--line)" />
      <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 10 }} />
      <PolarRadiusAxis domain={[0, 100]} tick={false} />
      <Radar dataKey="value" stroke="#9b8afb" fill="#9b8afb" fillOpacity={0.22} />
      <Tooltip />
    </RadarChart>
  </ResponsiveContainer>;
}
