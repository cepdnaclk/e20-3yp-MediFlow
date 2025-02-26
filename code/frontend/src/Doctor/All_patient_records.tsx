import React, { useState } from 'react';

import { 
  Search, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  Filter,
  Eye,
  Edit,
  BellRing,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Button } from '../components/ui/button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';

const PatientRecords = () => {
  const [activeTab, setActiveTab] = useState("records");
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const patients = [
    { 
      id: 1,
      name: 'John Doe', 
      avatar: '/avatar.png',
      age: 45, 
      condition: 'Hypertension', 
      status: 'Active',
      lastVisit: '2025-02-10', 
      doctor: 'Dr. Smith',
      upcomingAppointment: '2025-03-05',
    },
    { 
      id: 2,
      name: 'Jane Smith', 
      avatar: '/avatar.png',
      age: 32, 
      condition: 'Diabetes Type 2', 
      status: 'Review Needed',
      lastVisit: '2025-02-12', 
      doctor: 'Dr. Johnson',
      upcomingAppointment: '2025-02-28',
    },
    { 
      id: 3,
      name: 'Robert Williams', 
      avatar: '/avatar.png',
      age: 58, 
      condition: 'Arthritis', 
      status: 'Critical',
      lastVisit: '2025-02-20', 
      doctor: 'Dr. Garcia',
      upcomingAppointment: '2025-02-27',
    },
    { 
      id: 4,
      name: 'Emily Chen', 
      avatar: '/avatar.png',
      age: 29, 
      condition: 'Asthma', 
      status: 'Stable',
      lastVisit: '2025-02-15', 
      doctor: 'Dr. Martinez',
      upcomingAppointment: '2025-03-10',
    },
  ];

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Review Needed': 'bg-amber-100 text-amber-800',
    'Critical': 'bg-red-100 text-red-800',
    'Stable': 'bg-blue-100 text-blue-800',
  };

  const getStatusClass = (status) => {
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b shadow-sm sticky top-0 z-10"
      >
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 text-white rounded-md p-2">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MediTrack Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="relative">
                  <BellRing className="w-4 h-4 mr-2" />
                  Notifications
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Patient
                </Button>
              </motion.div>
            </div>
          </div>
        </div> */}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs 
          defaultValue="records" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          {/* <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid grid-cols-3 gap-4 p-1 bg-white shadow-md rounded-lg">
              <TabsTrigger 
                value="records" 
                className="flex items-center justify-center py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-purple-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Patient Records
              </TabsTrigger>
              <TabsTrigger 
                value="prescriptions" 
                className="flex items-center justify-center py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-purple-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger 
                value="appointments" 
                className="flex items-center justify-center py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-50 data-[state=active]:to-purple-50 data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Appointments
              </TabsTrigger>
            </TabsList>
          </motion.div> */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="records">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-white px-6 py-5">
                    <CardTitle className="font-bold text-gray-800">Patient Records</CardTitle>
                    <div className="flex space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search patients..." 
                          className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        className="rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                        Filters
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-white p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-y">
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Patient</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Age</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Condition</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</th>
                            <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Visit</th>
                            {/* <th className="text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Doctor</th> */}
                            <th className="text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {patients.map((patient, idx) => (
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
                                  <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200">
                                    <img src={patient.avatar} alt={`${patient.name} avatar`} className="h-full w-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{patient.name}</p>
                                    <p className="text-xs text-gray-500">Next appointment: {patient.upcomingAppointment}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-gray-600">{patient.age}</td>
                              <td className="py-4 px-6 text-gray-600">{patient.condition}</td>
                              <td className="py-4 px-6">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(patient.status)}`}>
                                  {patient.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-gray-600">{patient.lastVisit}</td>
                              {/* <td className="py-4 px-6 text-gray-600">{patient.doctor}</td> */}
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button variant="outline" size="sm" className="border border-gray-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
                                      <Eye className="w-3.5 h-3.5 mr-1" />
                                      View
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button variant="outline" size="sm" className="border border-gray-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors">
                                      <Edit className="w-3.5 h-3.5 mr-1" />
                                      Edit
                                    </Button>
                                  </motion.div>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-500 p-1">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
                      <div>Showing 1-{patients.length} of {patients.length} patients</div>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">1</Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">2</Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">3</Button>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescriptions">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Prescriptions Management</h3>
                        <p className="text-gray-500 mb-4">View and manage patient prescriptions here.</p>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Prescription
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Appointments Calendar</h3>
                        <p className="text-gray-500 mb-4">Manage patient appointments here.</p>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </div>
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