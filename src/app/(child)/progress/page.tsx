'use client';

import React, { useMemo } from 'react';
import { Award, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePlayer } from '@/lib/hooks/usePlayer';
import PageLoader from '@/components/ui/page-loader';

const PIE_COLORS = ['#8B5CF6', '#F59E0B', '#06B6D4', '#10B981'];

export default function ProgressPage() {
  const { userId } = useAuth();
  const { profile, progression, stats, isLoadingProfile } = usePlayer(userId ?? '');

  const scoreDist = useMemo(() => {
    if (!progression?.length) return [];
    const buckets = [
      { range: '0-40%', count: 0, fill: '#EF4444' },
      { range: '40-60%', count: 0, fill: '#F59E0B' },
      { range: '60-80%', count: 0, fill: '#06B6D4' },
      { range: '80-100%', count: 0, fill: '#10B981' },
    ];
    for (const entry of progression) {
      const pct = entry.final_score * 100;
      if (pct < 40) buckets[0].count++;
      else if (pct < 60) buckets[1].count++;
      else if (pct < 80) buckets[2].count++;
      else buckets[3].count++;
    }
    return buckets.filter((b) => b.count > 0);
  }, [progression]);

  const typeData = useMemo(() => {
    if (!progression?.length) return [];
    const counts: Record<string, number> = {};
    for (const entry of progression) {
      const key = entry.mission_title;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return Object.entries(counts)
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.slice(0, 20), value }));
  }, [progression]);

  const xpByMission = useMemo(
    () =>
      (progression ?? [])
        .slice(0, 8)
        .reverse()
        .map((e, i) => ({ name: `M${i + 1}`, xp: e.xp_earned })),
    [progression]
  );

  if (!userId || isLoadingProfile) return <PageLoader />;
  if (!profile) {
    return <div className="p-8 text-center text-muted">No player profile found.</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto pb-20">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Your Progress</h1>
        <p className="text-muted">Track your growth over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: profile.xp, icon: Zap },
          { label: 'Missions Done', value: profile.missionsCompleted, icon: Award },
          {
            label: 'Weekly XP',
            value: stats?.total_xp_earned ?? 0,
            icon: Zap,
          },
          {
            label: 'Weekly Avg',
            value: stats ? `${Math.round(stats.average_final_score * 100)}%` : '—',
            icon: Award,
          },
        ].map((s) => (
          <Card key={s.label} className="p-6">
            <s.icon className="text-purple mb-2" size={20} />
            <div className="text-2xl font-mono font-bold">{s.value}</div>
            <div className="text-[10px] text-muted uppercase font-bold">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">XP PER MISSION (RECENT)</h3>
          <div className="h-[280px]">
            {xpByMission.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xpByMission}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2D45" />
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="xp" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-sm text-center pt-20">Complete missions to see XP trends.</p>
            )}
          </div>
        </Card>

        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">SCORE DISTRIBUTION</h3>
          <div className="h-[280px]">
            {scoreDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDist}>
                  <XAxis dataKey="range" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {scoreDist.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-sm text-center pt-20">No scores yet.</p>
            )}
          </div>
        </Card>
      </div>

      {typeData.length > 0 && (
        <Card className="p-8">
          <h3 className="text-sm font-bold text-muted mb-6 uppercase">MISSIONS PLAYED</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {typeData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {stats && (
        <Card className="p-6 border-l-4 border-l-teal">
          <p className="text-sm text-offwhite">
            This week your strongest attribute is{' '}
            <strong className="text-teal">{stats.strongest_attribute}</strong> and area to grow is{' '}
            <strong className="text-amber">{stats.weakest_attribute}</strong>.
          </p>
        </Card>
      )}
    </div>
  );
}
