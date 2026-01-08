"use client";

import { useBatchStore } from "@/stores/batch-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BatchJobStatus } from "@clipfactory/platform-core/types";
import { Badge } from "@/components/ui/badge";

const STATUS_ICONS = {
  queued: Clock,
  processing: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle
};

const STATUS_COLORS = {
  queued: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  failed: "bg-red-500/10 text-red-500 border-red-500/20"
};

export default function BatchListingPage() {
  const { jobs, deleteJob } = useBatchStore();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold">Batch Generation</h1>
           <p className="text-muted-foreground">Manage your bulk video generation jobs.</p>
        </div>
        <Link href="/templates">
            <Button className="gap-2">
                <Plus className="w-4 h-4" /> New Batch
            </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {jobs.length === 0 ? (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <p>No batch jobs found.</p>
                    <p className="text-sm">Start by selecting a template and choosing "Batch Generate".</p>
                </CardContent>
            </Card>
        ) : (
            jobs.map(job => (
                <Link key={job.id} href={`/batch/${job.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex flex-col gap-1">
                                <CardTitle className="text-lg">{job.name}</CardTitle>
                                <CardDescription>
                                    Created {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                </CardDescription>
                            </div>
                            <StatusBadge status={job.status} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">{job.totalItems}</span>
                                    <span>Total Items</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-green-500">{job.completedItems}</span>
                                    <span>Completed</span>
                                </div>
                                {job.failedItems > 0 && (
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-destructive">{job.failedItems}</span>
                                        <span>Failed</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: BatchJobStatus }) {
    const Icon = STATUS_ICONS[status];
    return (
        <Badge className={`gap-1 ${STATUS_COLORS[status]} hover:${STATUS_COLORS[status]}`} variant="outline">
            <Icon className={`w-3 h-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
            <span className="capitalize">{status}</span>
        </Badge>
    );
}
