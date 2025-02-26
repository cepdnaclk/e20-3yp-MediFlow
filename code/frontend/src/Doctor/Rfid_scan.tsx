import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RFIDScanPage: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleScanStart = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex justify-center items-center space-x-10 w-full max-w-6xl">
        {/* RFID Scanner */}
        <div
          className={`flex flex-col items-center bg-white border-4 border-blue-500 p-16 rounded-lg shadow-lg transition-transform duration-500 w-1/2 $ {
            scanned ? "translate-x-[-100px]" : ""
          }`}
        >
          <h2 className="text-3xl font-semibold text-blue-500 mb-6">RFID Card Scan</h2>
          <div className={`w-64 h-40 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 rounded-lg mx-auto ${scanning ? "scanning" : ""}`}></div>
          <p className="mt-6 text-xl text-gray-700">
            {scanning ? "Scanning..." : scanned ? "Scan Complete!" : "Align the card within the scan area"}
          </p>
          <button
            className="mt-6 bg-green-700 text-white py-3 px-8 text-xl rounded-lg hover:bg-green-500 transition duration-300"
            onClick={handleScanStart}
          >
            Start Scan
          </button>
        </div>

        {/* Patient Details (only show after scanning) */}
        {scanned && (
          <div className="flex flex-col items-center bg-white border-4 border-gray-300 p-12 rounded-lg shadow-lg w-1/2">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Patient Details</h2>
            <img
              src="/avatar.png"
              alt="Patient"
              className="w-40 h-40 rounded-full border-2 border-gray-400 mb-6"
            />
            <p className="text-xl text-gray-700 font-semibold">John Doe</p>
            <p className="text-gray-600">Address: 123 Main St, City</p>
            <p className="text-gray-600">Age: 45</p>
            <button className="mt-6 flex items-center bg-blue-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-blue-500 transition duration-300"
            onClick={() => navigate('/profile')}>
              Proceed <FaArrowRight className="ml-3" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .scanning {
          animation: scanning 4s linear infinite;
        }

        @keyframes scanning {
          0% { background-position: -250px 0; }
          100% { background-position: 250px 0; }
        }
      `}</style>
    </div>
  );
};

export default RFIDScanPage;
