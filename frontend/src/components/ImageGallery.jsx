import React, { useState, useContext } from 'react';
import { AppContext } from '../context/context';

export default function ImageGallery({ images = [] }) {
  const { API_BASE_URL } = useContext(AppContext);
  const [active, setActive] = useState(null);

  const open = (img) => setActive(img);
  const close = () => setActive(null);

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button key={i} onClick={() => open(img)} className="block overflow-hidden rounded-lg shadow-md">
            <img src={`${API_BASE_URL}${img.thumbnail}`} alt={`img-${i}`} className="w-full h-40 object-contain object-center bg-gray-100" />
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={close}>
          <div className="max-w-6xl w-full p-4">
            <img src={`${API_BASE_URL}${active.optimized}`} alt="full" className="w-full h-[80vh] object-contain rounded-lg shadow-xl mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
