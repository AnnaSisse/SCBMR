'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Medication } from '@/types/medication';

export default function MedicationsPage() {
    const router = useRouter();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchMedications();
    }, [searchTerm, category, page]);

    const fetchMedications = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(category && { category })
            });

            const response = await fetch(`/api/medications?${queryParams}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            setMedications(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch medications');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMedication = () => {
        router.push('/medications/new');
    };

    const handleMedicationClick = (medicationId: number) => {
        router.push(`/medications/${medicationId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
                <button
                    onClick={handleAddMedication}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Medication
                </button>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Search medications..."
                        />
                    </div>
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">All Categories</option>
                    <option value="antibiotic">Antibiotics</option>
                    <option value="analgesic">Analgesics</option>
                    <option value="antihypertensive">Antihypertensives</option>
                    <option value="antidiabetic">Antidiabetics</option>
                </select>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {medications.map((medication) => (
                                <li
                                    key={medication.medication_id}
                                    onClick={() => handleMedicationClick(medication.medication_id)}
                                    className="cursor-pointer hover:bg-gray-50"
                                >
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-indigo-600 truncate">
                                                    {medication.name}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {medication.description}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {medication.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {medication.dosage_form} - {medication.strength}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    {medication.prescription_count} prescriptions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center">
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
} 