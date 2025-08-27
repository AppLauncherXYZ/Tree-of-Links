"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PaymentsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
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
