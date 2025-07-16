import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Thermometer,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Activity,
  Battery,
  Settings,
  Plus,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
// Fix import paths - adjust these based on your actual component structure
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Alternative if the above doesn't work:
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Fix environment variable handling
const API_URL = import.meta.env?.VITE_API_URL ||  
                'http://localhost:5000';

interface DispenserData {
  dispenser_name: string; // Primary key
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

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  medicines?: T;
  message?: string;
  error?: string;
}

const DispenserDashboard: React.FC = () => {
  const [dispensers, setDispensers] = useState<DispenserData[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedDispenser, setExpandedDispenser] = useState<string | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  // Memoized helper function to get medicine name by ID
  const getMedicineName = useCallback((medicineId: string) => {
    if (!medicineId) return 'Not assigned';
    const medicine = medicines.find(med => med.id === medicineId);
    return medicine?.name || medicineId;
  }, [medicines]);

  // Enhanced error handling for API calls
  const handleApiError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    setError(`${context}: ${errorMessage}`);
  };

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DispenserData[] = await response.json();
      
      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      setDispensers(data);
      setLastRefresh(new Date());
    } catch (error) {
      handleApiError(error, 'fetchDispenserData');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedicines = useCallback(async () => {
    setIsLoadingMedicines(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/api/medicines`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<Medicine[]> = await response.json();
      
      // Handle different response formats with better type safety
      let medicinesData: Medicine[] = [];
      
      if (data.success && Array.isArray(data.medicines)) {
        medicinesData = data.medicines;
      } else if (Array.isArray(data.medicines)) {
        medicinesData = data.medicines;
      } else if (Array.isArray(data)) {
        medicinesData = data as Medicine[];
      } else if (data.data && Array.isArray(data.data)) {
        medicinesData = data.data;
      }

      // Validate medicine objects
      const validMedicines = medicinesData.filter(medicine => 
        medicine && typeof medicine.id === 'string' && typeof medicine.name === 'string'
      );

      setMedicines(validMedicines);
    } catch (error) {
      handleApiError(error, 'fetchMedicines');
      setMedicines([]);
    } finally {
      setIsLoadingMedicines(false);
    }
  }, []);

  const handleConfigureDispenser = async (dispenserIdentifier: string, medicineId: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const dispenser = dispensers.find(d => d.dispenser_name === dispenserIdentifier);
      
      if (!dispenser) {
        throw new Error('Dispenser not found');
      }

      const response = await fetch(`${API_URL}/api/dispensers/configure`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dispenser_name: dispenser.dispenser_name,
          medicine_id: medicineId || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setExpandedDispenser(null);
      setSelectedMedicines(prev => ({...prev, [dispenserIdentifier]: ''}));
      
      // Refresh data to show updated configuration
      await fetchDispenserData();
      
      const successMessage = medicineId 
        ? 'Medicine configured successfully!' 
        : 'Medicine removed successfully!';
      
      // You might want to replace alert with a proper toast notification
      alert(successMessage);
    } catch (error) {
      handleApiError(error, 'handleConfigureDispenser');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to configure dispenser: ${errorMessage}`);
    }
  };

  const toggleExpanded = useCallback((dispenser: DispenserData) => {
    const identifier = dispenser.dispenser_name;
    if (expandedDispenser === identifier) {
      setExpandedDispenser(null);
    } else {
      setExpandedDispenser(identifier);
      setSelectedMedicines(prev => ({
        ...prev,
        [identifier]: dispenser.medicine_id || ''
      }));
    }
  }, [expandedDispenser]);

  const handleMedicineChange = useCallback((dispenserIdentifier: string, medicineId: string) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [dispenserIdentifier]: medicineId
    }));
  }, []);

  // Memoized status calculations
  const statusCounts = useMemo(() => ({
    online: dispensers.filter(d => d.status === 'online' || d.status === 'dispensing').length,
    offline: dispensers.filter(d => d.status === 'offline').length,
    error: dispensers.filter(d => d.status === 'error').length,
    total: dispensers.length
  }), [dispensers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'dispensing': return 'text-blue-600 bg-blue-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'dispensing': return <Activity className="w-4 h-4" />;
      case 'offline': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'maintenance': return <Settings className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp >= 15 && temp <= 25) return 'text-green-600';
    if (temp >= 10 && temp <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWifiIcon = (strength: number) => {
    return strength > 50 ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />;
  };

  // Effect with proper cleanup
  useEffect(() => {
    fetchDispenserData();
    fetchMedicines();

    let interval: NodeJS.Timeout | undefined;
    if (autoRefresh) {
      interval = setInterval(fetchDispenserData, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, fetchDispenserData, fetchMedicines]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dispensers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 font-medium">Error</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-red-600 mt-1 text-sm">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dispenser Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time monitoring of all medicine dispensers</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <Button
                onClick={fetchDispenserData}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                className={autoRefresh ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Activity className="w-4 h-4 mr-2" />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-blue-500">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Total Dispensers</p>
                    <h3 className="text-xl font-bold">{statusCounts.total}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-green-500">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Online</p>
                    <h3 className="text-xl font-bold">{statusCounts.online}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-gray-500">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center">
                  <XCircle className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs font-medium text-gray-500">Offline</p>
                    <h3 className="text-xl font-bold">{statusCounts.offline}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Dispensers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dispensers.map((dispenser, index) => {
            const dispenserIdentifier = dispenser.dispenser_name;
            const isExpanded = expandedDispenser === dispenserIdentifier;
            
            return (
              <motion.div
                key={dispenser.dispenser_name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {dispenser.dispenser_name}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        {dispenser.wifi_strength && getWifiIcon(dispenser.wifi_strength)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(dispenser.status)}`}>
                          {getStatusIcon(dispenser.status)}
                          <span className="ml-1 capitalize">{dispenser.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Show assigned medicine */}
                    <div className={`text-sm px-2 py-1 rounded ${
                      dispenser.medicine_id ? 'text-gray-600 bg-blue-50' : 'text-gray-500 bg-gray-50'
                    }`}>
                      <strong>Medicine:</strong> {getMedicineName(dispenser.medicine_id || '')}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Temperature */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Thermometer className={`w-4 h-4 mr-2 ${getTemperatureStatus(dispenser.temperature)}`} />
                        <span className="text-sm text-gray-600">Temperature</span>
                      </div>
                      <span className={`font-medium ${getTemperatureStatus(dispenser.temperature)}`}>
                        26.4°C
                      </span>
                    </div>

                    {/* Battery Level */}
                    {typeof dispenser.battery_level === 'number' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Battery className={`w-4 h-4 mr-2 ${getBatteryColor(dispenser.battery_level)}`} />
                          <span className="text-sm text-gray-600">Battery</span>
                        </div>
                        <span className={`font-medium ${getBatteryColor(dispenser.battery_level)}`}>
                          {dispenser.battery_level}%
                        </span>
                      </div>
                    )}

                    {/* Medicine Count */}
                    {typeof dispenser.medicine_count === 'number' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm text-gray-600">Medicines</span>
                        </div>
                        <span className="font-medium">
                          {dispenser.medicine_count}/{dispenser.total_capacity || 100}
                        </span>
                      </div>
                    )}

                    {/* Stock Level Progress Bar */}
                    {typeof dispenser.medicine_count === 'number' && (
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Stock Level</span>
                          <span>{Math.round((dispenser.medicine_count / (dispenser.total_capacity || 100)) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (dispenser.medicine_count / (dispenser.total_capacity || 100)) > 0.5 
                                ? 'bg-green-500' 
                                : (dispenser.medicine_count / (dispenser.total_capacity || 100)) > 0.2 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min((dispenser.medicine_count / (dispenser.total_capacity || 100)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Last Seen */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">Last seen</span>
                      </div>
                      <span className="text-sm font-medium">
                        {new Date(dispenser.last_seen).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Error Message */}
                    {dispenser.error_message && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          <span className="text-sm text-red-700 font-medium">Error</span>
                        </div>
                        <p className="text-xs text-red-600 mt-1">{dispenser.error_message}</p>
                      </div>
                    )}

                    {/* Expandable Configuration Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t pt-4 mt-4"
                        >
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800 flex items-center">
                              <Settings className="w-4 h-4 mr-2 text-blue-600" />
                              Configure Medicine
                            </h4>
                            
                            <select
                              value={selectedMedicines[dispenserIdentifier] || ''}
                              onChange={(e) => handleMedicineChange(dispenserIdentifier, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              disabled={isLoadingMedicines}
                            >
                              <option value="">
                                {isLoadingMedicines ? 'Loading medicines...' : 
                                 medicines.length === 0 ? 'No medicines available' : 'Select a medicine'}
                              </option>
                              {medicines.map((medicine) => (
                                <option key={medicine.id} value={medicine.id}>
                                  {medicine.name} {medicine.strength && `(${medicine.strength})`}
                                </option>
                              ))}
                            </select>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleConfigureDispenser(dispenserIdentifier, selectedMedicines[dispenserIdentifier] || '')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                disabled={isLoadingMedicines}
                              >
                                <Save className="w-3 h-3 mr-1" />
                                {selectedMedicines[dispenserIdentifier] ? 'Save' : 'Clear Medicine'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setExpandedDispenser(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant={isExpanded ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => toggleExpanded(dispenser)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3 ml-1" />
                            Close
                          </>
                        ) : (
                          <>
                            Configure
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </>
                        )}
                      </Button>
                      {dispenser.status === 'error' && (
                        <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Diagnose
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {dispensers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Dispensers Found</h3>
            <p className="text-gray-500">No dispensers are currently registered in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DispenserDashboard;