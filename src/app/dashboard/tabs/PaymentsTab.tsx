"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBillingSummary, createTipSession, createSubscriptionSession } from "@/integrations/applauncher/payments"
import { getCurrentUser } from "@/integrations/applauncher/auth"
import { DollarSign, Users } from "lucide-react"

interface BillingSummary {
  totalEarned: number
  activeSubscribers: number
}

export function PaymentsTab() {
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingTipJar, setCreatingTipJar] = useState(false)
  const [creatingSubscription, setCreatingSubscription] = useState(false)

  useEffect(() => {
    async function loadBillingSummary() {
      try {
        const user = await getCurrentUser()
        if (user) {
          const summary = await getBillingSummary(user.id)
          setBillingSummary(summary)
        }
      } catch (error) {
        console.error("Failed to load billing summary:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBillingSummary()
  }, [])

  const handleConnectBilling = () => {
    // Mock implementation
    alert("Billing connection feature coming soon!")
  }

  const handleCreateTipJar = async () => {
    try {
      setCreatingTipJar(true)
      const user = await getCurrentUser()
      if (user) {
        const tipSession = await createTipSession(user.id)
        // In a real app, this would redirect to the payment processor
        alert(`Tip jar created! Link: ${tipSession.url}`)
      }
    } catch (error) {
      console.error("Failed to create tip jar:", error)
    } finally {
      setCreatingTipJar(false)
    }
  }

  const handleCreateMonthlySubscription = async () => {
    try {
      setCreatingSubscription(true)
      const user = await getCurrentUser()
      if (user) {
        const subscriptionSession = await createSubscriptionSession(user.id)
        // In a real app, this would redirect to the payment processor
        alert(`Monthly subscription created! Link: ${subscriptionSession.url}`)
      }
    } catch (error) {
      console.error("Failed to create subscription:", error)
    } finally {
      setCreatingSubscription(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Billing Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>
            Your total earnings and subscriber count.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Earned</div>
                  <div className="text-2xl font-bold">${billingSummary?.totalEarned.toFixed(2) || "0.00"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Active Subscribers</div>
                  <div className="text-2xl font-bold">{billingSummary?.activeSubscribers || 0}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Management</CardTitle>
          <CardDescription>
            Manage your payment methods and create payment links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleConnectBilling}
              variant="outline"
              className="w-full"
            >
              Connect Billing
            </Button>

            <Button
              onClick={handleCreateTipJar}
              variant="outline"
              className="w-full"
              disabled={creatingTipJar}
            >
              {creatingTipJar ? "Creating..." : "Create Tip Jar Link"}
            </Button>

            <Button
              onClick={handleCreateMonthlySubscription}
              variant="outline"
              className="w-full"
              disabled={creatingSubscription}
            >
              {creatingSubscription ? "Creating..." : "Create Monthly Subscription"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Current Plan</div>
                <div className="text-sm text-muted-foreground">Free Plan</div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Available Plans</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Free</CardTitle>
                    <CardDescription>$0/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Up to 5 links</li>
                      <li>• Basic analytics</li>
                      <li>• Standard themes</li>
                    </ul>
                    <Button className="w-full mt-4" disabled>
                      Current Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pro</CardTitle>
                    <CardDescription>$9/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Unlimited links</li>
                      <li>• Advanced analytics</li>
                      <li>• Custom themes</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Enterprise</CardTitle>
                    <CardDescription>$29/month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Everything in Pro</li>
                      <li>• Custom domain</li>
                      <li>• Priority support</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
