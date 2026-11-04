import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatINR } from '@/utils'
import type { PriceHistoryPoint } from '@/types'

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[]
  currentPrice?: number
  lowestPrice?: number
  lowestDate?: string
}

export function PriceHistoryChart({ data, lowestPrice, lowestDate }: PriceHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-white border border-border-light rounded-lg">
        <span className="text-text-muted">No price history data available</span>
      </div>
    )
  }

  // Calculate min/max for Y axis with padding
  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices) * 0.96
  const maxPrice = Math.max(...prices) * 1.04

  const CustomDot = ({ cx, cy, payload, index }: any) => {
    const isLast = index === data.length - 1
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isLast ? 6 : 4}
          fill={isLast ? '#1e62fe' : '#3b82f6'}
          stroke="#ffffff"
          strokeWidth={2}
        />
        {isLast && (
          <>
            <rect
              x={cx - 38}
              y={cy - 28}
              width={76}
              height={20}
              rx={4}
              fill="#0f172a"
            />
            <text
              x={cx}
              y={cy - 14}
              textAnchor="middle"
              fontSize="10"
              fill="#ffffff"
              fontWeight="700"
            >
              {formatINR(payload.value)}
            </text>
          </>
        )}
      </g>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border-light rounded-lg shadow-lg p-3">
          <p className="text-xs text-text-muted font-medium">{label}</p>
          <p className="text-lg font-extrabold text-text-main">{formatINR(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-svg-container h-48 bg-white border border-border-light rounded-lg p-2 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 0 }}
            tickCount={3}
            domain={[minPrice, maxPrice]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="none"
            fillOpacity={1}
            fill="url(#priceGradient)"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1e62fe"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Lowest Price Callout */}
      {(lowestPrice || lowestDate) && (
        <div className="lowest-price-callout mt-4 bg-success-bg border border-success-border rounded-lg p-3 flex items-center justify-between">
          <div className="lowest-callout-text">
            <strong className="text-green-900 text-sm block">Lowest Price Ever</strong>
            <span className="text-lg font-extrabold text-green-800">
              {lowestPrice ? formatINR(lowestPrice) : ''} {lowestDate ? `(${lowestDate})` : ''}
            </span>
          </div>
          <span className="great-deal-tag bg-success text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Great Deal
          </span>
        </div>
      )}
    </div>
  )
}