"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Patient { /* define fields as needed */ }
interface Examination { /* define fields as needed */ }
interface Hospitalisation { /* define fields as needed */ }
interface User { /* define fields as needed */ }

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [hospitalisations, setHospitalisations] = useState<Hospitalisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showExamForm, setShowExamForm] = useState(false);
  const [examForm, setExamForm] = useState({
    doctor_id: 1, // TODO: Replace with logged-in doctor ID
    examination_type: "",
    findings: "",
    recommendations: "",
    notes: "",
  });
  const [examFormError, setExamFormError] = useState("");
  const [examFormLoading, setExamFormLoading] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showHospForm, setShowHospForm] = useState(false);
  const [hospForm, setHospForm] = useState({
    doctor_id: 1, // TODO: Replace with logged-in doctor ID
    admission_date: new Date().toISOString().split('T')[0],
    ward: "",
    room: "",
    reason: "",
  });
  const [hospFormError, setHospFormError] = useState("");
  const [hospFormLoading, setHospFormLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (id) {
    fetchPatient();
    fetchExaminations();
    fetchHospitalisations();
    }
  }, [id]);

  useEffect(() => {
    if (patient) {
      setInfoForm({
        email: patient.email || "",
        phone_number: patient.phone_number || "",
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "",
        address: patient.address || "",
      });
    }
  }, [patient]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      console.log('Fetching patient with ID:', id);
      const res = await fetch(`/api/patients/${encodeURIComponent(id)}`);
      const data = await res.json();
      console.log('Patient data response:', data);
      if (data.success) {
        setPatient(data.data);
      } else {
        setError(data.message || "Failed to fetch patient");
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError("Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  };

  const fetchExaminations = async () => {
    if (!id) return;
    try {
      console.log('Fetching examinations for patient ID:', id);
      const res = await fetch(`/api/patients/${encodeURIComponent(id)}/examinations`);
      const data = await res.json();
      console.log('Examinations response:', data);
      if (data.success) {
        setExaminations(data.data || []);
      } else {
        console.error('Failed to fetch examinations:', data.message);
        setExaminations([]);
      }
    } catch (err) {
      console.error("Failed to fetch examinations:", err);
      setExaminations([]);
    }
  };

  const fetchHospitalisations = async () => {
    try {
      console.log('Fetching hospitalisations for patient ID:', id);
      const res = await fetch(`/api/hospitalisations?patient_id=${encodeURIComponent(id)}`);
      const data = await res.json();
      console.log('Hospitalisations response:', data);
      if (Array.isArray(data)) {
        setHospitalisations(data);
      } else {
        setHospitalisations([]);
      }
    } catch (err) {
      console.error("Failed to fetch hospitalisations:", err);
      setHospitalisations([]);
    }
  };

  const handleExamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamForm({ ...examForm, [e.target.name]: e.target.value });
  };

  const handleExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExamFormError("");
    if (!examForm.examination_type || !examForm.findings) {
      setExamFormError("Examination Type and Findings are required.");
      return;
    }
    setExamFormLoading(true);
    try {
      const res = await fetch(`/api/patients/${encodeURIComponent(id)}/examinations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      });
      if (!res.ok) throw new Error("Failed to add examination");
      setShowExamForm(false);
      setExamForm({ doctor_id: 1, examination_type: "", findings: "", recommendations: "", notes: "" });
      fetchExaminations();
      toast({ title: "Success", description: "Examination added successfully." });
    } catch (err) {
      setExamFormError("Failed to add examination");
      toast({ title: "Error", description: "Failed to add examination", variant: "destructive" });
    } finally {
      setExamFormLoading(false);
    }
  };

  const handleInfoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  };

  const handleInfoFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/patients/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(infoForm),
      });
      if (!res.ok) throw new Error("Failed to update info");
      setEditingInfo(false);
      fetchPatient();
    } catch (err) {
      alert("Failed to update info");
    }
  };

  const handleHospFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHospForm({ ...hospForm, [e.target.name]: e.target.value });
  };

  const handleHospSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHospFormError("");
    // Simple client-side validation
    if (!hospForm.admission_date || !hospForm.ward || !hospForm.room || !hospForm.reason) {
      setHospFormError("All fields are required.");
      return;
    }
    setHospFormLoading(true);
    try {
      const res = await fetch(`/api/hospitalisations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hospForm, patient_id: id }),
      });
      if (!res.ok) throw new Error("Failed to create hospitalisation");
      setShowHospForm(false);
      setHospForm({
        doctor_id: 1,
        admission_date: new Date().toISOString().split('T')[0],
        ward: "",
        room: "",
        reason: "",
      });
      fetchHospitalisations();
      toast({ title: "Success", description: "Patient admitted successfully." });
    } catch (err) {
      setHospFormError("Failed to create hospitalisation");
      toast({ title: "Error", description: "Failed to create hospitalisation", variant: "destructive" });
    } finally {
      setHospFormLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!patient) return <div>Patient not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Patient: {patient.first_name} {patient.last_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="examinations">Examinations</TabsTrigger>
              <TabsTrigger value="hospitalisations">Hospitalisations</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <div>
                <p><b>Email:</b> {patient.email || "-"}</p>
                <p><b>Phone:</b> {patient.phone_number || "-"}</p>
                <p><b>Date of Birth:</b> {patient.date_of_birth || "-"}</p>
                <p><b>Gender:</b> {patient.gender || "-"}</p>
                <p><b>Address:</b> {patient.address || "-"}</p>
                {/* Show Edit Info button only for Admin or Receptionist */}
                {currentUser && (currentUser.role === "Admin" || currentUser.role === "Receptionist") && !editingInfo && (
                  <Button className="mt-4" onClick={() => setEditingInfo(true)}>
                    Edit Info
                  </Button>
                )}
                {/* Edit Info Form */}
                {editingInfo && currentUser && (currentUser.role === "Admin" || currentUser.role === "Receptionist") && (
                  <form onSubmit={handleInfoFormSubmit} className="mt-4 space-y-2">
                    <div>
                      <label>Email</label>
                      <Input name="email" value={infoForm.email} onChange={handleInfoFormChange} required />
                    </div>
                    <div>
                      <label>Phone</label>
                      <Input name="phone_number" value={infoForm.phone_number} onChange={handleInfoFormChange} required />
                    </div>
                    <div>
                      <label>Date of Birth</label>
                      <Input name="date_of_birth" value={infoForm.date_of_birth} onChange={handleInfoFormChange} required />
                    </div>
                    <div>
                      <label>Gender</label>
                      <Input name="gender" value={infoForm.gender} onChange={handleInfoFormChange} required />
                    </div>
                    <div>
                      <label>Address</label>
                      <Input name="address" value={infoForm.address} onChange={handleInfoFormChange} required />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Save</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingInfo(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </TabsContent>
            <TabsContent value="examinations">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Examinations</h2>
                <Button onClick={() => setShowExamForm((v) => !v)}>
                  {showExamForm ? "Cancel" : "Add Examination"}
                </Button>
              </div>
              {showExamForm && (
                <form onSubmit={handleExamSubmit} className="mb-6 space-y-2">
                  <div>
                    <label>Type</label>
                    <Input name="examination_type" value={examForm.examination_type} onChange={handleExamFormChange} required />
                  </div>
                  <div>
                    <label>Findings</label>
                    <Textarea name="findings" value={examForm.findings} onChange={handleExamFormChange} required />
                  </div>
                  <div>
                    <label>Recommendations</label>
                    <Textarea name="recommendations" value={examForm.recommendations} onChange={handleExamFormChange} />
                  </div>
                  <div>
                    <label>Notes</label>
                    <Textarea name="notes" value={examForm.notes} onChange={handleExamFormChange} />
                  </div>
                  {examFormError && <div className="text-red-500 text-sm">{examFormError}</div>}
                  <Button type="submit" disabled={examFormLoading}>
                    {examFormLoading ? "Saving..." : "Save Examination"}
                  </Button>
                </form>
              )}
              {examinations.length > 0 ? (
                <ul className="space-y-4">
                      {examinations.map((exam) => (
                    <li key={exam.examination_id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{exam.examination_type}</h3>
                        <span className="text-sm text-gray-500">{new Date(exam.examination_date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">Dr. {exam.doctor_first_name} {exam.doctor_last_name}</p>
                      <div className="mt-2">
                        <p><b>Findings:</b> {exam.findings}</p>
                        {exam.recommendations && <p><b>Recommendations:</b> {exam.recommendations}</p>}
                      </div>
                    </li>
                      ))}
                </ul>
              ) : (
                <p>No examinations found.</p>
                )}
            </TabsContent>
            <TabsContent value="hospitalisations">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Hospitalisations</h2>
                <Button onClick={() => setShowHospForm((v) => !v)}>
                  {showHospForm ? "Cancel" : "Admit Patient"}
                </Button>
              </div>
              {showHospForm && (
                <form onSubmit={handleHospSubmit} className="mb-6 space-y-2">
                  <div>
                    <label>Admission Date</label>
                    <Input name="admission_date" type="date" value={hospForm.admission_date} onChange={handleHospFormChange} required />
                  </div>
                  <div>
                    <label>Ward</label>
                    <Input name="ward" value={hospForm.ward} onChange={handleHospFormChange} required />
                  </div>
                  <div>
                    <label>Room</label>
                    <Input name="room" value={hospForm.room} onChange={handleHospFormChange} required />
                  </div>
                  <div>
                    <label>Reason</label>
                    <Textarea name="reason" value={hospForm.reason} onChange={handleHospFormChange} required />
                  </div>
                  {hospFormError && <div className="text-red-500 text-sm">{hospFormError}</div>}
                  <Button type="submit" disabled={hospFormLoading}>
                    {hospFormLoading ? "Admitting..." : "Admit"}
                  </Button>
                </form>
              )}
              {hospitalisations.length > 0 ? (
                <ul className="space-y-4">
                  {hospitalisations.map((hosp) => (
                    <Link key={hosp.hospitalisation_id} href={`/dashboard/doctor/hospitalisations/${hosp.hospitalisation_id}`} passHref>
                      <li className="p-4 border rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-gray-50 cursor-pointer">
                        <div>
                          <p><b>Admission:</b> {new Date(hosp.admission_date).toLocaleDateString()}</p>
                          <p><b>Discharge:</b> {hosp.discharge_date ? new Date(hosp.discharge_date).toLocaleDateString() : 'N/A'}</p>
                          <p><b>Ward:</b> {hosp.ward}</p>
                          <p><b>Room:</b> {hosp.room}</p>
                          <p><b>Reason:</b> {hosp.reason}</p>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${hosp.discharge_date ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {hosp.discharge_date ? 'Discharged' : 'Active'}
                          </span>
                        </div>
                      </li>
                    </Link>
                    ))}
                </ul>
              ) : (
                <p>No hospitalisation records found.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 