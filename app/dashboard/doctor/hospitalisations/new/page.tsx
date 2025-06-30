"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewHospitalisationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    patient_id: "",
    doctor_id: "", // In a real app, this would be the logged-in doctor
    reason: "",
    ward: "",
    room: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/hospitalisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          patient_id: Number(form.patient_id),
          doctor_id: Number(form.doctor_id),
          admission_date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to admit patient");
      router.push("/dashboard/doctor/hospitalisations");
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Admit Patient (Hospitalisation)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patient_id">Patient ID</Label>
              <Input name="patient_id" value={form.patient_id} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="doctor_id">Doctor ID</Label>
              <Input name="doctor_id" value={form.doctor_id} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="reason">Reason for Hospitalisation</Label>
              <Textarea name="reason" value={form.reason} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="ward">Ward</Label>
              <Input name="ward" value={form.ward} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input name="room" value={form.room} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? "Admitting..." : "Admit Patient"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 