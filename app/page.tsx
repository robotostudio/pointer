import { getPageByPath } from "./lib/content-service";
import { PageTemplate } from "./components/page-templates";
import { notFound } from "next/navigation";

export default function HomePage() {
  const page = getPageByPath("home");

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} />;
}
