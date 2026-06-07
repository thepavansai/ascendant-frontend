export type EvalStatus = 'PENDING' | 'DONE' | 'FAILED';

export interface EvaluationResult {
  responseId: string;
  status: EvalStatus;
  evaluation: {
    id: string;
    ruleScore: number;
    aiScore: number | null;
    finalScore: number;
    intellectScore: number;
    judgmentScore: number;
    awarenessScore: number;
    clarityScore: number;
    feedbackText: string;
    aiTokensUsed: number;
    evalStatus: EvalStatus;
    createdAt: string;
  } | null;
  xpEarned: number | null;
  leveledUp: boolean | null;
  newLevel: number | null;
  answerText: string | null;
  selectedChoice: string | null;
}

export interface ResponseSubmitResult {
  responseId: string;
  status: string;
  message: string;
  estimatedSeconds: number;
  aiLimited: boolean;
}
