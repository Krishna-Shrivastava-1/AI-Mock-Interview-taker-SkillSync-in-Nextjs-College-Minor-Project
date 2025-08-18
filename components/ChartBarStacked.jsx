"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"


export function ChartBarStacked({userData}) {

      // Medium questions total score
    const mediumMockQuesitonsArr = userData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'medium' || e?.questions?.[0]?.difficulty === 'medium')
    const totalMediumScore = mediumMockQuesitonsArr?.reduce((total, quiz) => {

        return total + (quiz.score ?? 0);
    }, 0);
    // console.log('Total score for medium quizzes:', totalMediumScore);


    // Easy questions total score
    const easyMockQuesitonsArr = userData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'easy' || e?.questions?.[0]?.difficulty === 'easy')
    const totalEasyScore = easyMockQuesitonsArr?.reduce((total, quiz) => {

        return total + (quiz.score ?? 0);
    }, 0);
    // console.log('Total score for medium quizzes:', totalEasyScore);

    // Hard questions total score
    const hardMockQuesitonsArr = userData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'hard' || e?.questions?.[0]?.difficulty === 'hard')
    const totalHardScore = hardMockQuesitonsArr?.reduce((total, quiz) => {

        return total + (quiz.score ?? 0);
    }, 0);
    // console.log('Total score for medium quizzes:', totalHardScore);

    const chartData = [
  { month: "Easy", desktop: easyMockQuesitonsArr?.length, mobile: totalEasyScore },
  { month: "Medium", desktop: mediumMockQuesitonsArr?.length, mobile: totalMediumScore },
  { month: "Hard", desktop: hardMockQuesitonsArr?.length, mobile: totalHardScore },
]

const chartConfig = {
  desktop: {
    label: "Total Question",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Total Score",
    color: "var(--chart-2)",
  },
} 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mock Question Analysis</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart  accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
             
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
