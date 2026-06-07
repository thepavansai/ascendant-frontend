export type MissionType = 'FACTUAL' | 'ANALYTICAL' | 'OPEN_ENDED';

export interface MissionSummary {
  id: string;
  title: string;
  difficultyLevel: number;
  missionType: MissionType;
  isLocked: boolean;
  userCompleted: boolean;
  bestScore?: number | null;
}

export interface MissionDetail {
  id: string;
  title: string;
  narrative: string;
  difficultyLevel: number;
  missionType: MissionType;
  ruleWeight: number;
  aiWeight: number;
  attributeWeights: Record<string, number>;
  scenario?: {
    id: string;
    context: string;
    choices: Array<Record<string, string>> | null;
    openResponse: boolean;
    orderIndex: number;
  };
}
