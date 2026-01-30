import { notFound } from "next/navigation";
import { PageTemplate } from "../components/page-templates";
import { getPageByPath } from "../lib/content-service";

export default function HomePage() {
  const page = getPageByPath("home");

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
