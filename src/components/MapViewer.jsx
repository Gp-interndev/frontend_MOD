import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import MapComponent from './mapcomponent';

const MapViewer = ({ outwardNumber }) => {
  const [screenshots, setScreenshots] = useState([null, null, null]); // Store screenshots per map
  const mapRefs = [useRef(null), useRef(null), useRef(null)];

  const captureScreenshots = async () => {
    const images = [];

    for (let i = 0; i < mapRefs.length; i++) {
      if (mapRefs[i].current) {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Ensure tiles load fully
        const canvas = await html2canvas(mapRefs[i].current, {
          useCORS: true, // Fix for external tiles not rendering
          allowTaint: true,
          logging: false,
        });
        images.push(canvas.toDataURL('image/png'));
      }
    }

    setScreenshots(images); // Store screenshots
  };

  // Capture screenshots automatically when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      captureScreenshots();
    }, 3000); // Allow maps to load before taking a screenshot

    return () => clearTimeout(timer); // Cleanup in case of unmount
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mapRefs.map((ref, index) => (
          <div key={index} ref={ref} className="border rounded shadow relative">
            {screenshots[index] ? (
              <img src={screenshots[index]} alt={`Map Screenshot ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <MapComponent
                cqlFilterZone={`outward = '${outwardNumber}'`}
                cqlFilterWard={index === 0 ? "Aviation_N = 'NDA'" : index === 1 ? "Aviation_N = 'Lohagaon'" : ''}
                initialtoposheet={index === 2}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapViewer;
