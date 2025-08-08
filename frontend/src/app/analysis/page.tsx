"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import api from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<{
    summary: string;
    topics: { topic: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const posts = JSON.parse(localStorage.getItem("posts") || "[]");
      const response = await api.post(
        "/analysis/",
        posts,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalysis(response.data);
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
          <CardTitle>AI-Powered Analysis</CardTitle>
          <CardDescription>
            Analyze your scraped Instagram posts to get insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Posts"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {analysis && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Analysis Summary</h2>
              <p>{analysis.summary}</p>
              <h2 className="text-xl font-bold mt-4">Top Topics</h2>
              <BarChart
                width={600}
                height={300}
                data={analysis.topics}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}