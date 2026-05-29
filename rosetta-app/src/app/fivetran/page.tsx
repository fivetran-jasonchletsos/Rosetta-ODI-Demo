import PillarView from "@/components/PillarView";
import { FIVETRAN_PILLARS } from "@/lib/content";

export const metadata = { title: "Fivetran, explained — Rosetta" };

export default function FivetranPage() {
  return (
    <PillarView
      side="ft"
      eyebrow="For dbt people"
      title="Fivetran is the E and the L."
      lede="It gets data into the warehouse — reliably, schema-aware, with no extraction code. Here are the six pillars a dbt person needs, each with why it matters to the transformation layer downstream."
      pillars={FIVETRAN_PILLARS}
    />
  );
}
