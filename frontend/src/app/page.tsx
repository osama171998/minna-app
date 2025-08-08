"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [health, setHealth] = useState({ status: "loading..." });
  const router = useRouter();

  useEffect(() => {
    api
      .get("/health")
      .then((response) => setHealth(response.data))
      .catch((err) => setHealth({ status: "error" }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Minna AI</h1>
      <p className="mt-4">Backend Status: {health.status}</p>
      <Button onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </main>
  );
}
