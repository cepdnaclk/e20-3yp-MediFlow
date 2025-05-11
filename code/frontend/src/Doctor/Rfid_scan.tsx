import React, { useState, useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RFIDScanPage: React.FC = () => {
  const [uid, setUid] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle RFID scan (keyboard-wedge reader)
  const handleUidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUid(e.target.value);
    setError('');
    setPatient(null);
    setScanned(false);
  };

  // Fetch patient info from backend
  const handleScanStart = async () => {
    if (!uid.trim()) {
      setError("Please scan an RFID card.");
      return;
    }
    setScanning(true);
    setScanned(false);
    setError('');
    setPatient(null);

    // Simulate scan delay
    setTimeout(async () => {
      setScanning(false);
      setScanned(true);

      try {
        const token = localStorage.getItem('token');
        const API_URL = 'http://localhost:5000'; 
        console.log("UID sent to backend:", uid);
        const res = await fetch(
          `${API_URL}/api/patients/rfid/${uid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Patient not found');
        const data = await res.json();
        setPatient(data.patientData);
      } catch (err: any) {
        setError(err.message || "Error fetching patient info.");
      }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex justify-center items-center space-x-10 w-full max-w-6xl">
        {/* RFID Scanner */}
        <div
          className={`flex flex-col items-center bg-white border-4 border-blue-500 p-16 rounded-lg shadow-lg transition-transform duration-500 w-1/2 ${
            scanned ? "translate-x-[-100px]" : ""
          }`}
        >
          <h2 className="text-3xl font-semibold text-blue-500 mb-6">RFID Card Scan</h2>
          <div className={`w-64 h-40 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 rounded-lg mx-auto ${scanning ? "scanning" : ""}`}></div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan RFID card here"
            value={uid}
            onChange={handleUidChange}
            className="mt-6 p-3 border-2 border-blue-300 rounded-lg w-full text-lg text-center outline-none"
            autoFocus
            disabled={scanning}
            onKeyDown={e => {
              if (e.key === 'Enter') handleScanStart();
            }}
          />
          <p className="mt-6 text-xl text-gray-700">
            {scanning
              ? "Scanning..."
              : scanned
              ? "Scan Complete!"
              : "Align the card within the scan area and scan"}
          </p>
          <button
            id="start-scan"
            className="mt-6 bg-green-700 text-white py-3 px-8 text-xl rounded-lg hover:bg-green-500 transition duration-300"
            onClick={handleScanStart}
            disabled={scanning}
          >
            Start Scan
          </button>
          {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
        </div>

        {/* Patient Details */}
        {scanned && patient && (
          <div className="flex flex-col items-center bg-white border-4 border-gray-300 p-12 rounded-lg shadow-lg w-1/2">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">Patient Details</h2>
            <img
              src={patient.photo || "/avatar.png"}
              alt="Patient"
              className="w-40 h-40 rounded-full border-2 border-gray-400 mb-6"
            />
            <p className="text-xl text-gray-700 font-semibold">{patient.firstName + " " + patient.lastName}</p>
            <p className="text-gray-600">Age: {patient.age}</p> 
            <p className="text-gray-600">NIC: {patient.nic}</p>
            <button 
              id="proceed"
              className="mt-6 flex items-center bg-blue-600 text-white py-3 px-8 text-xl rounded-lg hover:bg-blue-500 transition duration-300"
              onClick={() => navigate(`/profile`, { state: { patient } })}
            >
              Proceed <FaArrowRight className="ml-3" />
            </button>
          </div>
        )}
        {/* Show error if scanned but not found */}
        {scanned && !patient && error && (
          <div className="flex flex-col items-center bg-white border-4 border-red-300 p-12 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold text-red-700 mb-6">Patient Not Found</h2>
            <p className="text-lg text-gray-700">{error}</p>
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