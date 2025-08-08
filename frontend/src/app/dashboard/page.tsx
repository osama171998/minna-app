"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

interface Post {
  caption: string;
  likes: number;
  shares: number;
  viewCount: number;
}

export default function DashboardPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [postLinks, setPostLinks] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  const handleScrapeByDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setPosts([]);
    try {
      if (!startDate || !endDate) {
        setError("Please select a start and end date.");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/instagram/scrape-by-date",
        { start_date: startDate, end_date: endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
      localStorage.setItem("posts", JSON.stringify(response.data));
      setSuccess("Scraping completed successfully!");
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const errorMsg = error.response.data.detail
          .map((d: any) => d.msg)
          .join(", ");
        setError(errorMsg);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeByLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setPosts([]);
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/instagram/scrape-by-links",
        { post_links: postLinks.split("\n") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
      setSuccess("Scraping completed successfully!");
    } catch (error: any) {
      setError(error.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Instagram Post Scraper</CardTitle>
          <CardDescription>
            Scrape your Instagram posts by date range or by providing a list of
            post links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="date">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date">Scrape by Date</TabsTrigger>
              <TabsTrigger value="links">Scrape by Links</TabsTrigger>
            </TabsList>
            <TabsContent value="date">
              <form onSubmit={handleScrapeByDate} className="grid gap-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Scraping..." : "Scrape"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="links">
              <form onSubmit={handleScrapeByLinks} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="post-links">Post Links</Label>
                  <Textarea
                    id="post-links"
                    placeholder="Enter one post link per line"
                    required
                    value={postLinks}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setPostLinks(e.target.value)
                    }
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Scraping..." : "Scrape"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-4">{success}</p>}
          {posts.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Scraped Posts</h2>
              <ul>
                {posts.map((post, index) => (
                  <li key={index} className="mt-2">
                    <p>
                      <strong>Caption:</strong> {post.caption}
                    </p>
                    <p>
                      <strong>Likes:</strong> {post.likes}
                    </p>
                    <p>
                      <strong>Shares:</strong> {post.shares}
                    </p>
                    <p>
                      <strong>Views:</strong> {post.viewCount}
                    </p>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => router.push("/analysis")}
                className="mt-4"
              >
                Analyze Posts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}