import React from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Card } from './Card'

export const ChartCard = ({ title, children, className = '' }) => {
  return (
    <Card title={title} className={className}>
      <div className="w-full h-80">
        {children}
      </div>
    </Card>
  )
}

export const LineChartComponent = ({ data, dataKey, xKey, title }) => {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString('fr-FR')} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export const BarChartComponent = ({ data, dataKey, xKey, title }) => {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip formatter={(value) => value.toLocaleString('fr-FR')} />
          <Legend />
          <Bar dataKey={dataKey} fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export const PieChartComponent = ({ data, dataKey, nameKey, title, colors }) => {
  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
  const chartColors = colors || defaultColors

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString('fr-FR')} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
