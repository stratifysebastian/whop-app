import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed border-2 border-gray-200 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon && (
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-built empty states for common scenarios
export function NoReferralsEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon={<div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-primary text-xl">👥</span>
      </div>}
      title="No referrals yet"
      description="Start sharing your referral link to grow your community and earn rewards."
      action={{
        label: "Get Your Referral Link",
        onClick: onCreateClick
      }}
    />
  );
}

export function NoCampaignsEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon={<div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-primary text-xl">🎯</span>
      </div>}
      title="No campaigns yet"
      description="Create your first referral campaign to incentivize your community and drive growth."
      action={{
        label: "Create Campaign",
        onClick: onCreateClick
      }}
    />
  );
}

export function NoRewardsEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <EmptyState
      icon={<div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-primary text-xl">🏆</span>
      </div>}
      title="No rewards configured"
      description="Set up milestone rewards to automatically reward your top referrers."
      action={{
        label: "Configure Rewards",
        onClick: onCreateClick
      }}
    />
  );
}

export function NoDataEmptyState({ 
  title, 
  description, 
  icon = "📊" 
}: { 
  title: string; 
  description: string; 
  icon?: string;
}) {
  return (
    <EmptyState
      icon={<div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-600 text-xl">{icon}</span>
      </div>}
      title={title}
      description={description}
    />
  );
}
