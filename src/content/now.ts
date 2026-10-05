/** The Kanban wall: what's happening right now. Update whenever it changes. */
export const kanban: { column: string; cards: string[] }[] = [
  { column: 'Doing', cards: ['AutoCover-Lite: round 3 of benchmarks', 'This portfolio (you are standing in it)'] },
  { column: 'Blocked', cards: ['Waiting on GPU'] },
  { column: 'Done', cards: ['MS in AI, University of Georgia', 'Paper in MDPI BDCC'] },
  { column: 'Todo', cards: ['Next role: ML / LLM engineering', 'Touch grass'] },
]
