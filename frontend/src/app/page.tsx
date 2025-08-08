"use client";

import { useEffect, useState } from "react";
import { getHealth } from "../services/api";

export default function Home() {
  const [health, setHealth] = useState({ status: "loading..." });

  useEffect(() => {
    getHealth()
      .then((data) => setHealth(data))
      .catch((err) => setHealth({ status: "error" }));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Minna AI</h1>
      <p className="mt-4">Backend Status: {health.status}</p>
    </main>
  );
}
