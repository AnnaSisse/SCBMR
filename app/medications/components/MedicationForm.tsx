'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Medication } from '@/types/medication';

interface MedicationFormProps {
    medication?: Medication;
    mode: 'add' | 'edit';
}

export default function MedicationForm({ medication, mode }: MedicationFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        dosage_form: '',
        strength: '',
        manufacturer: '',
        storage_instructions: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (medication) {
            setFormData({
                name: medication.name,
                description: medication.description || '',
                category: medication.category || '',
                dosage_form: medication.dosage_form || '',
                strength: medication.strength || '',
                manufacturer: medication.manufacturer || '',
                storage_instructions: medication.storage_instructions || ''
            });
        }
    }, [medication]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = mode === 'add' ? '/api/medications' : `/api/medications/${medication?.medication_id}`;
            const method = mode === 'add' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            router.push('/medications');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save medication');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="">Select a category</option>
                    <option value="antibiotic">Antibiotic</option>
                    <option value="analgesic">Analgesic</option>
                    <option value="antihypertensive">Antihypertensive</option>
                    <option value="antidiabetic">Antidiabetic</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="dosage_form" className="block text-sm font-medium text-gray-700">
                        Dosage Form
                    </label>
                    <input
                        type="text"
                        name="dosage_form"
                        id="dosage_form"
                        value={formData.dosage_form}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="strength" className="block text-sm font-medium text-gray-700">
                        Strength
                    </label>
                    <input
                        type="text"
                        name="strength"
                        id="strength"
                        value={formData.strength}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                    Manufacturer
                </label>
                <input
                    type="text"
                    name="manufacturer"
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="storage_instructions" className="block text-sm font-medium text-gray-700">
                    Storage Instructions
                </label>
                <textarea
                    name="storage_instructions"
                    id="storage_instructions"
                    rows={2}
                    value={formData.storage_instructions}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? 'Saving...' : mode === 'add' ? 'Add Medication' : 'Update Medication'}
                </button>
            </div>
        </form>
    );
} 