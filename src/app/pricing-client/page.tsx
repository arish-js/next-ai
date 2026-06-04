'use client';

import { useState } from 'react';
import VehicleCarousel from '@/components/VehicleCarousel';
import { Loader } from '@/components/ai-elements/loader';
import { vehiclesMockData } from '../../data/vehiclesMockData'
import './pageStyle.css'


interface Vehicle {
	vin: string;
	vehicleType: string;
	make: string;
	model: string;
	modelYear: string;
	trim: string;
	msrp: number;
	image: string;
	monthlyPay: number;
	totalPay: number;
	rate: number;
}

const DEFAULT_API_ENDPOINT = '/api/v1/vehicles/estimates';

export default function Home() {
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [zipCode, setZipCode] = useState('');

	const [phoneError, setPhoneError] = useState('');
	const [zipError, setZipError] = useState('');
	const [apiError, setApiError] = useState('');

	const [loading, setLoading] = useState(false);

	const validateForm = () => {
		let valid = true;

		setPhoneError('');
		setZipError('');

		if (!phoneNumber.trim()) {
			setPhoneError('Phone number is required');
			valid = false;
		} else if (!/^\d{10}$/.test(phoneNumber)) {
			setPhoneError('Phone number must be 10 digits');
			valid = false;
		}

		if (!zipCode.trim()) {
			setZipError('ZIP code is required');
			valid = false;
		} else if (!/^\d{5}$/.test(zipCode)) {
			setZipError('ZIP code must be 5 digits');
			valid = false;
		}

		return valid;
	};

	const handleSearch = async () => {
		setApiError('');

		if (!validateForm()) {
			setVehicles([]);
			return;
		}

		setLoading(true);
		setVehicles([]);

		try {
			const params = new URLSearchParams({
				phoneNumber,
				zipCode,
			});

			const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}${DEFAULT_API_ENDPOINT}?${params.toString()}`;

			const response = await fetch(endpoint);

			if (!response.ok) {
				throw new Error('Unable to fetch vehicle estimates');
			}

			const data = await response.json();

			if (!data || data.length === 0) {
				setApiError('No vehicles found for the provided details.');
				return;
			}

			setVehicles(data);
		} catch (error) {
			setVehicles([]);
			setApiError(
				error instanceof Error
					? error.message
					: 'Something went wrong. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-slate-100 py-10 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-slate-800">
						Vehicle Financing Estimates
					</h1>

					<p className="mt-2 text-slate-500">
						Search available vehicle estimates using your phone number and ZIP
						code.
					</p>
				</div>

				{/* Search Card */}
				<div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-10">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Phone Number */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Phone Number
							</label>

							<input
								type="text"
								value={phoneNumber}
								maxLength={10}
								onChange={(e) =>
									setPhoneNumber(e.target.value.replace(/\D/g, ''))
								}
								placeholder="Enter 10-digit phone number"
								className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${phoneError
									? 'border-red-500 focus:ring-red-200'
									: 'border-slate-300 focus:ring-blue-200'
									}`}
							/>

							{phoneError && (
								<p className="mt-1 text-sm text-red-500">{phoneError}</p>
							)}
						</div>

						{/* ZIP Code */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								ZIP Code
							</label>

							<input
								type="text"
								value={zipCode}
								maxLength={5}
								onChange={(e) =>
									setZipCode(e.target.value.replace(/\D/g, ''))
								}
								placeholder="Enter ZIP code"
								className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${zipError
									? 'border-red-500 focus:ring-red-200'
									: 'border-slate-300 focus:ring-blue-200'
									}`}
							/>

							{zipError && (
								<p className="mt-1 text-sm text-red-500">{zipError}</p>
							)}
						</div>

						{/* Search Button */}
						<div className="flex items-end">
							<button
								onClick={handleSearch}
								disabled={loading}
								className="w-full rounded-lg bg-red-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
							>
								{loading ? 'Searching...' : 'Search Vehicles'}
							</button>
						</div>
					</div>
				</div>

				{/* Loader */}
				{loading && (
					<div className="flex justify-center py-10">
						<Loader />
					</div>
				)}

				{/* API Error */}
				{!loading && apiError && (
					<div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center mb-6">
						{apiError}
					</div>
				)}

				{/* Vehicle Results */}
				{!loading && !apiError && vehicles.length > 0 && (
					<div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
						<h2 className="text-xl font-semibold text-slate-800 mb-6">
							Available Vehicles ({vehicles.length})
						</h2>

						<VehicleCarousel vehicles={vehicles} />
					</div>
				)}
			</div>
		</main>
	);
}