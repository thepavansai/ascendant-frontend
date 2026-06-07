import type { IdentityType, WeeklyStats } from './player.types';

export interface ParentChildSummary {
  child_id: string;
  child_name: string;
  level: number;
  xp: number;
  streak_days: number;
  last_active: string | null;
  identity_type: IdentityType | null;
  is_approved: boolean;
  weekly_summary: WeeklyStats | Record<string, never>;
}

export interface ParentDashboard {
  parent_id: string;
  children: ParentChildSummary[];
}
