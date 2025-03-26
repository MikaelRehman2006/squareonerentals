'use client';

import { useEffect, useState } from 'react';

export function BackgroundPattern() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div 
        className={`absolute inset-0 bg-[url('/images/cityscape.svg')] bg-repeat-x bg-bottom opacity-0 transition-opacity duration-1000 ${
          loaded ? 'opacity-[0.07]' : ''
        }`}
        style={{
          height: '100vh',
          backgroundSize: 'auto 300px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white" />
    </div>
  );
}
