import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

import {
  Package,
  AlertCircle,
  Clock,
  Plus,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

interface DispenserData {
  dispenser_name: string;
  status: 'online' | 'offline' | 'dispensing' | 'error' | 'maintenance';
  temperature: number;
  last_seen: string;
  medicine_id?: string;
  id?: string;
  battery_level?: number;
  medicine_count?: number;
  total_capacity?: number;
  error_message?: string;
  wifi_strength?: number;
  medicine_name?: string;
}

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  strength?: string;
  form?: string;
  stockQuantity?: number;
}


interface Prescription {
  id: string;
  medicines: any[];
  prescriptionDate?: string;
  createdAt?: string;
}

const PharmacistDashboard: React.FC = () => {
  const [dispensers, setDispensers] = useState<DispenserData[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todaysPrescriptions, setTodaysPrescriptions] = useState<Prescription[]>([]);

  // Fetch dispensers
  const fetchDispenserData = useCallback(async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      const response = await fetch(`${API_URL}/api/dispensers/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: DispenserData[] = await response.json();
      setDispensers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dispensers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch medicines
  const fetchMedicines = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch(`${API_URL}/api/medicines`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let medicinesData: Medicine[] = [];
      if (Array.isArray(data)) medicinesData = data;
      else if (Array.isArray(data.medicines)) medicinesData = data.medicines;
      else if (Array.isArray(data.data)) medicinesData = data.data;
      setMedicines(medicinesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch medicines');
      setMedicines([]);
    }
  }, []);


  // Fetch today's prescriptions for auto-dispense count
  const fetchTodaysPrescriptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch(`${API_URL}/api/prescriptions/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTodaysPrescriptions(Array.isArray(data.prescriptions) ? data.prescriptions : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch today\'s prescriptions');
      setTodaysPrescriptions([]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDispenserData();
    fetchMedicines();
    fetchTodaysPrescriptions();
  }, [fetchDispenserData, fetchMedicines, fetchTodaysPrescriptions]);

  // Card stats
  const stats = useMemo(() => {
    const online = dispensers.filter(d => d.status === 'online' || d.status === 'dispensing').length;
    const errors = dispensers.filter(d => d.status === 'error').length;
    const total = dispensers.length;

    // Count auto-dispense medicines for today
    let autoDispenseCount = 0;
    todaysPrescriptions.forEach(prescription => {
      if (Array.isArray(prescription.medicines)) {
        // Adjust this logic if your auto-dispense flag is different
        autoDispenseCount += prescription.medicines.filter((med: any) => med.autoDispense === true).length;
      }
    });

    return { online, errors, total, autoDispenseCount };
  }, [dispensers, todaysPrescriptions]);

  // Table data
  const getMedicineName = (medicineId?: string) => {
    if (!medicineId) return 'Not assigned';
    const med = medicines.find(m => m.id === medicineId);
    return med?.name || medicineId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-700';
      case 'dispensing': return 'text-blue-700';
      case 'offline': return 'text-yellow-700';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="inline w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="shadow-lg">
              <CardContent className="flex items-center p-6">
                <Package className="w-10 h-10 text-black mr-4" />
                <div>
                  <p className="text-sm">Total Dispensers</p>
                  <h3 className="text-3xl font-bold">{stats.total}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="shadow-lg">
              <CardContent className="flex items-center p-6">
                <Activity className="w-10 h-10 text-green-700 mr-4" />
                <div>
                  <p className="text-sm">Dispensers Online</p>
                  <h3 className="text-3xl font-bold">{stats.online}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="shadow-lg">
              <CardContent className="flex items-center p-6">
                <Activity className="w-10 h-10 text-blue-700 mr-4" />
                <div>
                  <p className="text-sm">Auto Dispensed Today</p>
                  <h3 className="text-3xl font-bold">{stats.autoDispenseCount}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Medicine Stock Table */}
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-blue-600 text-white">
            <CardTitle className="text-2xl font-semibold">Dispenser Status Table</CardTitle>
            <div className="flex space-x-4">


            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left bg-blue-100">
                    <th className="py-3 px-6 text-black-600">Dispenser</th>
                    <th className="py-3 px-6 text-black-600">Medicine Name</th>
                    <th className="py-3 px-6 text-black-600">Temperature</th>
                    <th className="py-3 px-6 text-black-600">Status</th>
                    <th className="py-3 px-6 text-black-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dispensers.map((disp, idx) => (
                    <motion.tr
                      key={disp.dispenser_name}
                      className="border-b hover:bg-blue-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="py-4 px-6 font-medium text-blue-800">{disp.dispenser_name}</td>
                      <td className="py-4 px-6">{getMedicineName(disp.medicine_id)}</td>

                      <td className="py-4 px-6">{disp.temperature}°C</td>
                      <td className="py-4 px-6">
                        <motion.span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(disp.status)}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {disp.status.charAt(0).toUpperCase() + disp.status.slice(1)}
                        </motion.span>
                      </td>
                      <td className="py-4 px-6">
  
                        <Button variant="outline" className="text-red-400 hover:bg-red-400 hover:text-white border-blue-200">
                          Stop
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {dispensers.length === 0 && (
                <div className="text-center py-8 text-gray-500">No dispensers found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacistDashboard;