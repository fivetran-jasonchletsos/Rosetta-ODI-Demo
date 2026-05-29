// ─────────────────────────────────────────────────────────────────────────
// Config Builder option model.
// The builder walks left-to-right through a full pipeline: a Fivetran half
// (source → move → destination, with deployment + networking + column policy)
// and a dbt half (transform → test → semantic → schedule). The result is a
// printable spec sheet. Choices filter downstream choices where appropriate.
// ─────────────────────────────────────────────────────────────────────────

export type SourceCategory = {
  id: string;
  label: string;
  method: string; // extraction method implied by category
  connectors: string[];
};

export const SOURCE_CATEGORIES: SourceCategory[] = [
  { id: "db", label: "Database", method: "Log-based CDC", connectors: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB"] },
  { id: "saas", label: "SaaS application", method: "API polling", connectors: ["Salesforce", "HubSpot", "NetSuite", "Zendesk", "Workday"] },
  { id: "file", label: "Files", method: "File pickup", connectors: ["Amazon S3", "Google Drive", "SFTP", "Azure Blob"] },
  { id: "event", label: "Events / streaming", method: "Event ingestion", connectors: ["Kafka", "Kinesis", "Webhooks / Events API"] },
  { id: "custom", label: "Custom", method: "Connector SDK (Python)", connectors: ["Connector SDK source"] },
];

export const DESTINATIONS = [
  "Snowflake",
  "BigQuery",
  "Databricks",
  "Amazon Redshift",
  "S3 / Iceberg lake",
  "PostgreSQL",
];

export type DeploymentMode = { id: string; label: string; plane: string; note: string };
export const DEPLOYMENT_MODES: DeploymentMode[] = [
  { id: "saas", label: "SaaS (Fivetran-hosted)", plane: "Data plane in Fivetran cloud", note: "Default. Zero customer infrastructure; processing happens in Fivetran's cloud." },
  { id: "hybrid", label: "Hybrid Deployment", plane: "Data plane in customer VPC", note: "Lightweight agent in the customer's network; source data never leaves the VPC." },
];

// Networking modes available depend on the source category (e.g. databases
// support the full set incl. reverse SSH; SaaS reaches the source over its
// public API). Deployment mode (SaaS vs Hybrid) is an independent axis and does
// not narrow this list.
export type NetMode = { id: string; label: string };
export const ALL_NET_MODES: NetMode[] = [
  { id: "direct", label: "Direct + IP allow-list" },
  { id: "privatelink", label: "PrivateLink (AWS/Azure/GCP)" },
  { id: "ssh", label: "SSH tunnel" },
  { id: "rssh", label: "Reverse SSH tunnel" },
];

export function netModesFor(categoryId: string): NetMode[] {
  switch (categoryId) {
    case "db":
      return ALL_NET_MODES; // databases support the full set: direct, PrivateLink, SSH, and reverse SSH
    case "saas":
      // most SaaS API connectors reach the source over its public API endpoint
      return ALL_NET_MODES.filter((m) => m.id === "direct");
    case "file":
      return ALL_NET_MODES.filter((m) => m.id === "direct" || m.id === "ssh");
    case "event":
      return ALL_NET_MODES.filter((m) => m.id === "direct" || m.id === "privatelink");
    default:
      return ALL_NET_MODES.filter((m) => m.id === "direct");
  }
}

export const COLUMN_POLICIES = [
  { id: "none", label: "No column policy" },
  { id: "hash", label: "Hash sensitive columns" },
  { id: "block", label: "Block sensitive columns" },
];

export const SYNC_FREQUENCIES = ["1 minute", "5 minutes", "15 minutes", "1 hour", "6 hours", "24 hours"];

// ── dbt half ────────────────────────────────────────────────────────────────
export const MATERIALIZATIONS = [
  { id: "view", label: "view", note: "cheap, always fresh" },
  { id: "table", label: "table", note: "precomputed" },
  { id: "incremental", label: "incremental", note: "only new/changed rows — best for large feeds" },
];

export const TEST_OPTIONS = [
  { id: "not_null", label: "not_null" },
  { id: "unique", label: "unique" },
  { id: "relationships", label: "relationships" },
  { id: "accepted_values", label: "accepted_values" },
  { id: "contract", label: "model contract" },
];

export const SCHEDULE_OPTIONS = [
  { id: "sync", label: "Run on Fivetran sync completion", note: "Transformations fire the moment fresh data lands." },
  { id: "cron", label: "Scheduled (cron)", note: "Independent dbt Cloud job on a fixed schedule." },
  { id: "ci", label: "On pull request (Slim CI)", note: "Build + test only changed models on every PR." },
];

export const SEMANTIC_OPTIONS = [
  { id: "yes", label: "Define governed metrics", note: "MetricFlow exposes one definition to every BI tool." },
  { id: "no", label: "Marts only", note: "Stop at modeled tables; no semantic layer." },
];
