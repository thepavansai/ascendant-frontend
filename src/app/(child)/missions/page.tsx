'use client';

import React, { useState } from 'react';
import { Search, LayoutGrid, List, Loader2 } from 'lucide-react';
import MissionCard from '@/components/mission/MissionCard';
import { useMissions } from '@/lib/hooks/useMissions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MissionListPage() {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const { missions, isLoadingMissions } = useMissions();

  const filters = ['All', 'Factual', 'Analytical', 'Open-Ended', 'Completed', 'Locked'];

  const filteredMissions = missions
    .filter((m) => {
      if (filter === 'All') return true;
      if (filter === 'Factual') return m.missionType === 'FACTUAL';
      if (filter === 'Analytical') return m.missionType === 'ANALYTICAL';
      if (filter === 'Open-Ended') return m.missionType === 'OPEN_ENDED';
      if (filter === 'Completed') return m.userCompleted;
      if (filter === 'Locked') return m.isLocked;
      return true;
    })
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  if (isLoadingMissions) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Missions</h1>
          <p className="text-muted">Choose your next challenge and level up your skills.</p>
        </div>

        <div className="flex items-center gap-3 bg-surface p-1 rounded-2xl border border-border">
          <Button variant="ghost" size="icon" className="rounded-xl bg-surface2 text-white">
            <LayoutGrid size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl text-muted">
            <List size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                f === filter
                  ? 'px-4 py-2 rounded-full bg-purple text-white text-sm font-bold whitespace-nowrap'
                  : 'px-4 py-2 rounded-full bg-surface border border-border text-muted hover:text-white text-sm font-bold whitespace-nowrap transition-colors'
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search missions..."
            className="input-field pl-10 h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
        {filteredMissions.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-surface2 rounded-full flex items-center justify-center mb-4 border border-border">
              <Search className="text-muted" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No missions found</h3>
            <p className="text-muted">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
