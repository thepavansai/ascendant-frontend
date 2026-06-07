'use client';

import React, { useMemo } from 'react';
import { Brain, Target, Lightbulb, Hammer, Trophy, Calendar, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import XpBar from '@/components/player/XpBar';
import IdentityBadge from '@/components/player/IdentityBadge';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePlayer } from '@/lib/hooks/usePlayer';
import { formatMissionType, formatRelativeTime } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';

export default function PlayerProfilePage() {
  const { userId } = useAuth();
  const [limit, setLimit] = React.useState(10);
  const { profile, progression, isLoadingProfile, isLoadingProgression } = usePlayer(userId ?? '', limit);

  const attributeData = useMemo(() => {
    if (!profile) return [];
    return [
      { subject: 'Intellect', A: profile.intellect, fullMark: 10 },
      { subject: 'Judgment', A: profile.judgment, fullMark: 10 },
      { subject: 'Awareness', A: profile.awareness, fullMark: 10 },
      { subject: 'Clarity', A: profile.clarity, fullMark: 10 },
    ];
  }, [profile]);

  if (!userId || isLoadingProfile) return <PageLoader />;
  if (!profile) {
    return <div className="p-8 text-center text-muted">No player profile found.</div>;
  }

  const maxXp = profile.xp + profile.xpToNextLevel;

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto pb-20">
      <Card className="p-10 border-border bg-gradient-to-br from-surface to-surface2">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <IdentityBadge type={profile.identityType} size="lg" />
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-heading font-bold mb-2">{profile.name}</h1>
            <p className="text-muted mb-6">
              Level {profile.level} · {profile.identityType}
            </p>
            <XpBar xp={profile.xp} maxXp={maxXp} />
            <p className="text-xs text-muted mt-2">{profile.xpToNextLevel} XP to next level</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Missions', value: profile.missionsCompleted, icon: CheckCircle2 },
          { label: 'Streak', value: `${profile.streakDays}d`, icon: Zap },
          { label: 'Avg Score', value: `${Math.round(profile.averageScore * 100)}%`, icon: Trophy },
          { label: 'Last Active', value: formatRelativeTime(profile.lastActive), icon: Calendar },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <stat.icon className="mx-auto mb-2 text-purple" size={24} />
            <div className="text-2xl font-bold font-mono">{stat.value}</div>
            <div className="text-[10px] text-muted uppercase font-bold">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">ATTRIBUTE RADAR</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attributeData}>
                <PolarGrid stroke="#1F2D45" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                <Radar dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">MISSION HISTORY</h3>
          <div className="space-y-3">
            {(progression ?? []).map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-4 rounded-xl bg-surface2/50 border border-border"
              >
                <div>
                  <div className="font-bold text-sm">{entry.mission_title}</div>
                  <div className="text-[10px] text-muted">
                    {formatMissionType('ANALYTICAL')} · {formatRelativeTime(entry.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{Math.round(entry.final_score * 100)}%</div>
                  <div className="text-[10px] text-amber">+{entry.xp_earned} XP</div>
                </div>
              </div>
            ))}
            {!progression?.length && (
              <p className="text-muted text-sm">No completed missions yet.</p>
            )}
            {progression?.length === limit && (
              <button 
                onClick={() => setLimit((l) => l + 10)}
                disabled={isLoadingProgression}
                className="w-full mt-2 text-xs font-bold text-purple hover:text-purple-light disabled:opacity-50"
              >
                {isLoadingProgression ? 'Loading...' : 'Load older missions'}
              </button>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Intellect', value: profile.intellect, icon: Brain, color: 'purple' },
          { name: 'Judgment', value: profile.judgment, icon: Target, color: 'amber' },
          { name: 'Awareness', value: profile.awareness, icon: Lightbulb, color: 'teal' },
          { name: 'Clarity', value: profile.clarity, icon: Hammer, color: 'green' },
        ].map((attr) => (
          <Card key={attr.name} className="p-6 text-center">
            <attr.icon className="mx-auto mb-2" style={{ color: `var(--color-${attr.color})` }} size={24} />
            <div className="text-xl font-mono font-bold">{attr.value.toFixed(1)}</div>
            <div className="text-[10px] text-muted uppercase">{attr.name}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
