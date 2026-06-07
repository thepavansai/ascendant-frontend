'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import XpBar from '@/components/player/XpBar';
import IdentityBadge from '@/components/player/IdentityBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useParent } from '@/lib/hooks/useParent';
import { usePlayer } from '@/lib/hooks/usePlayer';
import { formatRelativeTime } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';

export default function ChildDetailPage({ params }: { params: Promise<{ childId: string }> }) {
  const resolvedParams = React.use(params);
  const { userId } = useAuth();
  const { dashboard, isLoading } = useParent(userId ?? '');
  const { progression, isLoadingProgression } = usePlayer(resolvedParams.childId);

  if (!userId || isLoading) return <PageLoader />;

  const child = dashboard?.children.find((c) => c.child_id === resolvedParams.childId);

  if (!child) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted mb-4">Child not found.</p>
        <Link href="/parent/dashboard" className="text-purple hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const weekly = child.weekly_summary as {
    missions_completed?: number;
    average_final_score?: number;
    total_xp_earned?: number;
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1000px] mx-auto">
      <Link
        href="/parent/dashboard"
        className="flex items-center gap-2 text-muted hover:text-white w-fit"
      >
        <ChevronLeft size={20} /> Back
      </Link>

      <Card className="p-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-purple/20 border-2 border-purple flex items-center justify-center text-xl font-bold text-purple">
            {child.child_name[0]}
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold">{child.child_name}</h1>
            {child.identity_type && (
              <IdentityBadge type={child.identity_type} size="sm" className="mt-2" />
            )}
          </div>
        </div>

        <XpBar xp={child.xp} maxXp={Math.max(child.xp * 1.5, 100)} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{child.level}</div>
            <div className="text-[10px] text-muted uppercase">Level</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{child.streak_days}</div>
            <div className="text-[10px] text-muted uppercase">Streak</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">{weekly.missions_completed ?? 0}</div>
            <div className="text-[10px] text-muted uppercase">This week</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">
              {weekly.average_final_score != null
                ? `${Math.round(weekly.average_final_score * 100)}%`
                : '—'}
            </div>
            <div className="text-[10px] text-muted uppercase">Avg score</div>
          </Card>
        </div>

        <p className="text-sm text-muted mt-6">
          Last active: {formatRelativeTime(child.last_active)} ·{' '}
          {weekly.total_xp_earned ?? 0} XP this week
        </p>

        <div className="mt-12">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">RECENT MISSIONS</h3>
          <div className="space-y-4">
            {isLoadingProgression ? (
              <p className="text-sm text-muted">Loading history...</p>
            ) : (
              <>
                {(progression ?? []).slice(0, 10).map((entry) => {
                  const content = (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-surface2/50 border border-border/50 ${entry.response_id ? 'hover:bg-surface2 hover:border-purple/30 transition-all group' : ''}`}
                    >
                      <div>
                        <span className={`text-sm font-bold ${entry.response_id ? 'group-hover:text-purple transition-colors' : ''}`}>{entry.mission_title}</span>
                        <p className="text-[10px] text-muted">{formatRelativeTime(entry.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold">
                          {Math.round(entry.final_score * 100)}%
                        </span>
                        <p className="text-[8px] font-bold text-amber">+{entry.xp_earned} XP</p>
                      </div>
                    </div>
                  );
                  
                  if (entry.response_id) {
                    return (
                      <Link href={`/missions/${entry.mission_id}/results?responseId=${entry.response_id}`} key={entry.id}>
                        {content}
                      </Link>
                    );
                  }
                  return content;
                })}
                {!progression?.length && (
                  <p className="text-muted text-sm">No missions completed yet.</p>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
