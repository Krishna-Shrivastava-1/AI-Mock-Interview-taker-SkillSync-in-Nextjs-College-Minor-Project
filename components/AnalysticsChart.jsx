'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { TrendingUp } from "lucide-react"
import { useWholeApp } from './AuthContextApi'

const AnalysticsChart = () => {
  const { fetchedUserData } = useWholeApp()
  const userchartdata = fetchedUserData?.user?.mockAttempts
    // Filter out any attempt where the score is null or undefined
    ?.filter(it => it.score != null)
    .map(it => {
      if (it.score == null && it.createdAt) {
        return null
      } else {
        return {
          createdAt: new Date(it.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: it.score,
          difficulty: it.questions?.[0]?.difficulty
        }
      }
    });
  // console.log(userchartdata)
  const formattedData = {};
userchartdata?.forEach(ele => {
  const { difficulty, score, createdAt } = ele;

  // Check if an object for this date exists. If not, create it.
  if (!formattedData[createdAt]) {
    formattedData[createdAt] = {
      createdAt: createdAt,
      easyScore: 0,   // Initialize all scores to 0
      mediumScore: 0,
      hardScore: 0
    };
  }

  // Add the current quiz's score to the existing total for that difficulty
  if (difficulty === 'easy') {
    formattedData[createdAt].easyScore += score;
  } else if (difficulty === 'medium') {
    formattedData[createdAt].mediumScore += score;
  } else if (difficulty === 'hard') {
    formattedData[createdAt].hardScore += score;
  }
});
  const formattedChartData = Object.values(formattedData);
  // console.log(formattedChartData)
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
      <Card className='dark w-[95%]'>
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
     <ChartContainer dir="ltr" style={{ height: '360px' }} className='w-full' config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={formattedChartData} // Assuming this now contains the correctly formatted data
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
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent  />}
              />
              {/* Line for Easy scores */}
              <Line
                style={{ height: '200px' }}
                dataKey="easyScore"
                type="natural"
                stroke="#82ca9d" // A distinct green for easy
                strokeWidth={2}
                dot={true}
              />
              {/* Line for Medium scores */}
              <Line
                style={{ height: '200px' }}
                dataKey="mediumScore"
                type="natural"
                stroke="#ffc658" // A distinct orange for medium
                strokeWidth={2}
                dot={true}
              />
              {/* Line for Hard scores */}
              <Line
                style={{ height: '200px' }}
                dataKey="hardScore"
                type="natural"
                stroke="#ff7300" // A distinct red/orange for hard
                strokeWidth={2}
                dot={true}
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
