'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { TrendingUp } from "lucide-react"
import { useWholeApp } from './AuthContextApi'

const AnalysticsChart = () => {
    const {fetchedUserData} = useWholeApp()
  const userchartdata = fetchedUserData?.user?.mockAttempts
  // Filter out any attempt where the score is null or undefined
  ?.filter(it => it.score != null)
  .map(it => ({
    createdAt: new Date(it.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: it.score
  }));
    console.log(userchartdata)
    const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4ade80",
  },
} 
  return (
    <div className="w-full flex items-center justify-center ">
         <Card  className='dark w-[95%]'>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer dir="ltr" style={{height:'360px'}} className='w-full' config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={userchartdata}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="createdAt"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
            style={{height:'200px'}}
              dataKey="score"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}

export default AnalysticsChart
