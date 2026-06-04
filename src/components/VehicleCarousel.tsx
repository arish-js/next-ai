'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

interface VehicleCarouselProps {
  vehicles: Vehicle[];
}

export default function VehicleCarousel({
  vehicles,
}: VehicleCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;

  const safeVehicles = vehicles || [];

  const pages: Vehicle[][] = [];

  for (let i = 0; i < safeVehicles.length; i += itemsPerPage) {
    pages.push(safeVehicles.slice(i, i + itemsPerPage));
  }

  const totalPages = pages.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (totalPages === 0) return null;

  const progressPercent = ((currentPage + 1) / totalPages) * 100;

  const startItem = currentPage * itemsPerPage + 1;

  const endItem = Math.min(
    (currentPage + 1) * itemsPerPage,
    safeVehicles.length
  );

  return (
    <div className='w-full mx-auto bg-white text-slate-800 p-4 rounded-xl shadow-md relative overflow-hidden border border-slate-100'>
      {/* Background Effects */}
      <div className='absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full blur-2xl pointer-events-none' />

      {/* Header */}
      <div className='mb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2 relative z-10'>
        <div>
          <span className='text-[9px] font-bold uppercase tracking-widest text-indigo-600'>
            Featured Fleet
          </span>

          <h2 className='text-lg font-black text-slate-900 tracking-tight mt-0.5'>
            Explore Live Inventory
          </h2>
        </div>

        <div className='flex flex-col items-end gap-1 w-full sm:w-auto'>
          <div className='text-xs font-semibold tracking-wider text-slate-500'>
            <span className='text-base font-black text-slate-900'>
              {String(currentPage + 1).padStart(2, '0')}
            </span>

            <span className='mx-1 text-slate-300'>/</span>

            {String(totalPages).padStart(2, '0')}
          </div>

          <div className='w-20 h-1 bg-slate-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-indigo-600 transition-all duration-500 ease-out'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        className='flex transition-transform duration-500 ease-in-out'
        style={{
          transform: `translateX(-${currentPage * 100}%)`,
        }}
      >
        {pages.map((page, pageIdx) => (
          <div
            key={`page-${pageIdx}`}
            className='w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-0.5'
          >
            {page.map((car, carIdx) => (
              <div
                key={`${car.vin}-${pageIdx}-${carIdx}`}
                className='group relative bg-white rounded-lg overflow-hidden border border-slate-200/70 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between shadow-sm'
              >
                {/* Vehicle Image */}
                <div className='relative h-28 w-full overflow-hidden bg-slate-100'>
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />

                  <div className='absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60' />

                  <span className='absolute bottom-1.5 left-2 bg-white/95 text-slate-900 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase shadow-sm border border-slate-100'>
                    {car.vehicleType}
                  </span>
                </div>

                {/* Card Content */}
                <div className='p-3 flex-grow flex flex-col justify-between'>
                  <div>
                    <div className='text-[9px] font-bold text-indigo-600 uppercase tracking-widest'>
                      {car.make}
                    </div>

                    <h3 className='text-base font-black text-slate-900 leading-tight mt-0.5 group-hover:text-indigo-600 transition-colors truncate'>
                      {car.modelYear} {car.model}
                    </h3>

                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <span className='text-[9px] bg-slate-50 text-slate-600 px-1 py-0.5 rounded border border-slate-200/80 font-medium'>
                        {car.trim}
                      </span>

                      <span className='text-[8px] font-mono text-slate-400 tracking-wider truncate max-w-[80px]'>
                        {car.vin}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className='grid grid-cols-2 gap-1 mt-3 pt-2 border-t border-slate-100'>
                      <div>
                        <p className='text-[8px] font-bold text-slate-400 uppercase tracking-wider'>
                          MSRP VALUE
                        </p>

                        <p className='text-sm font-bold text-slate-700 mt-0.5'>
                          ${car.msrp.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className='text-[8px] font-bold text-slate-400 uppercase tracking-wider'>
                          EST. MONTHLY
                        </p>

                        <p className='text-base font-black text-emerald-600 mt-0.5'>
                          ${car.monthlyPay.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className='mt-2.5 bg-slate-50 border border-slate-100 p-1.5 rounded-md flex justify-between items-center text-[10px] text-slate-500 font-medium'>
                      <span>
                        Total:{' '}
                        <strong className='text-slate-700'>
                          ${car.totalPay.toLocaleString()}
                        </strong>
                      </span>

                      <span className='text-indigo-600 font-bold'>
                        {car.rate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer Pagination */}
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 relative z-10'>
        <div className='text-sm text-slate-500'>
          Showing{' '}
          <span className='font-semibold text-slate-900'>
            {startItem}
          </span>
          -
          <span className='font-semibold text-slate-900'>
            {endItem}
          </span>{' '}
          of{' '}
          <span className='font-semibold text-slate-900'>
            {safeVehicles.length}
          </span>{' '}
          vehicles
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed'
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <span className='px-2 text-sm font-medium text-slate-500'>
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed'
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}