export type IdentityType = 'STRATEGIST' | 'BUILDER' | 'ANALYST' | 'CREATOR';

export interface PlayerProfile {
  userId: string;
  name: string;
  identityType: IdentityType;
  xp: number;
  level: number;
  xpToNextLevel: number;
  intellect: number;
  judgment: number;
  awareness: number;
  clarity: number;
  streakDays: number;
  lastActive: string;
  missionsCompleted: number;
  averageScore: number;
  isApproved: boolean;
}

export interface ProgressionEntry {
  id: string;
  mission_id: string;
  mission_title: string;
  xp_earned: number;
  final_score: number;
  level_before: number;
  level_after: number;
  leveled_up: boolean;
  response_id: string | null;
  created_at: string;
}

export interface WeeklyStats {
  missions_completed: number;
  total_xp_earned: number;
  average_final_score: number;
  strongest_attribute: string;
  weakest_attribute: string;
}
