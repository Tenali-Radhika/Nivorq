"""
Pre-loaded Enterprise Knowledge Assets for Nivorq
Simulates multi-departmental corporate data spanning Engineering, Executive Strategy, Compliance, Customer Success, and Operations.
"""

SAMPLE_DOCUMENTS = [
    {
        "id": "doc-titan-arch-01",
        "title": "Project Titan: Agentic Microservices Architecture Specification",
        "category": "Engineering & Architecture",
        "author": "Dr. Elena Vance (Chief AI Architect)",
        "date": "2026-09-15",
        "summary": "Technical architecture detailing Vertex AI Agent Engine integration, Google Cloud Run autoscaling, RAG pipelines, and sub-second agent response SLAs.",
        "content": """# Project Titan: Enterprise Autonomous Agent Architecture Specification
Author: Dr. Elena Vance, Chief AI Architect
Classification: Internal Confidential
Target Deployment: Google Cloud Run (Serverless Container Runtime) & Vertex AI

## 1. Executive Summary & Architectural Goals
Project Titan defines the unified agentic substrate for Nivorq's enterprise operations. The primary goal is reducing human cognitive load in information synthesis from hours to seconds while maintaining verifiable 99.4% factual ground-truth compliance.

Key engineering targets:
- Sub-800ms end-to-end P95 retrieval latency across 500,000+ vector indexed enterprise chunks.
- Native multi-agent collaboration leveraging Google's Agent Development Kit (ADK) and Vertex AI Agent Engine.
- Dynamic orchestration between Gemini 3.8 Flash (for high-velocity real-time tool calling and semantic routing) and Gemini 3.1 Pro (for deep multi-document synthesis and strategic risk modeling).
- Zero-Trust telemetry logging streamed asynchronously into Google BigQuery for compliance and productivity auditing.

## 2. Multi-Agent Delegation Protocol
The orchestration runtime implements a hierarchical supervisor pattern:
1. **Supervisor Orchestrator**: Parses user intent into decomposed execution DAGs (Directed Acyclic Graphs). It evaluates complexity, routing lightweight queries directly to Flash and complex analytical tasks to Pro.
2. **Retrieval & RAG Specialist**: Executes hybrid search combining dense semantic embeddings (Vertex AI Vector Search / text-embedding-004) with sparse BM25 lexical matching to capture exact acronyms and legal clauses.
3. **Synthesis & Verification Critic**: Performs bidirectional verification. Every factual statement generated in an answer must correspond to a high-confidence citation token pointing to exact source chunk IDs.
4. **Action & Workflow Executor**: Converts synthesized insights into machine-executable actions (Jira sprint tickets, Slack broadcasts, Calendar invites, or CRM update payloads).

## 3. Cloud Infrastructure & Autoscaling
The system runs on Google Cloud Run configured with:
- Min instances: 2 (zero cold-start latency for executive requests).
- Max instances: 64 (handles burst load during all-hands meetings and earnings cycles).
- Concurrency: 80 requests per container.
- Memory: 2 GiB per instance with 2 vCPUs.
- Secret Management: Google Cloud Secret Manager for Gemini API credentials and OAuth tokens.
"""
    },
    {
        "id": "doc-board-minutes-02",
        "title": "Executive Leadership & Board Q3 Strategy Meeting Minutes",
        "category": "Executive Strategy",
        "author": "Marcus Sterling (Chief of Staff)",
        "date": "2026-10-02",
        "summary": "Comprehensive minutes from Q3 Executive Review covering $2.4M budget reallocation to agentic AI, Singapore expansion, and explicit action items.",
        "content": """# Executive Leadership & Board Q3 Strategy Meeting Minutes
Date: October 2, 2026 | Location: San Francisco & Virtual (Hybrid)
Attendees:
- Sarah Lin (Chief Executive Officer)
- David Zhao (Chief Financial Officer)
- Dr. Elena Vance (Chief AI Architect / VP Engineering)
- Priya Patel (VP Global Customer Success)
- Marcus Sterling (Chief of Staff - Facilitator)

## 1. Key Discussion Points & Strategic Review
1. **Productivity Bottlenecks**: Sarah Lin highlighted that internal engineering and customer success teams spend an estimated 28% of their weekly capacity manually searching siloed documents and summarizing meetings across Slack, Google Drive, and Jira.
2. **AI Modernization Program**: Elena Vance demonstrated the Nivorq autonomous copilot prototype. Benchmark tests showed a 64% reduction in decision-brief preparation time.
3. **APAC Expansion & Singapore Finale**: David Zhao confirmed the company has been selected as an AI Builder Cup 2026 Finalist. Two executive representatives will travel to Singapore for the Grand Finale on December 4, 2026.

## 2. Decisions Reached
- **Decision 01 [APPROVED]**: Reallocate $2.4M from legacy enterprise search maintenance into the Nivorq Autonomous Agent Program on Google Cloud Run.
- **Decision 02 [APPROVED]**: Mandate SOC-2 Type II and Singapore PDPA compliance audit before Q4 end.
- **Decision 03 [DEFERRED]**: Immediate replacement of third-party CRM; postponed to Q1 2027 pending AI workflow integration results.

## 3. Explicit Action Items & Assigned Owners
1. **Elena Vance**: Finalize Cloud Run production containerization and achieve sub-1s streaming latency by October 25, 2026. Priority: CRITICAL.
2. **Priya Patel**: Roll out pilot agent workflow to the top 20 Enterprise accounts by November 10, 2026. Priority: HIGH.
3. **David Zhao**: Submit Q4 revised financial forecast reflecting Cloud Run cost savings ($340,000/year) by October 22, 2026. Priority: MEDIUM.
4. **Marcus Sterling**: Coordinate travel logistics and demo materials for the Singapore Grand Finale team by November 15, 2026. Priority: HIGH.
"""
    },
    {
        "id": "doc-compliance-soc2-03",
        "title": "Enterprise Security, SOC-2 Type II & Data Residency Standard",
        "category": "Compliance & Security",
        "author": "Rachel Green (Chief Information Security Officer)",
        "date": "2026-08-20",
        "summary": "Mandatory corporate data governance framework detailing customer data isolation, AES-256 encryption, BigQuery audit retention, and zero-training guarantees.",
        "content": """# Enterprise Security & Compliance Standard (SEC-2026-V4)
Author: Office of the CISO & Data Governance Committee
Applicability: All Nivorq AI Services, APIs, and Google Cloud Deployments
Standard: SOC 2 Type II, ISO 27001:2022, Singapore PDPA, and EU GDPR

## 1. Data Residency & Processing Guarantees
All enterprise queries, ingested documents, and generated embeddings processed through Nivorq must adhere to strict zero-training terms:
- **No Model Training on Customer Data**: Customer prompts, uploaded documents, and generated outputs are NEVER utilized to train public foundation models. API integration uses enterprise-tier Vertex AI and Gemini with zero-data-retention guarantees.
- **Regional Isolation**: Customer data must reside strictly in specified Google Cloud zones (default: `us-central1` or `asia-southeast1` for Singapore/APAC accounts).
- **Encryption Standards**: All data at rest is encrypted using customer-managed encryption keys (CMEK) via Google Cloud KMS with AES-256. All communications enforce TLS 1.3.

## 2. Role-Based Access Control (RBAC) & Vector Search Filtering
- Ingested enterprise documents inherit granular access labels: `PUBLIC`, `INTERNAL_CONFIDENTIAL`, `RESTRICTED_EXECUTIVE`, and `LEGAL_PRIVILEGED`.
- The RAG Vector Retriever injects mandatory filter tags into every vector search query matching the authenticated user's security token. Unauthorized chunks are pruned pre-inference.

## 3. Telemetry & BigQuery Audit Trails
Every agent execution generates a cryptographically signed audit envelope containing:
- Timestamp (UTC)
- User pseudonymized identifier
- Referenced chunk IDs and document hashes
- Output safety scores and toxicity scores (guaranteed < 0.01)
- Retention: Telemetry logs are stored in partitioned Google BigQuery tables for 365 days for SOC 2 Type II compliance.
"""
    },
    {
        "id": "doc-customer-success-04",
        "title": "Enterprise Customer Success & Retention Performance Q3",
        "category": "Customer Success & Operations",
        "author": "Priya Patel (VP Global Customer Success)",
        "date": "2026-10-10",
        "summary": "Quarterly operational report on 118% Net Revenue Retention, key pilot feedback, time-to-value metrics, and customer requests for automated workflow cards.",
        "content": """# Enterprise Customer Success & Retention Review (Q3 2026)
Prepared by: Priya Patel, VP Global Customer Success
Target Audience: Executive Committee

## 1. Portfolio Health & Core Metrics
- **Net Revenue Retention (NRR)**: Reached 118.4% in Q3, up 4.2% quarter-over-quarter.
- **Gross Revenue Retention (GRR)**: 96.8%.
- **Average Time-to-Value (TTV)**: Dropped from 21 days to 3.8 days after introducing one-click document ingestion and pre-indexed corporate playbooks.
- **Enterprise Copilot NPS**: Scored +68 among 4,200 active enterprise trial users.

## 2. Customer Feedback Highlights & Voice of Customer
- **Financial Services Tier 1 Bank**: Praised the exact citation highlighting capability. Quote: "Auditors accept Nivorq answers because every claim links directly to the regulatory clause."
- **Global Tech Scale-up**: Requested deeper Jira and Linear integrations so meeting action items automatically spawn sprint epics and assignee notifications.
- **Logistics Multinationals**: Requested multi-language support (English, Mandarin, Japanese, German) for cross-border supply chain documentation.

## 3. Churn Risk Factors & Mitigations
- Three enterprise accounts cited concern over "hallucinations in legal contracts".
- **Mitigation Implemented**: Deployed the Two-Phase Verification Critic Agent which cross-checks every answer against source chunks and computes a Grounding Confidence Score. If confidence is below 85%, the system prompts the user with warnings or flags unverified clauses.
"""
    },
    {
        "id": "doc-runbook-playbook-05",
        "title": "Autonomous Agent Deployment Runbook & Incident Protocols",
        "category": "Operations & SRE",
        "author": "Kenji Sato (Lead DevOps & SRE)",
        "date": "2026-09-28",
        "summary": "Production runbook for Google Cloud Run container deployment, circuit breakers, fallback mock handlers, and automated recovery procedures.",
        "content": """# Nivorq Autonomous Agent Deployment Runbook (SRE-OPS-09)
Author: Kenji Sato, Lead DevOps Engineer
Target Platform: Google Cloud Run & Artifact Registry

## 1. Automated Health Checking & Circuit Breakers
- **Endpoint**: `/api/health` must return HTTP 200 with vector index status and active Gemini model telemetry.
- **Circuit Breakers**: If Gemini API returns HTTP 429 (Rate Limit Exceeded) or 503 (Model Overloaded), the system trips the Circuit Breaker:
  - Step 1: Exponential backoff retry with jitter (100ms, 400ms, 1200ms).
  - Step 2: Automatic graceful degradation to Gemini Flash fallback tier.
  - Step 3: Emit high-priority metric alert to Google Cloud Monitoring dashboard.

## 2. Cloud Run Deployment Command Guide
To deploy new container builds to Google Cloud Run:
```bash
gcloud builds submit --tag gcr.io/nivorq-enterprise-ai/nivorq-app:latest
gcloud run deploy nivorq-service \\
  --image gcr.io/nivorq-enterprise-ai/nivorq-app:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars="ENV=production,GEMINI_MODEL=gemini-2.5-flash"
```

## 3. Human-in-the-Loop Escalation Rules
- When an action item generated by the Workflow Agent involves financial commitments greater than $50,000 or personnel changes, the card is marked with `REQUIRES_HUMAN_APPROVAL` and cannot auto-execute via webhooks until an authorized human user signs off.
"""
    }
]
