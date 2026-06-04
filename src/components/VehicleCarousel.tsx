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

export default function VehicleCarousel({ vehicles }: VehicleCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // ⬇️ KEY CHANGE: Increased to 3 items per page to shrink card widths ⬇️
  const itemsPerPage = 3;

  const safeVehicles = vehicles || [];
  const pages: Vehicle[][] = [];
  for (let i = 0; i < safeVehicles.length; i += itemsPerPage) {
    pages.push(safeVehicles.slice(i, i + itemsPerPage));
  }

  const totalPages = pages.length;

  const handleNext = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  if (totalPages === 0) return null;

  const progressPercent = ((currentPage + 1) / totalPages) * 100;

  return (
    /* ⬇️ KEY CHANGE: Reduced max container width from max-w-5xl to max-w-4xl ⬇️ */
    <div className='w-full  mx-auto bg-white text-slate-800 p-4 rounded-xl shadow-md relative overflow-hidden border border-slate-100'>
      {/* Background blurs adjusted down for smaller bounding footprint */}
      <div className='absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full filter blur-2xl pointer-events-none' />
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full filter blur-2xl pointer-events-none' />

      {/* Header Panel Layout */}
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

      {/* Main Slide Track Window */}
      <div
        className='flex transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)'
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {pages.map((page, pageIdx) => (
          /* ⬇️ KEY CHANGE: Swapped md:grid-cols-2 to md:grid-cols-3 for 3 columns ⬇️ */
          <div
            key={`page-${pageIdx}`}
            className='w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-0.5'
          >
            {page.map((car, carIdx) => (
              <div
                key={`${car.vin}-${pageIdx}-${carIdx}`}
                className='group relative bg-white rounded-lg overflow-hidden border border-slate-200/70 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between shadow-sm'
              >
                {/* Compact Image Window Header (Height dropped from h-36 to h-28) */}
                <div className='relative h-28 w-full overflow-hidden bg-slate-100'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-103'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60' />
                  <span className='absolute bottom-1.5 left-2 bg-white/95 text-slate-900 text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase shadow-sm border border-slate-100'>
                    {car.vehicleType}
                  </span>
                </div>

                {/* Tightened internal padding from p-4 to p-3 */}
                <div className='p-3 flex-grow flex flex-col justify-between relative z-10'>
                  <div>
                    <div className='text-[9px] font-bold text-indigo-600 uppercase tracking-widest'>
                      {car.make}
                    </div>
                    {/* Heading dropped to text-base to fit thinner card layout dimensions cleanly */}
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
                    {/* Tighter margin offsets inside payment parameters grid */}
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

                    {/* Highly streamlined bottom summary bar */}
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

      {/* Footer Interface Bar */}
      <div className='flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 relative z-10'>
        {/* Compact pagination jump indicators */}
        <div className='flex items-center space-x-1'>
          {pages.map((_, idx) => (
            <button
              key={`page-btn-${idx}`}
              onClick={() => setCurrentPage(idx)}
              className={`w-6 h-6 rounded font-mono text-[9px] font-bold transition-all duration-300 ${
                currentPage === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
              }`}
              aria-label={`Jump to page ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Arrows Buttons */}
      </div>
      <div className='flex space-x-1.5'>
        <button
          onClick={handlePrev}
          className='bg-white hover:bg-slate-50 text-slate-600 active:scale-95 w-8 h-8 rounded-md shadow-sm border border-slate-200 flex items-center justify-center transition-all'
          aria-label='Previous Page'
        >
          <ArrowLeft className='w-3.5 h-3.5' />
        </button>
        <button
          onClick={handleNext}
          className='bg-white hover:bg-slate-50 text-slate-600 active:scale-95 w-8 h-8 rounded-md shadow-sm border border-slate-200 flex items-center justify-center transition-all'
          aria-label='Next Page'
        >
          <ArrowRight className='w-3.5 h-3.5' />
        </button>
      </div>
    </div>
  );
}
