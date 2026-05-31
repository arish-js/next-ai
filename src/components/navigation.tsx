import { Button } from '@/components/ui/button';

export const Navigation = () => {
  return (
    <nav className='border-b border-[var(--foreground)]/10'>
      <div className='flex container h-16 items-center justify-between px-4  mx-auto'>
        <div className='text-xl font-bold text-red-600 uppercase'>
          Toyota Connect
        </div>

        <div className='flex gap-2'></div>
      </div>
    </nav>
  );
};
