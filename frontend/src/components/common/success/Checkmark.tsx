import React, { useEffect, useState } from 'react';
import GreenCheckmark from '@/assets/img/greenCheckmark.gif'
import GreenCheckmarkPng from '@/assets/img/greenCheckmark.png'

const CheckmarkGif = () => {
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 800); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showGif ? (
        <img src={GreenCheckmark} alt="checkmark" width="100px" />
      ) : (
        <img src={GreenCheckmarkPng} alt="checkmark" width="100px" />
      )}
    </div>
  );
};

export default CheckmarkGif;
