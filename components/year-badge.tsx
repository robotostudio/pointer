"use client";

import { useEffect, useState } from "react";

export function YearBadge() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return <>{year || "2026"}</>;
}
