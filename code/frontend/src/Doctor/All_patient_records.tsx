import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  ChevronRight,
  Phone,
  Calendar as CalendarIcon,
  Activity,
  AlertCircle
} from 'lucide-react';

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import { Button } from '../components/ui/button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';

const API_URL = import.meta.env.VITE_API_URL;

const PatientRecords = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorPatients();
  }, []);

  useEffect(() => {
    // Filter patients based on search term
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.rfidCardUID.includes(searchTerm) ||
      (patient.lastDiagnosis && patient.lastDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchDoctorPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/doctor/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
        setFilteredPatients(data.patients);
      } else {
        console.error('Failed to fetch patients');
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patientId, patientName) => {
  // Navigate to the PatientRecordsPage with patient name as search param
  navigate(`/doctor/patient-records`, { 
    state: { searchTerm: patientName } 
  });
};


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg shadow-lg mb-0"
        >
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-2">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Patient Records</h1>
                  <p className="text-indigo-100">Manage and view your patient records</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-indigo-100 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  Total Patients: {filteredPatients.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs 
          defaultValue="records" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-0"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="records">
                <Card className="overflow-hidden border-none shadow-lg rounded-t-none">
                  <CardHeader className="flex flex-row items-center justify-between bg-white px-6 py-5 border-b">
                    <CardTitle className="font-bold text-gray-800">Your Patients</CardTitle>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search patients..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" 
                        />
                      </div>

                    </div>
                  </CardHeader>
                  <CardContent className="bg-white p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-y">
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Patient</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Age/Gender</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Contact</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Visit</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Diagnosis</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Visits</th>
                            <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPatients.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-12 text-center text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No patients found</p>
                                <p className="text-sm">You haven't created any prescriptions yet.</p>
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((patient, idx) => (
                              <motion.tr 
                                key={patient.id} 
                                className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                onMouseEnter={() => setHoveredRow(patient.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-indigo-100 flex items-center justify-center">
                                      {patient.photo ? (
                                        <img src={patient.photo} alt={`${patient.name} avatar`} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="text-indigo-600 font-medium text-sm">
                                          {patient.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{patient.name}</p>
                                      <p className="text-xs text-gray-500">ID: {patient.rfidCardUID}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-900">{patient.age || 'N/A'} years</p>
                                    <p className="text-gray-500 capitalize">{patient.gender}</p>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {patient.phone}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {formatDate(patient.lastVisit)}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-gray-900 font-medium">
                                    {patient.lastDiagnosis || 'N/A'}
                                  </span>
                                </td>
      
                                <td className="py-4 px-6">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Activity className="w-4 h-4 mr-2" />
                                    {patient.totalVisits}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => handleViewPatient(patient.id, patient.rfidCardUID)}
                                        className="border border-gray-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                                      >
                                        <Eye className="w-3.5 h-3.5 mr-1" />
                                        View
                                      </Button>
                                    </motion.div>
                            
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
                      <div>Showing {filteredPatients.length} patients</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientRecords;