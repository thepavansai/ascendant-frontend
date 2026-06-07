'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, ChevronRight, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function PendingApprovalContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your parent';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-24 h-24 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <Mail className="text-amber animate-pulse" size={40} />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber rounded-full border-4 border-background flex items-center justify-center">
            <Clock className="text-background" size={10} />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold mb-4">Check Your Parent&apos;s Email</h1>
        <p className="text-offwhite mb-8 leading-relaxed">
          We&apos;ve sent an approval link to <span className="text-white font-bold">{email}</span>. Ask
          your parent to click it so you can start your missions.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 border border-amber/20 text-amber text-sm font-bold mb-12">
          ⏳ Pending Approval
        </div>

        <div className="flex flex-col gap-4">
          <Button variant="outline" className="btn-ghost h-12">
            <RefreshCcw size={18} className="mr-2" /> Resend Approval Email
          </Button>
          <Link
            href="/account/signin"
            className="text-purple hover:text-purple-light font-semibold flex items-center justify-center gap-1 transition-colors mt-4"
          >
            Already approved? Log in <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense>
      <PendingApprovalContent />
    </Suspense>
  );
}
