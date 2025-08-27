"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, GripVertical, Trash2, ExternalLink, Star } from "lucide-react"
import { Link, listLinks, createLink, updateLink, deleteLink, reorderLinks, AVAILABLE_ICONS } from "@/integrations/applauncher/links"
import { LinksTabSkeleton } from "@/components/ui/skeleton-loaders"

export function LinksTab() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    isPremium: false,
    icon: "globe"
  })

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      setIsLoading(true)
      const fetchedLinks = await listLinks()
      setLinks(fetchedLinks)
    } catch (error) {
      toast.error("Failed to load links")
      console.error("Error loading links:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required")
      return
    }

    try {
      setIsSubmitting(true)
      const newLink = await createLink({
        ...formData,
        isVisible: true,
        order: links.length,
      })

      setLinks([...links, newLink])
      setFormData({ title: "", url: "", isPremium: false, icon: "globe" })
      setIsDialogOpen(false)
      toast.success("Link created successfully")
    } catch (error) {
      toast.error("Failed to create link")
      console.error("Error creating link:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLink = async (id: string, updates: Partial<Link>) => {
    try {
      const updatedLink = await updateLink(id, updates)
      setLinks(links.map(link => link.id === id ? updatedLink : link))
      toast.success("Link updated successfully")
    } catch (error) {
      toast.error("Failed to update link")
      console.error("Error updating link:", error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id)
      setLinks(links.filter(link => link.id !== id))
      toast.success("Link deleted successfully")
    } catch (error) {
      toast.error("Failed to delete link")
      console.error("Error deleting link:", error)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local state immediately for smooth UX
    setLinks(items)

    // Update order in backend
    try {
      await reorderLinks(items.map(link => link.id))
      toast.success("Links reordered successfully")
    } catch (error) {
      toast.error("Failed to reorder links")
      console.error("Error reordering links:", error)
      // Revert the change on error
      loadLinks()
    }
  }

  if (isLoading) {
    return <LinksTabSkeleton />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Your Links</CardTitle>
              <CardDescription>
                Create and organize your link tree for easy sharing.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button aria-label="Add new link">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateLink}>
                  <DialogHeader>
                    <DialogTitle>Add New Link</DialogTitle>
                    <DialogDescription>
                      Create a new link for your link tree.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="title" className="sm:text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="sm:col-span-3"
                        placeholder="Link title"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="url" className="sm:text-right">
                        URL
                      </Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="sm:col-span-3"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="icon" className="sm:text-right">
                        Icon
                      </Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger className="sm:col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_ICONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 sm:items-center gap-2 sm:gap-4">
                      <Label htmlFor="premium" className="sm:text-right">
                        Premium
                      </Label>
                      <div className="sm:col-span-3 flex items-center space-x-2">
                        <Switch
                          id="premium"
                          checked={formData.isPremium}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                        />
                        <Label htmlFor="premium">Premium link</Label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? "Creating..." : "Create Link"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-muted-foreground mb-4">
                You don't have any links yet. Create your first link to get started.
              </div>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {links.map((link, index) => (
                      <Draggable key={link.id} draggableId={link.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div {...provided.dragHandleProps} className="cursor-grab flex items-center sm:flex-shrink-0" aria-label="Drag to reorder link">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <div className="flex-1 space-y-2 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h3 className="font-medium truncate">{link.title}</h3>
                                    <div className="flex items-center gap-2">
                                      {link.isPremium && (
                                        <Badge variant="secondary" className="text-xs">
                                          <Star className="mr-1 h-3 w-3" />
                                          Premium
                                        </Badge>
                                      )}
                                      {!link.isVisible && (
                                        <Badge variant="outline" className="text-xs">Hidden</Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{link.url}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:flex-shrink-0">
                                  <Select
                                    value={link.icon}
                                    onValueChange={(value) => handleUpdateLink(link.id, { icon: value })}
                                  >
                                    <SelectTrigger className="w-full sm:w-32" aria-label={`Select icon for ${link.title}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {AVAILABLE_ICONS.map((icon) => (
                                        <SelectItem key={icon} value={icon}>
                                          {icon}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor={`premium-${link.id}`} className="text-sm whitespace-nowrap">
                                      Premium
                                    </Label>
                                    <Switch
                                      id={`premium-${link.id}`}
                                      checked={link.isPremium}
                                      onCheckedChange={(checked) => handleUpdateLink(link.id, { isPremium: checked })}
                                    />
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor={`visible-${link.id}`} className="text-sm whitespace-nowrap">
                                      Visible
                                    </Label>
                                    <Switch
                                      id={`visible-${link.id}`}
                                      checked={link.isVisible}
                                      onCheckedChange={(checked) => handleUpdateLink(link.id, { isVisible: checked })}
                                    />
                                  </div>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="text-destructive hover:text-destructive flex-shrink-0"
                                    aria-label={`Delete link: ${link.title}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
