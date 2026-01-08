"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play, Upload, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CsvUploader } from "@/components/batch/csv-uploader";
import { FieldMapper } from "@/components/batch/field-mapper";
import { useBatchStore } from "@/stores/batch-store";
import { useTemplateStore } from "@/stores/template-store";
import { Separator } from "@/components/ui/separator";

// Mock placeholders - in real app, parse these from the selected template
// Mock placeholders removed


export default function CreateBatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  
  const { createJob } = useBatchStore();
  const { templates } = useTemplateStore();
  const selectedTemplate = templates.find(t => t.id === templateId);

  const [step, setStep] = useState<1 | 2>(1);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState("");

  const handleCsvParsed = (data: any[], name: string) => {
    setCsvData(data);
    setFileName(name);
    if (data.length > 0) {
        setCsvHeaders(Object.keys(data[0]));
        setStep(2);
    }
  };

  const handleCreateBatch = () => {
    if (!templateId || !selectedTemplate) return;

    const jobId = createJob(
        `Batch: ${selectedTemplate.name}`,
        templateId,
        {
            type: 'csv',
            fileName,
            data: csvData,
            mappings: mapping
        },
        {
            namingPattern: `${selectedTemplate.name}_{index}`,
            autoExport: false
        }
    );

    router.push(`/batch/${jobId}`);
  };

  if (!templateId) {
    return <div className="p-8">Error: No template selected</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-3xl font-bold">New Batch Generation</h1>
            <p className="text-muted-foreground">
                Template: <span className="font-medium text-foreground">{selectedTemplate?.name || "Unknown"}</span>
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Steps Sidebar */}
        <div className="space-y-4">
            <Card className={step >= 1 ? "border-primary/50 bg-primary/5" : ""}>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="w-5 h-5" /> Source Data
                    </CardTitle>
                    <CardDescription>Upload CSV file</CardDescription>
                </CardHeader>
            </Card>
             <Card className={step >= 2 ? "border-primary/50 bg-primary/5" : ""}>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Settings2 className="w-5 h-5" /> Map Fields
                    </CardTitle>
                    <CardDescription>Connect data columns</CardDescription>
                </CardHeader>
            </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Upload Data Source</h2>
                            <p className="text-sm text-muted-foreground">
                                Upload a CSV file containing the data for your video batch.
                            </p>
                            <Separator />
                            <CsvUploader onDataParsed={handleCsvParsed} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold">Map Columns</h2>
                                <p className="text-sm text-muted-foreground">
                                    Match your CSV columns to the template variables.
                                </p>
                            </div>
                            <Separator />
                            
                            <FieldMapper 
                                csvHeaders={csvHeaders}
                                placeholders={(selectedTemplate?.placeholders || []).map(p => `{{${p.name}}}`)}
                                onMappingComplete={setMapping}
                            />

                            <div className="flex justify-end pt-4">
                                <Button size="lg" onClick={handleCreateBatch} className="gap-2">
                                    <Play className="w-4 h-4" /> Start Generation ({csvData.length} items)
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
