// ─────────────────────────────────────────────────────────────────────────
// Rosetta content model.
// Single source of truth for the Fivetran + dbt enablement material.
// Framing: one pipeline, two fluencies. Fivetran owns E + L (get data in);
// dbt owns T (model, test, govern); the warehouse is the shared seam.
// Accuracy verified against product knowledge as of early 2026. Where a fact
// is still moving (Fusion GA, merger close, GX integration depth), the copy
// says "in preview" / "announced" / "emerging" rather than overstating.
// ─────────────────────────────────────────────────────────────────────────

export type Owner = "ft" | "dbt" | "seam";

// ── The combined pipeline (home hero) ───────────────────────────────────────
export type Stage = {
  id: string;
  title: string;
  owner: Owner;
  verb: string;
  ftTerm: string;
  dbtTerm: string;
  blurb: string;
  detail: string[];
};

export const STAGES: Stage[] = [
  {
    id: "sources",
    title: "Sources",
    owner: "ft",
    verb: "Originate",
    ftTerm: "Source system",
    dbtTerm: "(upstream of dbt)",
    blurb: "SaaS apps, databases, files, and event streams where data is born.",
    detail: [
      "Operational systems: Salesforce, NetSuite, Postgres, MySQL, S3, Kafka, and hundreds more.",
      "dbt never touches these directly — it assumes the data has already landed in the warehouse.",
      "Fivetran's job starts here: read the source without the customer writing extraction code.",
    ],
  },
  {
    id: "move",
    title: "Move",
    owner: "ft",
    verb: "Extract + Load",
    ftTerm: "Connector / Sync",
    dbtTerm: "(no equivalent)",
    blurb: "Fivetran extracts and loads — managed, schema-aware, incremental.",
    detail: [
      "Log-based CDC for databases; API polling for SaaS apps; file pickup; event ingestion.",
      "Automatic schema-drift handling: new tables and columns propagate without breaking the pipe.",
      "Priced on MAR (Monthly Active Rows) — distinct rows inserted, updated, or deleted in a month, counted once.",
    ],
  },
  {
    id: "warehouse",
    title: "Land + Store",
    owner: "seam",
    verb: "Persist",
    ftTerm: "Destination",
    dbtTerm: "Target (connection profile)",
    blurb: "The warehouse or lake. This is the handshake — both sides touch it.",
    detail: [
      "Snowflake, BigQuery, Databricks, Redshift, or an Iceberg/Delta lake in object storage.",
      "Fivetran WRITES raw tables here. dbt READS them via source() and runs its SQL here.",
      "The seam: a Fivetran connector's output schema is exactly what a dbt source declares.",
    ],
  },
  {
    id: "transform",
    title: "Transform",
    owner: "dbt",
    verb: "Model + Test",
    ftTerm: "Transformations (runs dbt)",
    dbtTerm: "Models / Runs / Tests",
    blurb: "dbt turns raw landed tables into trusted, tested, documented models.",
    detail: [
      "Staging models clean and rename; marts model facts and dimensions for the business.",
      "Tests (unique, not_null, relationships, contracts) enforce that the data is trustworthy.",
      "Runs on the customer's warehouse compute; lineage (the DAG) is derived from ref().",
    ],
  },
  {
    id: "semantic",
    title: "Define",
    owner: "dbt",
    verb: "Govern metrics",
    ftTerm: "(no equivalent)",
    dbtTerm: "Semantic Layer / MetricFlow",
    blurb: "One governed definition of every metric, queried by every tool.",
    detail: [
      "MetricFlow compiles metric definitions into correct SQL on the fly.",
      "Define 'revenue' once, in version control — every dashboard agrees on the number.",
      "Served to BI and AI tools through a governed API (JDBC / GraphQL) — the MetricFlow engine is open source, the hosted serving layer is a dbt Cloud capability.",
    ],
  },
  {
    id: "consume",
    title: "Consume",
    owner: "seam",
    verb: "Activate",
    ftTerm: "Activations / Reverse ETL",
    dbtTerm: "Exposures",
    blurb: "Dashboards, notebooks, AI agents — and data pushed back to operations.",
    detail: [
      "BI tools (Tableau, Power BI, Hex) and AI agents read governed metrics, not raw tables.",
      "Fivetran Activations push modeled data back out to operational SaaS tools (the last mile).",
      "dbt 'exposures' document these downstream consumers; Fivetran physically delivers to them.",
    ],
  },
];

// ── Pillar model (used by both /fivetran and /dbt) ───────────────────────────
export type Pillar = {
  key: string;
  title: string;
  owner: Owner;
  why: string; // "why the other side should care"
  body: string;
  nodes: string[]; // diagram leaf nodes
  flag?: string; // currency / accuracy note
};

export const FIVETRAN_PILLARS: Pillar[] = [
  {
    key: "connectors",
    title: "Connectors",
    owner: "ft",
    why: "Connectors define the shape and freshness of your raw layer — every dbt source and staging model sits downstream of one.",
    body: "A connector is a managed, pre-built integration that extracts from a source and lands it in the destination, fully automated. Fivetran maintains the connector code, adapts to upstream API and schema changes, and handles incremental sync logic so the customer never writes extraction code. The catalog spans 700+ pre-built connectors and continues to grow.",
    nodes: ["Databases (CDC)", "SaaS apps (API)", "Files (S3/SFTP)", "Events / streaming", "Connector SDK (custom)"],
    flag: "Quote a round \"700+\" rather than a precise number — the count moves constantly and an exact figure dates the deck; check the current catalog before quoting. The Connector SDK superseded the older Cloud Functions / \"function connectors\" approach for building custom connectors.",
  },
  {
    key: "destinations",
    title: "Destinations",
    owner: "ft",
    why: "The destination is the boundary. It is the warehouse dbt connects to, and Fivetran's landed schemas become dbt's sources.",
    body: "The target system where Fivetran lands extracted data. One destination can receive many connectors. You provide connection details, choose a schema-naming convention, and authorize network access; Fivetran then manages all DDL — table creation and schema evolution — going forward.",
    nodes: ["Snowflake", "BigQuery", "Databricks", "Redshift", "S3 / Iceberg lake"],
  },
  {
    key: "activations",
    title: "Activations & Transformations",
    owner: "ft",
    why: "This is the literal seam between the two companies — Fivetran Transformations orchestrates dbt Core projects, and can fire them on a sync-aware schedule.",
    body: "Activations (reverse ETL) push modeled data back out from the warehouse into operational SaaS tools — the last mile. Separately, Fivetran Transformations runs dbt Core projects on a schedule, executing the SQL in the customer's destination warehouse, and can trigger a run the moment the upstream connector finishes syncing. It orchestrates dbt; it is not a competing transform engine.",
    nodes: ["Reverse ETL / Activations", "Transformations (runs dbt Core)", "Sync-completion trigger", "Quickstart dbt packages", "dbt Cloud orchestration (overlap)"],
    flag: "Fivetran Transformations and dbt Cloud orchestration overlap, and how they converge is an open post-merger question — not yet decided. Present the sync-completion trigger as something that works today; do not promise a unified roadmap or imply either is being deprecated.",
  },
  {
    key: "deployment",
    title: "Deployment models",
    owner: "ft",
    why: "Deployment mode decides where data physically lives during EL — the same compliance conversation that governs where dbt runs.",
    body: "SaaS (Fivetran-hosted) is the default: all processing happens in Fivetran's cloud, zero customer infrastructure. Hybrid Deployment runs a lightweight Fivetran agent inside the customer's own VPC, so the control plane (scheduling, monitoring, the dashboard) stays in Fivetran's cloud while the data plane — actual record processing — never leaves the customer's network.",
    nodes: ["SaaS (Fivetran-hosted)", "Hybrid Deployment (agent in VPC)", "Control plane (Fivetran cloud)", "Data plane (customer-hosted)"],
    flag: "HVR's high-volume, log-based replication technology was absorbed into Fivetran's database CDC connectors — that is the go-forward path, so frame it as part of the standard CDC story rather than a separate product to sell. Existing HVR deployments still exist; check the account before assuming a migration.",
  },
  {
    key: "security",
    title: "Security & networking",
    owner: "ft",
    why: "What Fivetran hashes or blocks at ingestion is invisible downstream — dbt can only transform the PII that survived the connector's column policy.",
    body: "Private connectivity that never touches the public internet (PrivateLink on AWS / Azure / GCP), SSH and reverse-SSH tunnels for firewalled sources, VPN, or direct connection with IP allow-listing. Column-level controls let you hash PII irreversibly or block columns so they never leave the source. Certifications and attestations include SOC 2 Type II, ISO 27001, and HIPAA; Fivetran also supports GDPR compliance (a regulation, not a certification).",
    nodes: ["PrivateLink (AWS/Azure/GCP)", "SSH / reverse-SSH tunnel", "IP allow-list (direct)", "Column hashing", "Column blocking"],
    flag: "Confirm the current certification list (FedRAMP / HITRUST especially) before quoting to a customer.",
  },
  {
    key: "concepts",
    title: "Core concepts",
    owner: "ft",
    why: "MAR pricing and table/column selection are the two levers that set cost and raw-layer scope — they shape what dbt has to work with.",
    body: "Setup flow: pick source, authenticate, choose destination, set network mode, select schemas/tables/columns, set frequency, run the initial historical sync, then ongoing incremental syncs. Pricing is MAR — Monthly Active Rows — distinct rows inserted/updated/deleted in a month, counted once per table. High-churn tables drive cost; selecting fewer objects reduces it. A re-sync re-reads source history and can temporarily spike MAR — worth knowing before anyone asks to 'just re-pull it.'",
    nodes: ["Historical sync", "Incremental sync", "Re-sync (re-reads history)", "MAR (Monthly Active Rows)", "Schema/table/column selection", "Dashboard / sync health"],
    flag: "Fivetran has iterated pricing packaging — confirm current tiers before quoting.",
  },
];

export const DBT_PILLARS: Pillar[] = [
  {
    key: "editions",
    title: "Core, Cloud & Fusion",
    owner: "dbt",
    why: "Same engine either way — the difference is the managed platform around it (IDE, scheduler, CI, semantic layer serving, RBAC, Mesh). It decides how fast and how governed a customer's transformation layer is, not whether they get \"real\" dbt.",
    body: "dbt Core is the open-source (Apache 2.0) Python CLI — free, DIY, bring your own orchestration. dbt Cloud is the commercial managed platform: hosted IDE, scheduler, CI/CD, semantic layer, RBAC, Mesh, API. The Fusion engine is a ground-up Rust rewrite that adds native SQL comprehension, static analysis, and in-editor error checking — catching mistakes before you pay the warehouse to discover them.",
    nodes: ["dbt Core (OSS, Python CLI)", "dbt Cloud (managed SaaS)", "Fusion engine (Rust)", "SQL comprehension + static analysis", "In-editor live error checking"],
    flag: "Fusion is in preview as of early 2026, not GA; Core feature parity is still being filled in, and Fusion has its own licensing distinct from Core's Apache 2.0.",
  },
  {
    key: "blocks",
    title: "Core building blocks",
    owner: "dbt",
    why: "This is the vocabulary of the transformation layer — name these and you can read any customer's dbt project after Fivetran lands the data.",
    body: "A model is a SELECT statement in a .sql file that dbt materializes as a table or view. Sources declare the raw landed tables (often exactly what a Fivetran connector wrote). ref() wires models together into a dependency graph — the DAG — which gives correct build order and lineage for free. Materializations (view, table, incremental, ephemeral) decide how each model is persisted. Models are SQL templated with Jinja; macros are reusable SQL functions you call across models.",
    nodes: ["Source (raw landed table)", "Staging model", "ref() → DAG", "Materialization type", "Snapshot (SCD2)", "Jinja / macros", "Package"],
  },
  {
    key: "testing",
    title: "Testing & data quality",
    owner: "dbt",
    why: "Moving data fast is worthless if it's wrong — dbt is where 'is this data trustworthy?' gets enforced in code.",
    body: "Generic tests are declarative column assertions (unique, not_null, accepted_values, relationships). Singular tests are custom SQL. Unit tests check model logic against mocked rows. Contracts enforce a model's output schema at build time. This complements Great Expectations, which Fivetran stewards: dbt tests, contracts, and unit tests are first-class, version-controlled quality checks that run inside the transformation DAG; GX is a standalone data-quality and profiling framework that can validate data at any point in the pipeline, including before it reaches dbt. Different locus, not different seriousness.",
    nodes: ["Generic tests (unique / not_null / relationships)", "Singular tests", "Unit tests", "Contracts (schema enforcement)", "Great Expectations layer"],
    flag: "GX integration into the merged platform is emerging — the durable claim is 'Fivetran stewards GX as the data-quality pillar', not a specific shipped integration.",
  },
  {
    key: "semantic",
    title: "Semantic layer & metrics",
    owner: "dbt",
    why: "This is how a customer gets one governed definition of 'revenue' that every BI tool agrees on — the payoff that makes transformed data consumable.",
    body: "Semantic models define entities, dimensions, and measures on top of dbt models. MetricFlow — the metric-compilation engine, itself open source — turns a metric definition into correct SQL on demand, handling joins and time grains. Define a metric once, in version control. The hosted Semantic Layer (a dbt Cloud capability) then serves those metrics over a governed API so downstream tools query the metric — not raw tables — and always get a consistent number.",
    nodes: ["Semantic model (entities/dimensions/measures)", "MetricFlow engine (OSS)", "Governed metric definition", "Semantic Layer serving API (Cloud)", "BI tools (Tableau / Power BI / Hex)"],
    flag: "MetricFlow is open source; the hosted Semantic Layer serving API (JDBC/GraphQL) is a dbt Cloud capability. Keep the distinction — the engine is OSS, the served endpoint is commercial.",
  },
  {
    key: "orchestration",
    title: "Deployment & orchestration",
    owner: "dbt",
    why: "This is the operational counterpart to a Fivetran sync schedule — how transformations get scheduled, tested in CI, and governed across teams.",
    body: "dbt Cloud jobs run dbt build on a schedule or trigger — and can fire right after a Fivetran sync completes. Slim CI builds and tests only the changed models and their downstream dependencies on a pull request. Environments separate dev/staging/prod. dbt Mesh lets large orgs split into governed projects that ref each other, with model access, groups, and versions as guardrails.",
    nodes: ["Cloud job / scheduler", "Slim CI on PR", "Environments (dev/stage/prod)", "dbt Mesh cross-project ref", "Model access / groups / versions", "Auto-generated docs / lineage site"],
  },
  {
    key: "meetsft",
    title: "Where dbt meets Fivetran",
    owner: "seam",
    why: "This is the integrated story to tell — one vendor covering the full path from source system to governed metric.",
    body: "Fivetran lands normalized raw data; a dbt source points at exactly those tables; staging models clean them; marts model them for the business. Fivetran already publishes maintained dbt packages for common connectors (Salesforce, Stripe, NetSuite) that give tested staging and marts with near-zero modeling effort. The combined story: move (Fivetran) → transform, test, govern (dbt) → metrics → activation, with shared lineage.",
    nodes: ["Fivetran connector → raw schema", "dbt source declaration", "Fivetran Transformations (runs dbt)", "Fivetran dbt packages", "Unified lineage (move → transform → metric)"],
    flag: "Deep product unification beyond existing Transformations + dbt packages is roadmap, not shipped. Don't oversell.",
  },
];

// ── Terminology translation table ────────────────────────────────────────────
export type TermPair = {
  ft: string;
  dbt: string;
  note: string;
  gap?: boolean; // true when the two products have no clean cross-mapping (a genuine boundary gap)
};

export const TERMS: TermPair[] = [
  { ft: "Connector", dbt: "Source ( source() )", note: "Fivetran CREATES the raw table; dbt REFERENCES it. The connector's output schema is what dbt declares as a source — same table, opposite ends." },
  { ft: "Sync", dbt: "Run / Build ( dbt build )", note: "A sync moves rows IN; a dbt run transforms rows already there (inbound vs in-place). Note dbt run executes models only, while dbt build also runs tests, snapshots, and seeds in DAG order — prefer build in production." },
  { ft: "Destination", dbt: "Target / connection profile (+ adapter)", note: "Same warehouse, two sides. Fivetran writes TO the destination; dbt's target — in its connection profile — is HOW it connects to and runs on that same warehouse. The adapter (dbt-snowflake, dbt-bigquery) is the separate plugin that speaks that warehouse's SQL dialect." },
  { ft: "Normalized connector schema", dbt: "Staging models ( stg_* )", note: "Fivetran normalizes raw API payloads into typed tables; dbt staging models clean and rename further. Fivetran's dbt packages literally generate these." },
  { ft: "MAR (Monthly Active Rows)", dbt: "Seats + consumption", gap: true, note: "The core pricing-axis mismatch. Fivetran = volume of distinct rows changed. dbt = developers plus run/consumption metering. Don't convert one to the other — explain both." },
  { ft: "Activations / Reverse ETL", dbt: "Exposures", note: "Fivetran activations physically push modeled data back OUT to operational tools. dbt exposures only DOCUMENT downstream consumers; they don't move data." },
  { ft: "Schema-drift handling", dbt: "Schema tests / contracts", note: "Fivetran auto-ADAPTS to upstream schema changes on ingest. dbt ASSERTS and enforces expected schema downstream. Adapt vs enforce — complementary." },
  { ft: "Sync frequency / schedule", dbt: "Job schedule / triggers", note: "Both are 'how often it runs.' Pair them so the two schedules coordinate — the sync should land before the dbt run fires." },
  { ft: "Deployment mode (SaaS / Hybrid)", dbt: "Cloud vs Core", note: "Fivetran's modes = where the MOVEMENT compute runs. dbt's Cloud-vs-Core = whether orchestration is managed or self-run; SQL always executes in the warehouse." },
  { ft: "(moves data; no equivalent)", dbt: "source freshness", gap: true, note: "dbt can CHECK whether source data is fresh but cannot MAKE it fresh — that's Fivetran's job. Teaches the dependency direction explicitly." },
  { ft: "Column blocking / hashing (PII)", dbt: "Grants / meta tags (governance)", note: "Fivetran controls PII at INGEST (block/hash). dbt governs access on MODELED data via grants and tagging. Two different enforcement points." },
  { ft: "Connector logs / sync history", dbt: "run_results.json / artifacts", note: "Both are the observability and audit trail — one for movement, one for transformation. Pair them for the 'how do I debug' conversation." },
  { ft: "Fivetran dbt package (Quickstart)", dbt: "dbt package ( packages.yml )", note: "The clearest existing bridge: Fivetran PUBLISHES dbt packages that customers install. Same artifact, maintained by Fivetran, consumed in dbt. Interoperability predates the merger." },
  { ft: "Transformations (Fivetran-managed)", dbt: "Models ( .sql in models/ )", note: "Fivetran can orchestrate dbt transformations; the transformation logic itself IS dbt models. The overlap zone made concrete." },
];

// ── Day in the life ──────────────────────────────────────────────────────────
export type DayRow = { moment: string; ft: string; dbt: string };

export const DAY: DayRow[] = [
  { moment: "Morning check", ft: "Open the Fivetran dashboard — scan connector health, sync status, MAR consumption. Any failed syncs overnight?", dbt: "Open dbt Cloud run history — did last night's scheduled job pass? Any failed tests or freshness warnings?" },
  { moment: "A new data need", ft: "A team wants Zendesk data. Spin up the connector, authenticate, select tables, set frequency. No extraction code.", dbt: "The Zendesk raw tables appear. Declare them as a source, write staging models, add tests, ref() into a mart." },
  { moment: "Something breaks", ft: "Source API changed a field. Schema drift handled it automatically; review the schema change log and approve.", dbt: "A test fails: not_null on a column that's now sometimes empty. Trace the lineage, fix the model or the test, open a PR." },
  { moment: "Shipping a change", ft: "Adjust column selection to cut MAR on a high-churn table. Change takes effect on the next sync.", dbt: "Open a PR; Slim CI builds only the changed models + downstream, runs their tests, blocks merge if anything fails." },
  { moment: "The handoff", ft: "Confirm the sync lands before the transformation fires — wire the sync-completion trigger to the dbt job so they stay in order.", dbt: "Set the job to run on sync-completion (Fivetran Transformations) so models always build on fresh data." },
  { moment: "What 'done' means", ft: "Data is in the warehouse, reliably, with schema managed and PII handled per policy. The pipe is green.", dbt: "Data is modeled, tested, documented, and a governed metric is live for BI. The number is trustworthy." },
];

// ── Myths ────────────────────────────────────────────────────────────────────
export type Myth = { audience: "Fivetran people" | "dbt people"; myth: string; truth: string };

export const MYTHS: Myth[] = [
  { audience: "Fivetran people", myth: "\"dbt moves data too.\"", truth: "dbt never touches the source. It transforms data already in the warehouse and runs on the customer's own compute." },
  { audience: "Fivetran people", myth: "\"dbt is a GUI tool you click through.\"", truth: "dbt is software engineering applied to SQL: Git, version control, testing, CI/CD, code review. The discipline is the product." },
  { audience: "Fivetran people", myth: "\"The semantic layer is a minor feature.\"", truth: "It's the top of the stack — one governed definition of every metric, consumed by every BI tool and AI agent. Fivetran historically never owned this." },
  { audience: "dbt people", myth: "\"Fivetran is just connectors you babysit.\"", truth: "It's fully managed and schema-aware. The value is in what you DON'T build: drift handling, normalization, zero-maintenance pipelines." },
  { audience: "dbt people", myth: "\"Ingestion and dbt are separate worlds.\"", truth: "dbt sources are very often Fivetran-delivered tables, and Fivetran has published dbt packages for years. They're already adjacent in the stack." },
  { audience: "dbt people", myth: "\"Pricing is per-seat everywhere.\"", truth: "Fivetran prices on MAR — distinct rows changed per month. Adding more developers doesn't change a Fivetran bill; row volume does. Benchmarking 'per user' misses the row-volume world entirely." },
];

// ── Misc shared ──────────────────────────────────────────────────────────────
export const OWNER_LABEL: Record<Owner, string> = { ft: "Fivetran", dbt: "dbt", seam: "Shared" };

// Single source of truth for owner -> visual styling. Used by every component
// that color-codes by owner (pipeline, pillars, charts) so a rebrand or a
// utility rename happens in exactly one place.
export const OWNER_STYLE: Record<Owner, { bar: string; text: string; pill: string; soft: string; dot: string; bg: string; fill: string }> = {
  ft:   { bar: "bar-ft",   text: "text-ft",   pill: "pill--ft",   soft: "bg-ftsoft/50",   dot: "dot--ft",   bg: "bg-ft",   fill: "#2b6ef2" },
  dbt:  { bar: "bar-dbt",  text: "text-dbt",  pill: "pill--dbt",  soft: "bg-dbtsoft/50",  dot: "dot--dbt",  bg: "bg-dbt",  fill: "#ff5c39" },
  seam: { bar: "bar-seam", text: "text-seam", pill: "pill--seam", soft: "bg-seamsoft/50", dot: "dot--seam", bg: "bg-seam", fill: "#0f9e8e" },
};
