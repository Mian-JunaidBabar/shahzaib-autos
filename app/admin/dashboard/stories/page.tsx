"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getStoriesAction,
  deleteStoryAction,
} from "@/app/actions/storyActions";
import { toast } from "sonner";

type Story = {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaPublicId: string;
  mediaType: "IMAGE" | "VIDEO";
  isActive: boolean;
  createdAt: Date;
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const result = await getStoriesAction();
      if (result.success && result.data) {
        setStories(result.data as Story[]);
      } else {
        toast.error(result.error || "Failed to load stories");
      }
    } catch {
      toast.error("Failed to load stories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteStoryAction(deleteId);
      if (result.success) {
        toast.success("Story deleted");
        setStories((prev) => prev.filter((s) => s.id !== deleteId));
      } else {
        toast.error(result.error || "Failed to delete");
      }
      setDeleteId(null);
    });
  };

  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stories</h1>
          <p className="text-muted-foreground">
            Manage media gallery content (images and videos).
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/stories/new">
            <Plus className="h-4 w-4 mr-2" /> Add Story
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {search ? "No stories match your search." : "No stories yet."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Media</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                          {story.mediaType === "IMAGE" ? (
                            <Image
                              src={story.mediaUrl}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Film className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {story.title.length > 60
                          ? `${story.title.substring(0, 60)}...`
                          : story.title}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            story.mediaType === "IMAGE"
                              ? "default"
                              : "secondary"
                          }
                          className="gap-1"
                        >
                          {story.mediaType === "IMAGE" ? (
                            <ImageIcon className="h-3 w-3" />
                          ) : (
                            <Film className="h-3 w-3" />
                          )}
                          {story.mediaType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={story.isActive ? "default" : "secondary"}
                        >
                          {story.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(story.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/admin/dashboard/stories/${story.id}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(story.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Story</DialogTitle>
            <DialogDescription>
              This will permanently delete the story and remove the media from
              Cloudinary. This action cannot be undone. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
