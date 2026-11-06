import IndustrialServicePage from "@/components/industrial-service-page";
import { industrialServices } from "@/lib/industrial-services";
import { generatePageMetadata } from "@/lib/seo";

const page = industrialServices["gastronomia"];
export const metadata = generatePageMetadata({
  title: page.title + " — wykonanie i wycena",
  description: page.description,
  path: "/gastronomia",
});
export default function Page() { return <IndustrialServicePage slug="gastronomia" />; }
