import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-white border border-cream-200 p-8 shadow-soft-xl space-y-4">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
          <ShieldAlert className="h-8 w-8 stroke-[1.8]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-chocolate-950">
          Access Restricted
        </h2>
        <p className="text-xs text-chocolate-600 leading-relaxed">
          You do not have the required permissions to view this portal area. If you believe this is an error, switch your role via the top bar or sign in with an elevated account.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
              Return to Safety
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
