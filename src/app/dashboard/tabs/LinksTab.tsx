"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LinksTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Links</CardTitle>
          <CardDescription>
            Create and organize your link tree for easy sharing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Your links will appear here. Start by creating your first link.
            </div>
            <Button>Create New Link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
