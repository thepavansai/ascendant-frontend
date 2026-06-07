'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Star, Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { adminApi } from '@/lib/api/admin';
import { missionsApi } from '@/lib/api/missions';
import PageLoader from '@/components/ui/page-loader';
import Link from 'next/link';
import type { MissionType } from '@/lib/types/mission.types';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Weight, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MissionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [narrative, setNarrative] = useState('');
  const [scenarioContext, setScenarioContext] = useState('');
  const [difficulty, setDifficulty] = useState([3]);
  const [missionType, setMissionType] = useState<MissionType>('ANALYTICAL');
  const [openResponse, setOpenResponse] = useState(true);
  const [choices, setChoices] = useState<{ id: string; text: string }[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
  ]);
  const [ruleWeight, setRuleWeight] = useState([40]);
  const [aiWeight, setAiWeight] = useState([60]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    missionsApi.getById(resolvedParams.id)
      .then(res => {
        setTitle(res.data.title);
        setNarrative(res.data.narrative);
        setDifficulty([res.data.difficultyLevel]);
        setMissionType(res.data.missionType);
        setRuleWeight([res.data.ruleWeight * 100]);
        setAiWeight([res.data.aiWeight * 100]);
        if (res.data.scenario) {
          setScenarioContext(res.data.scenario.context);
          setOpenResponse(res.data.scenario.openResponse !== false);
          if (res.data.scenario.choices && res.data.scenario.choices.length > 0) {
            setChoices(
              res.data.scenario.choices.map((c) => {
                const key = Object.keys(c)[0];
                return { id: key, text: c[key] };
              })
            );
          }
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load mission');
        router.push('/admin/dashboard');
      });
  }, [resolvedParams.id, router]);

  const handleSave = async () => {
    if (!title.trim() || !narrative.trim()) {
      toast.error('Title and narrative are required');
      return;
    }
    setSaving(true);
    try {
      await adminApi.updateMission(resolvedParams.id, {
        title,
        narrative,
        difficulty_level: difficulty[0],
        mission_type: missionType,
        rule_weight: ruleWeight[0] / 100,
        ai_weight: aiWeight[0] / 100,
        scenario: scenarioContext.trim()
          ? { 
              context: scenarioContext, 
              open_response: openResponse,
              choices: !openResponse ? choices.filter(c => c.text.trim()).map(c => ({ [c.id]: c.text })) : undefined
            }
          : undefined,
      });
      toast.success('Mission updated');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Failed to update mission');
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-10 max-w-[800px] mx-auto pb-20">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 text-muted hover:text-white w-fit"
      >
        <ChevronLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-heading font-bold">Edit Mission</h1>
          <p className="text-muted">Update existing mission details.</p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest">
            MISSION TITLE
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">
              NARRATIVE BRIEFING
            </label>
            <span className="text-[10px] text-muted">{narrative.length} chars</span>
          </div>
          <Textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            className="input-field min-h-[200px]"
          />
        </div>

        <div className="space-y-4 max-w-xs">
          <label className="text-xs font-bold text-muted uppercase tracking-widest">
            DIFFICULTY: {difficulty[0]}/5
          </label>
          <Slider
            value={difficulty}
            onValueChange={setDifficulty}
            max={5}
            step={1}
            className="py-4"
          />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={s <= difficulty[0] ? 'text-amber fill-amber' : 'text-border'}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-muted uppercase tracking-widest">
            MISSION TYPE
          </label>
          <div className="flex gap-2 max-w-md">
            {['FACTUAL', 'ANALYTICAL', 'OPEN_ENDED'].map((t) => (
              <button
                key={t}
                onClick={() => setMissionType(t as MissionType)}
                className={cn(
                  'px-3 py-2 rounded-lg border text-[10px] font-bold flex-1 transition-all',
                  missionType === t
                    ? 'bg-purple text-white border-purple'
                    : 'bg-surface2 border-border text-muted hover:text-white'
                )}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-8 space-y-6">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <Weight size={20} className="text-purple" /> Scoring Weights
        </h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-muted uppercase">Rule Engine Weight</label>
              <span className="text-xs font-mono">{ruleWeight}%</span>
            </div>
            <Slider 
              value={ruleWeight} 
              onValueChange={(v) => { setRuleWeight(v); setAiWeight([100 - v[0]]); }} 
              max={100} 
              step={1} 
            />
            <p className="text-[10px] text-muted italic">Automated structure check</p>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-muted uppercase">AI Mentor Weight</label>
              <span className="text-xs font-mono">{aiWeight}%</span>
            </div>
            <Slider 
              value={aiWeight} 
              onValueChange={(v) => { setAiWeight(v); setRuleWeight([100 - v[0]]); }} 
              max={100} 
              step={1} 
            />
            <p className="text-[10px] text-muted italic">Deep reasoning assessment</p>
          </div>
        </div>
      </Card>

      <Card className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-bold text-lg flex items-center gap-2">
            <Layout size={20} className="text-teal" /> Scenario Configuration
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted">ACTIVE</span>
            <Switch checked={true} />
          </div>
        </div>
        <Textarea
          value={scenarioContext}
          onChange={(e) => setScenarioContext(e.target.value)}
          placeholder="Describe the specific choice or problem..."
          className="input-field min-h-[120px]"
        />
        <div className="flex items-center gap-2">
          <Switch checked={openResponse} onCheckedChange={setOpenResponse} />
          <span className="text-xs font-bold text-muted uppercase">Open Response Enabled</span>
        </div>

        {!openResponse && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-offwhite uppercase">Multiple Choices</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setChoices([...choices, { id: String.fromCharCode(65 + choices.length), text: '' }])}
                className="h-8 text-xs font-bold"
              >
                <Plus size={14} className="mr-1" /> Add Option
              </Button>
            </div>
            {choices.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-10 h-10 shrink-0 bg-surface2 rounded-lg border border-border flex items-center justify-center font-bold text-muted">
                  {choice.id}
                </div>
                <Input
                  value={choice.text}
                  onChange={(e) => {
                    const newChoices = [...choices];
                    newChoices[index].text = e.target.value;
                    setChoices(newChoices);
                  }}
                  placeholder={`Option ${choice.id} text...`}
                  className="input-field flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setChoices(choices.filter((_, i) => i !== index).map((c, i) => ({ ...c, id: String.fromCharCode(65 + i) })))}
                  disabled={choices.length <= 2}
                  className="shrink-0 text-muted hover:text-red hover:bg-red/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
