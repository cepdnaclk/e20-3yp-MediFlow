import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Calendar,
  Eye,
  Phone,
  Calendar as CalendarIcon,
  Activity,
  Filter,
  FileText,
  ClipboardList,
  Clock,
  Heart,
  Tag,
  Pill
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.js';
import { Button } from '../components/ui/button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';
import { Badge } from '../components/ui/badge.js';

const API_URL = import.meta.env.VITE_API_URL;

const PatientRecordsPage = () => {
  const [activeTab, setActiveTab] = useState("all-visits");
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniquePatients: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDoctorPatients();
  }, []);

    // Set search term from navigation state if available
  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      
      // Clear the state after using it to prevent persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    // Filter visits based on search term
    const filtered = visits.filter(visit => {
      const matchesSearch = 
        visit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.phone?.includes(searchTerm) ||
        visit.rfidCardUID.includes(searchTerm) ||
        visit.medicalConditions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.allergies?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.diagnosis && visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (visit.medications && visit.medications.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply additional filters if needed
      if (filterBy === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const visitDate = visit.visitDate ? new Date(visit.visitDate) : null;
        return matchesSearch && visitDate && visitDate >= thirtyDaysAgo;
      }
      

      
      return matchesSearch;
    });
    
    setFilteredVisits(filtered);
  }, [searchTerm, visits, filterBy]);

  const fetchDoctorPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/doctor/patients/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Use patientVisits instead of patients
        setVisits(data.patientVisits || []);
        setFilteredVisits(data.patientVisits || []);
        setStats({
          totalVisits: data.totalVisits || 0,
          uniquePatients: data.uniquePatients || 0
        });
      } else {
        console.error('Failed to fetch patient visits');
      }
    } catch (error) {
      console.error('Error fetching patient visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patient-profile/${patientId}`);
  };

  const handleCreatePrescription = (patient) => {
    navigate(`/profile`, { state: { patient } });
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
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-6"
        >
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm text-white rounded-lg p-3">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Patient Medical History</h1>
                  <p className="text-indigo-100 mt-1">Complete record of all patient visits and treatments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-indigo-100 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-semibold">{stats.totalVisits}</span> total visits
                </div>
                <div className="text-sm text-indigo-100 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-semibold">{stats.uniquePatients}</span> unique patients
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs 
          defaultValue="all-visits" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
           
            
            <div className="flex space-x-2">
              <Button 
                variant={filterBy === 'all' ? 'default' : 'outline'} 
                className="text-sm" 
                onClick={() => setFilterBy('all')}
              >
                All
              </Button>
              <Button 
                variant={filterBy === 'recent' ? 'default' : 'outline'} 
                className="text-sm" 
                onClick={() => setFilterBy('recent')}
              >
                Recent
              </Button>

            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="all-visits" className="mt-0">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-white px-6 py-5 border-b">
                    <CardTitle className="font-bold text-gray-800">Complete Visit History</CardTitle>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search by patient, diagnosis, or medication..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-white p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-y">
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Visit Date</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Patient</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Age/Gender</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Diagnosis</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Medications</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVisits.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-16 text-center text-gray-500">
                                <div className="flex flex-col items-center justify-center">
                                  <div className="bg-indigo-50 p-3 rounded-full mb-4">
                                    <Activity className="w-8 h-8 text-indigo-400" />
                                  </div>
                                  <p className="text-lg font-medium mb-2">No patient visits found</p>
                                  {filterBy !== 'all' ? (
                                    <p className="text-sm max-w-md">No visits match your current filter. Try changing your search criteria.</p>
                                  ) : searchTerm ? (
                                    <p className="text-sm max-w-md">No visits match your search term "{searchTerm}". Try a different search.</p>
                                  ) : (
                                    <p className="text-sm max-w-md">You haven't seen any patients yet. When you create prescriptions, visits will appear here.</p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredVisits.map((visit, idx) => (
                              <motion.tr 
                                key={visit.visitId} 
                                className={`border-b hover:bg-gray-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                onMouseEnter={() => setHoveredRow(visit.visitId)}
                                onMouseLeave={() => setHoveredRow(null)}
                                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.03 }}
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    {formatDate(visit.visitDate)}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-indigo-100 flex items-center justify-center">
                                      {visit.photo ? (
                                        <img src={visit.photo} alt={`${visit.name} avatar`} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="text-indigo-600 font-medium text-sm">
                                          {visit.name?.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{visit.name}</p>
                                      <p className="text-xs text-gray-500">ID: {visit.rfidCardUID || 'N/A'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-900">{visit.age || 'N/A'} years</p>
                                    <p className="text-gray-500 capitalize">{visit.gender}</p>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-gray-900 font-medium">
                                    {visit.diagnosis || 'Not recorded'}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center">
                                    {(visit.patientStatus) || (
                                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                                        Unspecified
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 px-6 max-w-[200px]">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Pill className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <p className="truncate">
                                      {visit.medications || 'None prescribed'}
                                    </p>
                                  </div>
                                </td>
                         
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
                      <div>Showing {filteredVisits.length} of {visits.length} patient visits</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-white px-6 py-5 border-b">
                    <CardTitle className="font-bold text-gray-800">Recent Patient Visits (Last 30 Days)</CardTitle>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search recent visits..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-white p-6">
                    {/* Content similar to all-visits tab but with focus on recent visits */}
                    {filterBy === 'recent' && filteredVisits.length > 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                          <Clock className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold">Recent Patient Visits</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                          Showing visits from the last 30 days
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                          <Clock className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold">No Recent Visits</h3>
                        <p className="text-gray-500 max-w-md mx-auto mt-2">
                          You haven't seen any patients in the last 30 days.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="patients" className="mt-0">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-white px-6 py-5 border-b">
                    <CardTitle className="font-bold text-gray-800">Patient Summary</CardTitle>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search patients by name..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" 
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-white p-6">
                    {/* This would show a summary grouped by patient */}
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full mb-4">
                        <Users className="h-8 w-8 text-indigo-500" />
                      </div>
                      <h3 className="text-xl font-semibold">Patient Summary View</h3>
                      <p className="text-gray-500 max-w-md mx-auto mt-2">
                        This view would show visits grouped by patient, with summary stats for each patient
                      </p>
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

export default PatientRecordsPage;