"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBatchStore } from "@/stores/batch-store";
import { useTemplateStore } from "@/stores/template-store";
import { ArrowLeft, Play, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { processBatchJob } from "@clipfactory/opencut-engine";
import { toast } from "sonner";

export default function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { getJob, updateJobStatus, updateJobProgress, deleteJob } = useBatchStore();
  const { templates, addProject } = useTemplateStore();
  
  const job = getJob(id);
  const template = job ? templates.find(t => t.id === job.templateId) : undefined;
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!job) {
    return <div className="p-8">Job not found</div>;
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this batch job?")) {
        deleteJob(id);
        router.push("/batch");
    }
  };

  const handleRunBatch = async () => {
    if (!template) {
        toast.error("Template not found");
        return;
    }

    try {
        setIsProcessing(true);
        updateJobStatus(id, 'processing');
        
        // Run the engine logic
        // TODO: In a real app, this might happen in a backend worker queue
        // For now, we run it client-side but async
        
        // Small delay to let UI update
        await new Promise(r => setTimeout(r, 500));

        const generatedProjects = processBatchJob(job, {
             ...template,
             placeholders: template.placeholders || [] // Ensure array
        } as any); // Cast to match types if strictness mismatch

        // Save generated projects
        let completed = 0;
        for (const proj of generatedProjects) {
            addProject({
                id: proj.id,
                name: proj.name,
                templateId: template.id,
                templateName: template.name,
                status: 'pending', // Pending rendering
                itemCount: 0, // Not relevant for single project
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            completed++;
            // Simulate progress update
            updateJobProgress(id, completed, 0);
            await new Promise(r => setTimeout(r, 50)); 
        }

        updateJobStatus(id, 'completed');
        toast.success(`Successfully generated ${completed} projects!`);

    } catch (error: any) {
        console.error(error);
        updateJobStatus(id, 'failed');
        toast.error(`Batch failed: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  };

  const progress = job.totalItems > 0 
    ? ((job.completedItems + job.failedItems) / job.totalItems) * 100 
    : 0;

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/batch')}>
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-3xl font-bold">{job.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    {job.dataSource.fileName} • {job.totalItems} items
                </p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="w-5 h-5" />
            </Button>
            {job.status === 'queued' && (
                <Button onClick={handleRunBatch} disabled={isProcessing} className="gap-2">
                    <Play className="w-4 h-4" />
                    {isProcessing ? "Processing..." : "Run Batch"}
                </Button>
            )}
             {job.status === 'completed' && (
                <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Download All
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Status Card */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Generation Status</CardTitle>
                <CardDescription>
                    Progress: {job.completedItems} / {job.totalItems}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Progress value={progress} className="h-4" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{job.totalItems}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div>
                    </div>
                    <div className="p-4 bg-green-500/10 text-green-600 rounded-lg">
                        <div className="text-2xl font-bold">{job.completedItems}</div>
                        <div className="text-xs opacity-75 uppercase tracking-wider">Success</div>
                    </div>
                     <div className="p-4 bg-red-500/10 text-red-600 rounded-lg">
                        <div className="text-2xl font-bold">{job.failedItems}</div>
                        <div className="text-xs opacity-75 uppercase tracking-wider">Failed</div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <span className="text-muted-foreground block">Template</span>
                        <span className="font-medium">{template?.name || "Unknown"}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground block">Naming Pattern</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs">{job.settings.namingPattern}</code>
                    </div>
                    <div>
                        <span className="text-muted-foreground block">Auto Export</span>
                        <span className="font-medium">{job.settings.autoExport ? "Enabled" : "Disabled"}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
