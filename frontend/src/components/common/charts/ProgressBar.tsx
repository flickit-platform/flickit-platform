import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Calculate the stroke-dasharray and stroke-dashoffset based on the progress
  const circumference = 471.2389; // You may need to adjust this based on your specific SVG path
  const dasharray = `${circumference} ${circumference}`;
  const dashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width="160" height="160" viewBox="0 0 160 144" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.79969 101.311C4.31338 101.738 2.75738 100.88 2.38277 99.3795C-0.39578 88.2513 -0.751457 76.6441 1.35342 65.3468C3.62942 53.1311 8.71975 41.6134 16.2209 31.7069C23.722 21.8004 33.4277 13.7774 44.5685 8.27405C55.7094 2.77066 67.979 -0.0618651 80.4049 0.00102461C92.8307 0.0639144 105.071 3.02049 116.156 8.63637C127.24 14.2523 136.864 22.373 144.265 32.3549C151.665 42.3369 156.639 53.9055 158.791 66.1437C160.781 77.4617 160.308 89.0646 157.417 100.164C157.027 101.661 155.463 102.503 153.981 102.061C152.499 101.619 151.661 100.06 152.047 98.563C154.692 88.2979 155.115 77.5749 153.276 67.1136C151.274 55.7321 146.649 44.9733 139.766 35.6901C132.884 26.4069 123.933 18.8546 113.625 13.6318C103.316 8.40905 91.9326 5.65944 80.3765 5.60095C68.8205 5.54246 57.4097 8.17671 47.0487 13.2949C36.6878 18.413 27.6615 25.8744 20.6854 35.0874C13.7094 44.3005 8.97536 55.0119 6.85868 66.3726C4.91313 76.8147 5.22796 87.5415 7.76875 97.8327C8.1394 99.3341 7.286 100.884 5.79969 101.311Z"
        fill="black"
        fillOpacity="0.1"
        stroke="#2ADCE7"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={dasharray}
        strokeDashoffset={dashoffset}
      />
    </svg>
  );
};

export default ProgressBar;
