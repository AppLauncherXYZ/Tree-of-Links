"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function ThemeTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Customize the appearance of your link tree.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Dark Mode</div>
                <div className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </div>
              </div>
              <Switch />
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Color Schemes</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="justify-start">
                  Default
                </Button>
                <Button variant="outline" className="justify-start">
                  Blue
                </Button>
                <Button variant="outline" className="justify-start">
                  Green
                </Button>
                <Button variant="outline" className="justify-start">
                  Purple
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium">Background Patterns</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start">
                  Solid
                </Button>
                <Button variant="outline" className="justify-start">
                  Gradient
                </Button>
                <Button variant="outline" className="justify-start">
                  Pattern
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
