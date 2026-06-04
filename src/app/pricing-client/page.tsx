'use client';

import { useState, useEffect } from 'react';
import VehicleCarousel from '@/components/VehicleCarousel';
import { Loader } from '@/components/ai-elements/loader';
import { vehiclesMockData } from '@/data/vehiclesMockData';

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

const DEFAULT_API_ENDPOINT =
  'http://localhost:8080/pricingengine/api/v1/vehicles/estimates?phoneNumber=2000013365&zipCode=10001';

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchVehicles() {
      const endpoint =
        process.env.NEXT_PUBLIC_API_ENDPOINT || DEFAULT_API_ENDPOINT;
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setVehicles(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  return (
    <main className='min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <VehicleCarousel vehicles={vehicles} />
    </main>
  );
}
