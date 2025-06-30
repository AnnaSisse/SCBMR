"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HospitalisationsPage() {
  // Replace this with actual doctor ID from auth/session in a real app
  const doctorId = 1; // TODO: Replace with real doctor ID
  const [hospitalisations, setHospitalisations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHospitalisations();
  }, []);

  const fetchHospitalisations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/hospitalisations?doctor_id=${doctorId}`);
      if (!res.ok) throw new Error("Failed to fetch hospitalisations");
      const data = await res.json();
      setHospitalisations(data);
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (id: number) => {
    const discharge_date = new Date().toISOString();
    try {
      const res = await fetch("/api/hospitalisations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalisation_id: id, discharge_date }),
      });
      if (!res.ok) throw new Error("Failed to discharge");
      fetchHospitalisations();
    } catch (err) {
      alert("Error discharging patient");
    }
  };

  const safeHospitalisations = Array.isArray(hospitalisations) ? hospitalisations : [];

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Hospitalisations</CardTitle>
          <Link href="/dashboard/doctor/hospitalisations/new">
            <Button className="mt-2">Admit New Patient</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : safeHospitalisations.length === 0 ? (
            <div>No hospitalisations found.</div>
          ) : (
            <table className="w-full text-sm mt-4">
              <thead>
                <tr>
                  <th className="text-left">Patient</th>
                  <th className="text-left">Doctor</th>
                  <th className="text-left">Admission</th>
                  <th className="text-left">Discharge</th>
                  <th className="text-left">Ward</th>
                  <th className="text-left">Room</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeHospitalisations.map((h) => (
                  <tr key={h.hospitalisation_id} className="border-b">
                    <td>{h.patient_first_name} {h.patient_last_name}</td>
                    <td>{h.doctor_first_name} {h.doctor_last_name}</td>
                    <td>{h.admission_date ? new Date(h.admission_date).toLocaleString() : "-"}</td>
                    <td>{h.discharge_date ? new Date(h.discharge_date).toLocaleString() : "-"}</td>
                    <td>{h.ward}</td>
                    <td>{h.room}</td>
                    <td>{h.status}</td>
                    <td>
                      {h.status === "active" && (
                        <Button size="sm" onClick={() => handleDischarge(h.hospitalisation_id)}>
                          Discharge
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 