'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Users, Zap, Award, Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminDashboard } from '@/lib/hooks/useAdmin';
import { formatMissionType } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';
import { formatRelativeTime } from '@/lib/utils';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminDashboard() {
  const { users, missions, stats, isLoading } = useAdminDashboard();
  const [userRoleFilter, setUserRoleFilter] = React.useState<string>('ALL');
  const queryClient = useQueryClient();

  const handleDeactivate = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this mission?')) return;
    try {
      await adminApi.deactivateMission(id);
      toast.success('Mission deactivated');
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    } catch {
      toast.error('Failed to deactivate mission');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-heading font-bold">Admin Center</h1>
          <p className="text-muted">Manage users, missions, and system performance.</p>
        </div>
        <Link href="/admin/missions">
          <Button className="btn-primary">
            <Plus size={18} className="mr-2" /> Create New Mission
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TOTAL USERS', value: stats.totalUsers, icon: Users, color: 'purple' },
          { label: 'CHILDREN', value: stats.activeChildren, icon: Zap, color: 'amber' },
          { label: 'TOTAL MISSIONS', value: stats.totalMissions, icon: Target, color: 'teal' },
          { label: 'PARENTS', value: stats.parents, icon: Award, color: 'green' },
        ].map((stat) => (
          <Card key={stat.label} className="p-8 bg-gradient-to-br from-surface to-surface2 border-border shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-border/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                {stat.label}
              </span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background/50 shadow-inner">
                <stat.icon size={20} style={{ color: `var(--color-${stat.color})` }} />
              </div>
            </div>
            <div className="text-4xl font-bold font-mono text-white">{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden border-border/50 bg-surface/40 shadow-2xl backdrop-blur-sm">
        <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-xl font-heading font-bold">Active Missions</h2>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <Input placeholder="Search missions..." className="input-field pl-10" />
            </div>
            <Button variant="outline" className="btn-ghost">
              <Filter size={16} className="mr-2" /> Filter
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dimmed uppercase tracking-widest border-b border-border">
                <th className="px-8 py-4">TITLE</th>
                <th className="px-8 py-4">TYPE</th>
                <th className="px-8 py-4">DIFFICULTY</th>
                <th className="px-8 py-4">STATUS</th>
                <th className="px-8 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {missions.map((m) => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-surface2/30">
                  <td className="px-8 py-6 font-bold text-white">{m.title}</td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-surface2 border border-border text-muted">
                      {formatMissionType(m.missionType)}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className={`w-1.5 h-1.5 rounded-full ${s <= m.difficultyLevel ? 'bg-amber' : 'bg-border'}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-green">ACTIVE</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/missions/${m.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted hover:text-white">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted hover:text-red"
                        onClick={() => handleDeactivate(m.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {missions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted">
                    No missions in database. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-border/50 bg-surface/40 shadow-2xl backdrop-blur-sm mt-8">
        <div className="p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-xl font-heading font-bold">Users</h2>
          <div className="flex gap-2">
            {['ALL', 'CHILD', 'PARENT', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setUserRoleFilter(r)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                  userRoleFilter === r
                    ? 'bg-purple text-white border-purple'
                    : 'bg-surface2 text-muted border-border hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-dimmed uppercase tracking-widest border-b border-border">
                <th className="px-8 py-4">NAME</th>
                <th className="px-8 py-4">EMAIL</th>
                <th className="px-8 py-4">ROLE</th>
                <th className="px-8 py-4">JOINED</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users
                .filter((u) => userRoleFilter === 'ALL' || u.role === userRoleFilter)
                .map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-surface2/30">
                    <td className="px-8 py-6 font-bold text-white">{u.name}</td>
                    <td className="px-8 py-6 text-muted">{u.email}</td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        u.role === 'CHILD' ? 'bg-amber/10 text-amber border-amber/30' :
                        u.role === 'PARENT' ? 'bg-green/10 text-green border-green/30' :
                        'bg-purple/10 text-purple border-purple/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-muted">{formatRelativeTime(u.created_at)}</td>
                  </tr>
                ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
