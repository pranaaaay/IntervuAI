import React from 'react';
import { useRecordWebcam } from 'react-record-webcam';
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from 'react-icons/bs';
import cameof from '../Images/camera-off.jpg';

export default function Video() {
  const recordWebcam = useRecordWebcam({ frameRate: 60 });

  const stopCamera = () => {
    if (recordWebcam.status === 'OPEN') {
      recordWebcam.close();
    }
  };

  return (
    <div className="container mx-auto rounded px-2 py-5 sm:px-6 lg:px-8">
      <div className="rounded bg-cyan-800 py-6 shadow-lg">
        <div className="mx-auto flex max-w-md flex-col space-y-2 py-2 md:flex-row md:space-x-2 md:space-y-0">
          <button
            onClick={recordWebcam.open}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            aria-label="Open camera"
          >
            <BsCameraVideoFill />
          </button>

          <button
            onClick={stopCamera}
            className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            aria-label="Close camera"
          >
            <BsCameraVideoOffFill />
          </button>

          <button
            onClick={recordWebcam.start}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Start recording
          </button>

          <button
            onClick={recordWebcam.stop}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Stop recording
          </button>
        </div>

        <div className="mt-4">
          {recordWebcam.status === 'CLOSED' ? (
            <img
              src={cameof}
              alt="Camera is closed"
              className="mx-auto w-full max-w-md"
            />
          ) : (
            <video
              ref={recordWebcam.webcamRef}
              autoPlay
              muted
              playsInline
              className="mx-auto w-full max-w-md"
            />
          )}
        </div>
      </div>
    </div>
  );
}