import PillarView from "@/components/PillarView";
import { DBT_PILLARS } from "@/lib/content";

export const metadata = { title: "dbt, explained — Rosetta" };

export default function DbtPage() {
  return (
    <PillarView
      side="dbt"
      eyebrow="For Fivetran people"
      title="dbt is the T."
      lede="It turns raw landed tables into trusted, tested, governed models — running on the customer's own warehouse compute. Here are the six pillars a Fivetran person needs, each with why it matters to the combined story."
      pillars={DBT_PILLARS}
    />
  );
}
