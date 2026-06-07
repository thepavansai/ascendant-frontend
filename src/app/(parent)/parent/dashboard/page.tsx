'use client';

import React from 'react';
import Link from 'next/link';
import { Users, TrendingUp, Lightbulb, Calendar, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import XpBar from '@/components/player/XpBar';
import IdentityBadge from '@/components/player/IdentityBadge';
import { useAuth } from '@/lib/hooks/useAuth';
import { useParent } from '@/lib/hooks/useParent';
import { formatRelativeTime } from '@/lib/utils';
import PageLoader from '@/components/ui/page-loader';
import type { ParentChildSummary } from '@/lib/types/parent.types';

function ChildCard({ child, onApprove, isApproving }: { child: ParentChildSummary, onApprove: (childId: string) => void, isApproving: boolean }) {
  const isPending = !child.is_approved;

  const weekly = child.weekly_summary as {
    missions_completed?: number;
    average_final_score?: number;
    total_xp_earned?: number;
    strongest_attribute?: string;
    weakest_attribute?: string;
  };

  return (
    <Card className="p-8 border-border bg-surface2/30 mb-8">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-purple/20 border-2 border-purple flex items-center justify-center font-heading text-2xl font-bold text-purple">
            {child.child_name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold">{child.child_name}</h2>
            <div className="flex items-center gap-3 mt-1">
              {child.identity_type && (
                <IdentityBadge type={child.identity_type} size="sm" />
              )}
              <span className="text-xs text-muted font-bold">Level {child.level}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <XpBar xp={child.xp} maxXp={Math.max(child.xp * 1.5, 100)} />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-muted">
            <span>{child.xp} XP</span>
            <span>🔥 {child.streak_days} DAY STREAK</span>
          </div>
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <div className="text-[10px] font-bold text-muted uppercase mb-1">THIS WEEK</div>
            <div className="text-xl font-bold">{weekly.missions_completed ?? 0} Missions</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted uppercase mb-1">AVG SCORE</div>
            <div className="text-xl font-bold">
              {weekly.average_final_score != null
                ? `${Math.round(weekly.average_final_score * 100)}%`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-l-4 border-l-teal bg-surface/50">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="text-teal" size={18} /> Weekly insight
          </h4>
          <p className="text-sm text-offwhite">
            {weekly.strongest_attribute
              ? `Strongest area: ${weekly.strongest_attribute}. `
              : ''}
            {weekly.weakest_attribute
              ? `Room to grow: ${weekly.weakest_attribute}.`
              : 'Complete missions to see insights.'}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-xs text-muted">
            Last active: {formatRelativeTime(child.last_active)}
          </p>
          <p className="text-sm text-offwhite mt-2">
            {weekly.total_xp_earned ?? 0} XP earned this week
          </p>
          {isPending ? (
            <Button onClick={() => onApprove(child.child_id)} disabled={isApproving} className="btn-primary mt-4 w-full text-xs">
              {isApproving ? 'Approving...' : 'Approve Account'}
            </Button>
          ) : (
            <Link href={`/parent/children/${child.child_id}`}>
              <Button variant="outline" className="btn-ghost mt-4 text-xs">
                View details <ExternalLink size={12} className="ml-1" />
              </Button>
            </Link>
          )}
        </Card>
      </div>
    </Card>
  );
}

export default function ParentDashboard() {
  const { userId } = useAuth();
  const { dashboard, isLoading, linkChild, isLinking, approveChild, isApproving } = useParent(userId ?? '');
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [childEmail, setChildEmail] = React.useState('');
  const [parentEmail, setParentEmail] = React.useState('');

  const handleLinkChild = async () => {
    if (!childEmail || !parentEmail) {
      toast.error('Please enter both emails');
      return;
    }
    try {
      await linkChild({ parent_email: parentEmail, child_email: childEmail });
      toast.success('Link created. Child must accept.');
      setIsLinkModalOpen(false);
      setChildEmail('');
      setParentEmail('');
    } catch {
      toast.error('Failed to link child');
    }
  };

  if (!userId || isLoading) return <PageLoader />;

  const children = dashboard?.children ?? [];

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading font-bold">Guardian Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="btn-ghost">
            <Users size={18} className="mr-2" /> {children.length} Children
          </Button>
          <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">Link Child</Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-border text-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">Link Child Account</DialogTitle>
                <DialogDescription className="text-muted">
                  Enter your child's email address and your email address to link their account.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="parentEmail" className="text-sm font-bold text-muted">Your Email</label>
                  <Input 
                    id="parentEmail" 
                    value={parentEmail} 
                    onChange={(e) => setParentEmail(e.target.value)} 
                    placeholder="parent@example.com"
                    className="input-field" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="childEmail" className="text-sm font-bold text-muted">Child's Email</label>
                  <Input 
                    id="childEmail" 
                    value={childEmail} 
                    onChange={(e) => setChildEmail(e.target.value)} 
                    placeholder="child@example.com"
                    className="input-field" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" className="btn-ghost" onClick={() => setIsLinkModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="btn-primary" onClick={handleLinkChild} disabled={isLinking}>
                  {isLinking ? 'Linking...' : 'Link Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {children.length === 0 ? (
        <Card className="p-12 text-center">
          <h2 className="text-xl font-bold mb-2">No linked children yet</h2>
          <p className="text-muted">
            When a child registers with your email as parent, they will appear here after approval.
          </p>
        </Card>
      ) : (
        children.map((child) => (
          <ChildCard 
            key={child.child_id} 
            child={child} 
            onApprove={(childId) => approveChild({ childId })} 
            isApproving={isApproving} 
          />
        ))
      )}

      {children.length > 0 && (
        <Card className="p-8 border-l-4 border-l-amber bg-surface/50">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="text-amber" size={18} /> Tip
          </h4>
          <p className="text-sm text-offwhite">
            Encourage a mix of mission types — factual, analytical, and open-ended — to build
            well-rounded thinking skills.
          </p>
        </Card>
      )}
    </div>
  );
}
