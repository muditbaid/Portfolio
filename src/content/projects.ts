export type Link = { label: string; url: string }

export type CaseFile = {
  id: string
  /** The agent employee who "works" this project on Floor EOD. */
  agent: string
  title: string
  tagline: string
  kind: 'thesis' | 'project' | 'prototype' | 'research'
  problem: string
  built: string[]
  results: string[]
  stack: string[]
  links: Link[]
  /** The performance review the agent got from management. */
  review: string
}

const gh = (repo: string) => `https://github.com/muditbaid/${repo}`

export const projects: CaseFile[] = [
  {
    id: 'symbolic-moe',
    agent: 'ROUTER-7',
    title: 'Symbolic Mixture-of-Experts for harmful language',
    tagline: 'A router decides which LoRA experts read each post',
    kind: 'thesis',
    problem:
      'Harmful speech is multilabel: one post can be hateful, offensive, bullying and threatening at once. Running every specialist model on every post is slow and expensive.',
    built: [
      'A Llama 3.1 skill extractor tags each post with skills from a controlled ontology, sampled several times and consolidated by vote.',
      'A Bernoulli Naive Bayes router reads those skills and picks the top-2 of 4 experts: hate, offense, bullying and threat.',
      'Each expert is a LoRA adapter on one shared Llama 3.1 base. The base loads once, and adapters swap per request.',
      'A FastAPI service and web UI serve the whole pipeline.',
    ],
    results: ['90% post-level accuracy', '40% lower inference cost than running all experts'],
    stack: ['Llama 3.1 8B', 'vLLM', 'LoRA / PEFT', 'Bernoulli NB', 'FastAPI'],
    links: [
      { label: 'Code', url: gh('Skill-Based-Expert-Routing-System-For-Multilabel-Hate-Speech-Detection') },
      {
        label: 'Project page',
        url: 'https://muditbaid.github.io/Skill-Based-Expert-Routing-System-For-Multilabel-Hate-Speech-Detection/',
      },
      { label: 'Web app', url: gh('Expert-Routed-Harmful-Speech-Detection-App') },
    ],
    review: 'Exceeds expectations. Refuses lunch. Has opinions about every ticket.',
  },
  {
    id: 'autocover-lite',
    agent: 'COVERBOT',
    title: 'AutoCover-Lite',
    tagline: 'Five agents write unit tests, and only the useful ones survive',
    kind: 'project',
    problem:
      'LLM-written tests often just run code without checking it. Uber\'s AutoCover (ICSE-SEIP 2026) fixes that with a multi-agent pipeline, but it assumes big paid models.',
    built: [
      'A LangGraph pipeline: Preparer → Generator → Executor → Validator → Fixer.',
      'A test is kept only if it passes in a Docker sandbox, adds coverage or a new scenario, and survives mutation testing.',
      'A fallback router over 9 free-tier LLM APIs, with quota tracking, circuit breakers and caching.',
      'A GitHub Action that opens pull requests with the generated tests.',
    ],
    results: [
      'Line coverage 80.9% → 92.5% vs a single-prompt baseline',
      'Branch coverage 72.4% → 87.5%',
      'Mutation score 56.8% → 74.8% (mean over 9 PyPI modules)',
    ],
    stack: ['LangGraph', 'pytest', 'Docker', 'mutation testing', 'GitHub Actions'],
    links: [
      { label: 'Code', url: gh('AutoCover-Lite') },
      { label: 'First bot PR', url: 'https://github.com/muditbaid/AutoCover-Lite/pull/2' },
    ],
    review: 'Coverage is up. Morale is... covered. Writes 86 drafts to keep one.',
  },
  {
    id: 'ops-copilot',
    agent: 'TRIAGE-9',
    title: 'Agentic operations copilot',
    tagline: 'Multi-agent ticket triage with hybrid RAG and escalation',
    kind: 'project',
    problem: 'Enterprise support tickets wait in a queue while someone hunts for the right runbook.',
    built: [
      'A LangGraph multi-agent copilot that classifies tickets, retrieves runbooks and drafts fixes.',
      'Hybrid retrieval: Qdrant vectors plus BM25, reranked with Cohere Rerank.',
      'High-risk cases escalate to humans through tool calling.',
    ],
    results: [
      '92% routing accuracy on 500 labeled tickets',
      '0.89 faithfulness, 95% escalation precision (DeepEval, LangSmith)',
      'Triage time 25 → 4 minutes',
    ],
    stack: ['LangGraph', 'GPT-4o', 'Claude 3.5 Sonnet', 'Qdrant', 'BM25', 'DeepEval'],
    links: [],
    review: 'Escalates exactly when it should. Has never once said "per my last email".',
  },
  {
    id: 'greengrowth',
    agent: 'GREENGROWTH',
    title: 'GreenGrowth tax workspace',
    tagline: 'An AI-powered tax platform where every number traces to its source',
    kind: 'prototype',
    problem:
      'An AI engineer case study: design an AI tax platform from scratch for taxpayers, business owners and CPA firms, covering ten product challenges.',
    built: [
      'The tax return is the anchor object. Documents, tasks, messages, AI decisions and audit events all link back to it.',
      'Source lineage: any return field traces to the exact box on the W-2 it came from.',
      'AI output is always a suggestion with evidence, uncertainty and a required human decision.',
    ],
    results: ['All 10 case-study challenges implemented and covered by an automated browser test'],
    stack: ['Next.js', 'React 19', 'TypeScript', 'Tailwind'],
    links: [
      { label: 'Live prototype', url: 'https://muditbaid.github.io/AI-Tax-Platform/' },
      { label: 'Code', url: gh('AI-Tax-Platform') },
    ],
    review: 'New hire. Traced the missing stapler to page 2, box 12 of a W-2.',
  },
  {
    id: 'red-teaming',
    agent: 'REDTEAM',
    title: 'Automated LLM red teaming',
    tagline: 'Attacking LLMs on purpose, so users can\'t',
    kind: 'project',
    problem: 'Jailbreaks get found by users in production instead of by the team before launch.',
    built: [
      'An automated red-teaming pipeline across 5+ state-of-the-art LLMs using adversarial prompting and Garak.',
      'Findings fed back into guardrails and prompts, then re-tested.',
    ],
    results: ['15% of probes surfaced critical flaws', 'Jailbreak success rate 40% → 15%'],
    stack: ['Garak', 'adversarial prompting', 'guardrails'],
    links: [],
    review: 'Tried to jailbreak the coffee machine. Succeeded.',
  },
  {
    id: 'graphrag',
    agent: 'LIBRARIAN',
    title: 'GraphRAG over COVID-19 research',
    tagline: 'A knowledge graph so the model stops making things up',
    kind: 'project',
    problem: 'Vector-only retrieval misses multi-hop answers across biomedical papers, and the model fills the gap with guesses.',
    built: [
      'A semantic knowledge graph over 300+ COVID-19 papers in Neo4j.',
      'Hybrid retrieval with BERT embeddings and BM25, plus reranking for multi-hop Q&A.',
    ],
    results: ['Hallucination rate 20% → 15% vs vector-only retrieval'],
    stack: ['Neo4j', 'LangChain', 'BERT', 'BM25'],
    links: [{ label: 'Code', url: gh('Semantic-Knowledge-Graph-from-Covid-ResearchCorpus') }],
    review: 'Knows where every paper is. Will tell you how they are related. At length.',
  },
  {
    id: 'tripease',
    agent: 'TRAVEL-AGENT',
    title: 'Tripease travel planner',
    tagline: 'CrewAI agents plan the trip so you don\'t have to',
    kind: 'project',
    problem: 'Planning a trip means a dozen tabs: places, flights, weather, reviews.',
    built: [
      'A full-stack planner (React, Node.js, TypeScript) where CrewAI agents on GPT-4o write itineraries from preferences.',
      '10+ APIs (Google Places, Amadeus, OpenWeather, Yelp) as agent tools, with Redis caching and MongoDB.',
      'Sentence-transformer recommendations for personalisation.',
    ],
    results: ['Planning time cut by 50%', 'Itinerary acceptance 55% → 78% across 200+ beta users', 'Under 8s p95'],
    stack: ['CrewAI', 'GPT-4o', 'React', 'Node.js', 'Redis', 'MongoDB'],
    links: [],
    review: 'Has never taken a vacation. Has planned 200.',
  },
]

export type ArchiveItem = { title: string; year: string; note: string; url?: string }

/** Floor B: older work, kept in filing cabinets. */
export const archive: ArchiveItem[] = [
  { title: 'Brain tumor detection (IEEE ICICCS paper)', year: '2023', note: 'MRI + deep learning', url: gh('Brain-Tumor-Prediction') },
  { title: 'Context-aware toxicity benchmarking', year: '2025', note: 'BERT, Twitter API', url: gh('Context-Aware-Toxicity-Benchmarking') },
  { title: 'Active semantic segmentation', year: '2025', note: 'U-Net with active learning', url: gh('Active_Semantic_Segmentation') },
  { title: 'TextSage: Naive Bayes author detection', year: '2025', note: 'Classic NLP', url: gh('TextSage-Naive-Bayes-Author-Detection') },
  { title: 'COVID-19 time-series forecasting', year: '2025', note: 'ARIMA', url: gh('Covid-19-Time-Series-Forecasting') },
  { title: 'Amigo: mental-health Discord bot', year: '2024', note: 'Deployed on Discord', url: gh('Amigo-Discord-Bot') },
  { title: 'Next-word prediction', year: '2024', note: 'LSTM', url: gh('Next-Word-Prediction-Model') },
  { title: 'Stroke prediction analysis', year: '2024', note: 'SMOTE + ensembles', url: gh('Stroke-Prediction-Analysis') },
  { title: 'TechForGood 2022', year: '2022', note: 'Student performance clustering (K-means)', url: gh('Techforgood2022') },
]
