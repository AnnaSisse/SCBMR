"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface HospitalisationDetails {
  hospitalisation_id: number;
  patient_id: number;
  patient_first_name: string;
  patient_last_name: string;
  doctor_first_name: string;
  doctor_last_name: string;
  admission_date: string;
  discharge_date?: string;
  ward: string;
  room: string;
  reason: string;
  notes?: string;
  status: string;
}

export default function HospitalisationDetailPage() {
  const { hospitalisationId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [hospitalisation, setHospitalisation] = useState<HospitalisationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ discharge_date: '', notes: '' });

  useEffect(() => {
    if (hospitalisationId) {
      fetchHospitalisationDetails();
    }
  }, [hospitalisationId]);

  useEffect(() => {
    if (hospitalisation) {
      setEditForm({
        discharge_date: hospitalisation.discharge_date ? new Date(hospitalisation.discharge_date).toISOString().split('T')[0] : '',
        notes: hospitalisation.notes || ''
      });
    }
  }, [hospitalisation]);

  const fetchHospitalisationDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hospitalisations/${hospitalisationId}`);
      const data = await res.json();
      if (data.success) {
        setHospitalisation(data.data);
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch hospitalisation details.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/hospitalisations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalisation_id: hospitalisation?.hospitalisation_id,
          discharge_date: editForm.discharge_date || null,
          notes: editForm.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      
      toast({ title: 'Success', description: 'Hospitalisation record updated.' });
      setIsEditDialogOpen(false);
      fetchHospitalisationDetails(); // Refresh data
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDownloadReport = () => {
    if (!hospitalisation) return;
    const lines = [
      `Hospitalisation Report`,
      `---------------------`,
      `Patient: ${hospitalisation.patient_first_name} ${hospitalisation.patient_last_name}`,
      `Doctor: Dr. ${hospitalisation.doctor_first_name} ${hospitalisation.doctor_last_name}`,
      `Admission Date: ${new Date(hospitalisation.admission_date).toLocaleDateString()}`,
      `Discharge Date: ${hospitalisation.discharge_date ? new Date(hospitalisation.discharge_date).toLocaleDateString() : 'N/A'}`,
      `Ward: ${hospitalisation.ward}`,
      `Room: ${hospitalisation.room}`,
      `Status: ${hospitalisation.status}`,
      `Reason: ${hospitalisation.reason}`,
      `Notes: ${hospitalisation.notes || 'None'}`,
    ];
    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospitalisation-report-${hospitalisation.hospitalisation_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!hospitalisation) return <div className="p-4">Hospitalisation record not found.</div>;

  const statusVariant = hospitalisation.status === 'Active' ? 'default' : 'secondary';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Hospitalisation Record</CardTitle>
              <CardDescription>Details for Patient: {hospitalisation.patient_first_name} {hospitalisation.patient_last_name}</CardDescription>
            </div>
            <Badge variant={statusVariant}>{hospitalisation.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold">Admission Details</h4>
            <p><strong>Admission Date:</strong> {new Date(hospitalisation.admission_date).toLocaleDateString()}</p>
            <p><strong>Admitting Doctor:</strong> Dr. {hospitalisation.doctor_first_name} {hospitalisation.doctor_last_name}</p>
            <p><strong>Ward:</strong> {hospitalisation.ward}</p>
            <p><strong>Room:</strong> {hospitalisation.room}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Discharge Details</h4>
            <p><strong>Discharge Date:</strong> {hospitalisation.discharge_date ? new Date(hospitalisation.discharge_date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <h4 className="font-semibold">Medical Information</h4>
            <p><strong>Reason for Admission:</strong> {hospitalisation.reason}</p>
            <p><strong>Notes:</strong> {hospitalisation.notes || 'No additional notes.'}</p>
          </div>
          <div className="col-span-2 flex gap-2 mt-4">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Discharge/Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Hospitalisation Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="discharge_date" className="block text-sm font-medium text-gray-700">Discharge Date</label>
                    <Input
                      id="discharge_date"
                      type="date"
                      value={editForm.discharge_date}
                      onChange={(e) => setEditForm({ ...editForm, discharge_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <Textarea
                      id="notes"
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Add any relevant notes..."
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleDownloadReport}>
              <FileDown className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 