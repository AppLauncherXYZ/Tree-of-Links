"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinksTab } from "./tabs/LinksTab"
import { AnalyticsTab } from "./tabs/AnalyticsTab"
import { ThemeTab } from "./tabs/ThemeTab"
import { PaymentsTab } from "./tabs/PaymentsTab"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage your links, analytics, theme, and payments.
        </p>
      </div>

      <Tabs defaultValue="links" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="links" className="text-xs sm:text-sm">Links</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="theme" className="text-xs sm:text-sm">Theme</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <LinksTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <ThemeTab />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
