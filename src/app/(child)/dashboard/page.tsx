'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Target, ChevronRight, Play, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import XpBar from '@/components/player/XpBar';
import IdentityBadge from '@/components/player/IdentityBadge';
import StreakCounter from '@/components/player/StreakCounter';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePlayer } from '@/lib/hooks/usePlayer';
import { useMissions } from '@/lib/hooks/useMissions';
import { formatMissionType, formatRelativeTime } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';

export default function ChildDashboard() {
  const { userId } = useAuth();
  const { profile, progression, stats, isLoadingProfile } = usePlayer(userId ?? '');
  const { nextMission, missions, isLoadingNext } = useMissions();

  const attributeData = useMemo(() => {
    if (!profile) return [];
    return [
      { subject: 'Intellect', A: profile.intellect, fullMark: 10 },
      { subject: 'Judgment', A: profile.judgment, fullMark: 10 },
      { subject: 'Awareness', A: profile.awareness, fullMark: 10 },
      { subject: 'Clarity', A: profile.clarity, fullMark: 10 },
    ];
  }, [profile]);

  const weeklyXpData = useMemo(() => {
    if (!progression?.length) return [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const buckets: Record<string, number> = {};
    for (const entry of progression.slice(0, 14)) {
      const day = days[new Date(entry.created_at).getDay()];
      buckets[day] = (buckets[day] ?? 0) + entry.xp_earned;
    }
    return days.map((day) => ({ day, xp: buckets[day] ?? 0 }));
  }, [progression]);

  const featuredMission = missions.find((m) => !m.userCompleted && !m.isLocked) ?? missions[0];

  if (!userId || isLoadingProfile) return <PageLoader />;

  if (!profile) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">No player profile yet</h1>
        <p className="text-muted mb-6">
          Child accounts get a profile on registration. Sign up as a child or play missions after
          registering.
        </p>
        <Link href="/missions">
          <Button className="btn-primary">Browse Missions</Button>
        </Link>
      </div>
    );
  }

  const maxXp = profile.xp + profile.xpToNextLevel;
  const isNewUser = !progression || progression.length === 0;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
      {isNewUser && (
        <Card className="p-10 border-l-8 border-l-teal bg-gradient-to-br from-surface to-teal/10 shadow-2xl shadow-teal/20 mb-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal/20 text-teal text-[10px] font-bold uppercase tracking-widest mb-4">
                <Target size={12} /> Initiation Protocol
              </div>
              <h1 className="text-4xl font-heading font-bold text-white mb-4">Welcome to Ascendant!</h1>
              <p className="text-offwhite/80 text-lg mb-6 max-w-2xl">
                Your cognitive training begins now. Complete your first mission to establish your base attributes and unlock your unique Thinking Profile.
              </p>
              {profile.isApproved ? (
                <Link href={featuredMission ? `/missions/${featuredMission.id}` : '/missions'}>
                  <Button className="h-14 px-8 text-lg font-bold bg-teal hover:bg-teal/90 text-[#0B0F1A] shadow-lg shadow-teal/30 hover:-translate-y-1 transition-all rounded-xl">
                    Begin First Mission <Play className="ml-2 fill-current" size={20} />
                  </Button>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-surface2 border border-border">
                  <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                  <span className="text-sm font-bold text-amber">Waiting for Parent Approval to begin missions</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-4 p-8 relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <span className="text-muted font-bold text-xs tracking-widest uppercase">CURRENT LEVEL</span>
              <span className="font-mono text-6xl font-bold text-white mt-1">{profile.level}</span>
            </div>
            <IdentityBadge type={profile.identityType} size="lg" />
          </div>
          <XpBar xp={profile.xp} maxXp={maxXp} />
        </Card>

        <Card className="p-8 relative overflow-hidden">
          <StreakCounter
            streakDays={profile.streakDays}
            lastSevenDays={Array.from({ length: 7 }, (_, i) => i < Math.min(profile.streakDays, 7))}
            className="z-10 relative"
          />
        </Card>

        <Card className="flex flex-col gap-4 p-8 bg-purple shadow-[0_0_30px_rgba(139,92,246,0.2)] border-purple-light/20">
          <span className="text-white/70 font-bold text-xs tracking-widest uppercase">
            {isLoadingNext ? 'LOADING...' : "TODAY'S MISSION"}
          </span>
          <span className="font-heading text-2xl font-bold text-white leading-tight">
            {nextMission?.title ?? featuredMission?.title ?? 'All missions complete!'}
          </span>
          {(nextMission ?? featuredMission) && (
            profile.isApproved ? (
              <Link href={`/missions/${(nextMission ?? featuredMission)!.id}`}>
                <Button className="w-full bg-white text-purple hover:bg-white/90 font-bold rounded-xl h-12 mt-auto">
                  Play Now <Play className="ml-2 fill-current" size={16} />
                </Button>
              </Link>
            ) : (
              <Button disabled className="w-full bg-white/20 text-white/50 font-bold rounded-xl h-12 mt-auto cursor-not-allowed">
                Waiting for Parent Approval
              </Button>
            )
          )}
        </Card>
      </div>

      {!isNewUser && featuredMission && (
        <Card className="p-8 border-l-8 border-l-purple">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-teal/10 border border-teal/20 text-teal text-[10px] font-bold">
              {formatMissionType(featuredMission.missionType)}
            </span>
            <span className="text-muted text-xs">Difficulty {featuredMission.difficultyLevel}/5</span>
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4">{featuredMission.title}</h2>
          {profile.isApproved ? (
            <Link href={`/missions/${featuredMission.id}`}>
              <Button className="btn-primary">
                Start Mission <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          ) : (
            <Button disabled className="btn-primary opacity-50 cursor-not-allowed">
              Waiting for Approval <ChevronRight className="ml-2" size={20} />
            </Button>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-8 flex flex-col items-center">
          <h3 className="text-sm font-bold text-muted self-start mb-6 uppercase">THINKING PROFILE</h3>
          <div className="w-full h-[250px]">
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
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">RECENT MISSIONS</h3>
          <div className="space-y-4">
            {(progression ?? []).slice(0, 5).map((entry) => {
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
              <p className="text-muted text-sm">Complete a mission to see activity here.</p>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">WEEKLY XP</h3>
          {stats && (
            <div className="mb-4 text-sm text-muted">
              {stats.missions_completed} missions · {stats.total_xp_earned} XP · avg{' '}
              {Math.round(stats.average_final_score * 100)}%
            </div>
          )}
          <div className="w-full h-[200px]">
            {weeklyXpData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyXpData}>
                  <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="xp" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">
                <Brain className="mr-2" size={16} /> No XP data yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
