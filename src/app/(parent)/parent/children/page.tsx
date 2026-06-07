'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ExternalLink, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { useParent } from '@/lib/hooks/useParent';
import PageLoader from '@/components/ui/page-loader';
import IdentityBadge from '@/components/player/IdentityBadge';

export default function ChildrenPage() {
  const { userId } = useAuth();
  const { dashboard, isLoading, approveChild, isApproving } = useParent(userId ?? '');

  if (!userId || isLoading) return <PageLoader />;

  const children = dashboard?.children ?? [];

  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white">Your Children</h1>
          <p className="text-muted mt-2">Manage your linked child accounts and track their progress.</p>
        </div>
        <Link href="/parent/dashboard">
          <Button className="btn-primary">
            <Plus size={18} className="mr-2" /> Link New Child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <Card className="p-12 text-center bg-surface/50 border-dashed border-2 border-border">
          <div className="w-16 h-16 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-purple" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">No linked children yet</h2>
          <p className="text-muted mb-6 max-w-md mx-auto">
            You don't have any children linked to your account yet. Link a child from your dashboard to get started.
          </p>
          <Link href="/parent/dashboard">
            <Button className="btn-primary">Go to Dashboard to Link</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const isPending = !child.is_approved;
            
            return (
              <Card key={child.child_id} className="p-6 flex flex-col h-full bg-surface2/30 border-border hover:border-purple/50 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-purple-light flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple/20">
                    {child.child_name[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{child.child_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {child.identity_type && (
                        <IdentityBadge type={child.identity_type} size="sm" />
                      )}
                      <span className="text-xs text-muted font-bold">Lvl {child.level}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                  <div className="bg-surface/50 p-3 rounded-xl border border-border/50">
                    <div className="text-[10px] text-muted font-bold uppercase mb-1">Total XP</div>
                    <div className="font-bold text-white">{child.xp}</div>
                  </div>
                  <div className="bg-surface/50 p-3 rounded-xl border border-border/50">
                    <div className="text-[10px] text-muted font-bold uppercase mb-1">Streak</div>
                    <div className="font-bold text-white flex items-center gap-1">
                      🔥 {child.streak_days}
                    </div>
                  </div>
                </div>

                {isPending ? (
                  <Button 
                    onClick={() => approveChild({ childId: child.child_id })} 
                    disabled={isApproving} 
                    className="w-full btn-primary"
                  >
                    {isApproving ? 'Approving...' : 'Approve Account'}
                  </Button>
                ) : (
                  <Link href={`/parent/children/${child.child_id}`} className="block w-full">
                    <Button variant="outline" className="w-full bg-surface hover:bg-surface2 text-offwhite border-border">
                      View full report <ExternalLink size={14} className="ml-2" />
                    </Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
