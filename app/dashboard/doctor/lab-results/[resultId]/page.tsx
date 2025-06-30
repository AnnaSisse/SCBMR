"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Beaker, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ExaminationDetails {
  examination_id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  doctor_first_name: string;
  doctor_last_name: string;
  examination_type: string;
  examination_date: string;
  findings: string;
  recommendations?: string;
  notes?: string;
}

export default function ExaminationDetailPage() {
  const { resultId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [examination, setExamination] = useState<ExaminationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [labResults, setLabResults] = useState<any[]>([]);

  useEffect(() => {
    if (resultId) {
      fetchExaminationDetails();
      fetchLabResults();
    }
  }, [resultId]);

  const fetchExaminationDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/examinations/${resultId}`);
      const data = await res.json();
      if (data.success) {
        setExamination(data.data);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch examination details.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchLabResults = async () => {
    try {
      const res = await fetch(`/api/lab-results?patient_id=${examination?.patient_id}`);
      if (!res.ok) return;
      const data = await res.json();
      setLabResults(Array.isArray(data) ? data : []);
    } catch {}
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!examination) return <div className="p-4">Examination record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Examination Record</CardTitle>
          <CardDescription>Details for Patient: {examination.patient_first_name} {examination.patient_last_name}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold">Examination Details</h4>
            <p><strong>Type:</strong> {examination.examination_type}</p>
            <p><strong>Date:</strong> {new Date(examination.examination_date).toLocaleDateString()}</p>
            <p><strong>Doctor:</strong> Dr. {examination.doctor_first_name} {examination.doctor_last_name}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Findings & Recommendations</h4>
            <p><strong>Findings:</strong> {examination.findings}</p>
            {examination.recommendations && <p><strong>Recommendations:</strong> {examination.recommendations}</p>}
          </div>
          <div className="col-span-2 space-y-2">
            <h4 className="font-semibold">Notes</h4>
            <p>{examination.notes || 'No additional notes.'}</p>
          </div>
          <div className="col-span-2 flex gap-2 mt-4">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Beaker className="h-5 w-5 text-blue-600" /> Lab Results</CardTitle>
          <CardDescription>Lab results related to this patient/examination</CardDescription>
        </CardHeader>
        <CardContent>
          {labResults.length === 0 ? (
            <div className="text-gray-500">No lab results found for this patient.</div>
          ) : (
            <ul className="space-y-2">
              {labResults.map((lab) => (
                <li key={lab.result_id} className="border rounded p-2 flex justify-between items-center">
                  <span>{lab.test_name}: <b>{lab.result_value || 'Pending'}</b> ({lab.result_date ? new Date(lab.result_date).toLocaleDateString() : 'N/A'})</span>
                  <Button asChild variant="outline" size="sm"><a href={`/dashboard/lab/results`}>View</a></Button>
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-4 flex items-center gap-2" asChild>
            <a href={`/dashboard/lab/results?order_for_patient=${examination?.patient_id}&examination_id=${examination?.examination_id}`}><Plus className="h-4 w-4" /> Order Lab Test</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 