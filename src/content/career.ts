export type Job = { org: string; role: string; dates: string; points: string[] }

export const experience: Job[] = [
  {
    org: 'Owens Institute for Behavioral Research',
    role: 'Graduate research assistant',
    dates: '01/2025 – 07/2026',
    points: [
      'Fine-tuned RoBERTa-large and ModernBERT with LoRA on 50K+ tweets: 93% macro-F1 for hate-speech detection, +6 points over the BERT baseline.',
      'Built an LLM-as-judge annotation pipeline (Llama 3.1 70B, GPT-4o-mini) at 0.81 Cohen\'s κ with human coders.',
      'Cut manual labelling by 60% and scaled batch inference to 1M+ posts per week with vLLM and Slurm.',
    ],
  },
  {
    org: 'CyberPosture',
    role: 'AI developer',
    dates: '05/2025 – 08/2025',
    points: [
      'Built an agentic security-posture assessment tool (Claude, LangGraph, FastAPI, Next.js) that interviews clients and writes risk reports.',
      'Mapped answers to NIST CSF 2.0 and CIS Controls v8 with RAG (pgvector) and structured outputs.',
      'Cut report turnaround from 2 days to under 10 minutes and lifted consultations by 35%.',
    ],
  },
  {
    org: 'Winjit Inc',
    role: 'Data scientist',
    dates: '05/2024 – 09/2024',
    points: [
      'Claim-likelihood and claim-reason classifiers on 100K+ insurance claims: 91% precision, 0.88 macro-F1.',
      'Multi-agent document QA over 50+ policy PDFs at 94% accuracy, with page citations.',
      'Fixed SMOTE overconfidence with class weighting and temperature scaling: accuracy 89% → 93%, ECE 0.12 → 0.04.',
    ],
  },
  {
    org: 'Grady College, University of Georgia',
    role: 'SEE Suite ML assistant',
    dates: '08/2024 – 12/2024',
    points: [
      'Benchmarked ML and BERT classifiers on 70,000+ tweets for hate, bullying, racism, sexism and threats: 97% accuracy, false positives 35% → 20%.',
    ],
  },
  {
    org: 'Better Opinions (YC W22)',
    role: 'ML engineer intern',
    dates: '02/2023 – 06/2023',
    points: ['Built a PyTorch LSTM for YouTube video prediction, halving research review time.'],
  },
  {
    org: 'Samsung Prism',
    role: 'Data science research intern',
    dates: '06/2022 – 07/2023',
    points: [
      'Real-time anti-aliasing CNN for video calls on TensorFlow Lite at under 20 ms per frame.',
      'Cut in-call battery use by 30% with INT8 quantization and pruning, within 0.3 dB PSNR of FP32.',
    ],
  },
]

export const education = [
  { school: 'University of Georgia', degree: 'MS, Artificial Intelligence', dates: '2023 – 2026', note: 'GPA 3.8' },
  { school: 'SRM Institute of Science and Technology', degree: 'BTech, Computer Science', dates: '2019 – 2023', note: 'GPA 9.35/10' },
]

export type Paper = { title: string; venue: string; date: string; authors: string; url: string }

export const papers: Paper[] = [
  {
    title: 'Evaluating Computational Approaches for Harmful Content Analysis: Promise, Pitfalls and Tools for Responsible Research',
    venue: 'Big Data and Cognitive Computing (MDPI) 10(5), 143',
    date: '2026',
    authors: 'Itai Himelboim, Mudit Baid',
    url: 'https://doi.org/10.3390/bdcc10050143',
  },
  {
    title: 'Brain Tumor Detection Using MRI and Deep Learning Models',
    venue: 'IEEE ICICCS (7th Intl. Conf. on Intelligent Computing and Control Systems)',
    date: '2023',
    authors: 'Mudit Baid et al.',
    url: 'https://doi.org/10.1109/ICICCS56967.2023.10142464',
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'LLMs and agents',
    items: ['LangGraph', 'LangChain', 'CrewAI', 'AutoGen', 'LlamaIndex', 'tool calling', 'structured outputs', 'multi-agent orchestration'],
  },
  { group: 'RAG, evals and safety', items: ['RAG', 'pgvector', 'Qdrant', 'Pinecone', 'LangSmith', 'RAGAS', 'DeepEval', 'guardrails', 'red teaming'] },
  {
    group: 'ML engineering',
    items: ['Python', 'PyTorch', 'Hugging Face', 'LoRA / QLoRA', 'mixture of experts', 'vLLM', 'FastAPI', 'Docker', 'AWS / GCP', 'SQL', 'MLflow'],
  },
]
