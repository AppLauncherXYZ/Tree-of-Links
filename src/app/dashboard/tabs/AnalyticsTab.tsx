"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, TrendingUp, Users, MousePointer, Percent } from "lucide-react"
import { getAnalyticsSummary, AnalyticsSummary } from "@/integrations/applauncher/analytics"
import { AnalyticsTabSkeleton } from "@/components/ui/skeleton-loaders"

export function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // TODO: Get actual user ID from auth context
        const userId = "mock-user-id"
        const data = await getAnalyticsSummary(userId)
        setAnalyticsData(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const exportToCSV = () => {
    if (!analyticsData) return

    const csvContent = [
      ["Metric", "Value"],
      ["Total Views", analyticsData.totalViews.toString()],
      ["Unique Visitors", analyticsData.uniqueVisitors.toString()],
      ["Total Clicks", analyticsData.totalClicks.toString()],
      ["Conversion Rate (%)", analyticsData.conversionRate.toFixed(2)],
      [],
      ["Date", "Clicks"],
      ...Object.entries(analyticsData.clicksByDate).map(([date, clicks]) => [date, clicks.toString()]),
      [],
      ["Top Links"],
      ["Title", "Clicks", "CTR (%)"],
      ...analyticsData.topLinks.map(link => [link.title, link.totalClicks.toString(), link.ctr.toFixed(2)])
    ]

    const csvString = csvContent.map(row => row.join(",")).join("\n")
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const formatChartData = () => {
    if (!analyticsData) return []

    return Object.entries(analyticsData.clicksByDate)
      .map(([date, clicks]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  if (loading) {
    return <AnalyticsTabSkeleton />
  }

  if (!analyticsData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Failed to load analytics data</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if analytics data is empty or has no meaningful data
  const hasNoData = !analyticsData ||
    (analyticsData.totalViews === 0 &&
     analyticsData.totalClicks === 0 &&
     analyticsData.uniqueVisitors === 0 &&
     analyticsData.topLinks.length === 0 &&
     Object.keys(analyticsData.clicksByDate).length === 0);

  if (hasNoData) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Link Analytics</h2>
            <p className="text-muted-foreground">
              View clicks, engagement, and performance metrics for your links.
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No Analytics Data Yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Analytics data will appear here once your links start receiving clicks and views.
                  Share your link tree to start collecting data!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Link Analytics</h2>
          <p className="text-muted-foreground">
            View clicks, engagement, and performance metrics for your links.
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2" aria-label="Export analytics data to CSV file">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Clicks Per Day Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks Per Day</CardTitle>
          <CardDescription>
            Daily click performance over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Links</CardTitle>
          <CardDescription>
            Your most clicked links ranked by performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Title</th>
                  <th className="text-right p-2 font-medium">Clicks</th>
                  <th className="text-right p-2 font-medium">CTR</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topLinks.map((link, index) => (
                  <tr key={link.linkId} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {link.url}
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-2 font-medium">
                      {link.totalClicks.toLocaleString()}
                    </td>
                    <td className="text-right p-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {link.ctr.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
