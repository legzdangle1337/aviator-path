import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatePost, useCommunityCategories } from "@/hooks/useCommunity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PenLine, X } from "lucide-react";

const postSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().trim().max(5000).optional(),
  category_id: z.string().min(1, "Select a category"),
  link_url: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  defaultCategory?: string;
  onSuccess?: () => void;
}

function detectLinkType(url: string): string | undefined {
  if (!url) return undefined;
  if (url.match(/youtube\.com|youtu\.be/i)) return "youtube";
  if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) return "image";
  return "link";
}

export function CreatePostForm({ defaultCategory, onSuccess }: CreatePostFormProps) {
  const { user } = useAuth();
  const { data: categories } = useCommunityCategories();
  const createPost = useCreatePost();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", body: "", category_id: defaultCategory || "", link_url: "" },
  });

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-3">Sign in to create a post</p>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-lg text-muted-foreground hover:border-primary/30 transition-colors text-left"
      >
        <PenLine className="h-5 w-5 shrink-0" />
        <span>Create a post...</span>
      </button>
    );
  }

  const onSubmit = async (values: PostFormValues) => {
    try {
      await createPost.mutateAsync({
        title: values.title,
        body: values.body || undefined,
        category_id: values.category_id,
        link_url: values.link_url || undefined,
        link_type: values.link_url ? detectLinkType(values.link_url) : undefined,
      });
      toast.success("Post created!");
      form.reset();
      setIsOpen(false);
      onSuccess?.();
    } catch {
      toast.error("Failed to create post");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Create a Post</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What's on your mind?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more detail..." rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createPost.isPending}>
                {createPost.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
