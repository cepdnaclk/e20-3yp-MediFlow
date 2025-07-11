import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader, Search, Filter, ArrowLeft, Users, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

const roles = [
  { label: 'All', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Pharmacist', value: 'pharmacist' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteError, setDeleteError] = useState(null); // New state for delete-specific errors
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data.users || []);
        setCurrentUser(data.currentUser || null); // Assuming API returns current user info
      } catch (err) {
        setError('Failed to load users.');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    setError(null);
    setDeleteError(null); // Clear any previous delete errors
    
    setDeletingId(userId);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Set the error message from backend in the delete dialog
        setDeleteError(data.message || 'Failed to delete user');
        setDeletingId(null);
        return;
      }
      
      // Success - remove user from list and close dialog
      setUsers(users.filter(u => u.id !== userId));
      setDeletingId(null);
      setShowDeleteDialog(false);
      setUserToDelete(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError('Network error. Please try again.');
      setDeletingId(null);
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
    setDeleteError(null); // Clear any previous errors when opening dialog
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
    setDeleteError(null); // Clear errors when closing dialog
  };

  const isCurrentUser = userToDelete && currentUser && userToDelete.id === currentUser.id;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <motion.button
            onClick={() => navigate('/admin_dashboard')}
            className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </motion.button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight pb-1">
                User Management
              </h1>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">{filteredUsers.length}</span> users found
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full sm:w-72 pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-900 placeholder-slate-500 shadow-sm"
                />
              </div>
              
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="w-full sm:w-48 pl-12 pr-10 py-3 bg-white rounded-xl border border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-900 shadow-sm appearance-none cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium shadow-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="relative">
                <Loader className="animate-spin h-12 w-12 text-blue-500" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-blue-100"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="text-left py-6 px-8 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-6 px-8 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-6 px-8 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-6 px-8 font-semibold text-slate-700 text-sm uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/50 transition-colors duration-200 group"
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.username}</div>
                            <div className="text-xs text-slate-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="text-slate-700 font-medium">{user.email}</div>
                      </td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide
                          ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' :
                            user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' :
                            user.role === 'pharmacist' ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200' : 
                            'bg-slate-100 text-slate-700 ring-1 ring-slate-200'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteDialog(user)}
                          disabled={deletingId === user.id}
                          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm group-hover:opacity-100 lg:opacity-0 disabled:opacity-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === user.id ? (
                            <span className="text-xs">Deleting...</span>
                          ) : (
                            <span className="hidden sm:inline">Delete</span>
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && userToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeDeleteDialog}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={closeDeleteDialog}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  deleteError ? 'bg-red-100' : isCurrentUser ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    deleteError ? 'text-red-600' : isCurrentUser ? 'text-orange-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {deleteError ? 'Error' : isCurrentUser ? 'Cannot Delete Account' : 'Delete User'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {deleteError ? 'Failed to delete user' : isCurrentUser ? 'You cannot delete your own account' : 'This action cannot be undone'}
                  </p>
                </div>
              </div>
              
              {/* Show backend error message */}
              {deleteError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium text-sm"
                >
                  {deleteError}
                </motion.div>
              )}
              
              <div className={`rounded-xl p-4 mb-6 ${
                deleteError ? 'bg-red-50 border border-red-200' : 
                isCurrentUser ? 'bg-orange-50 border border-orange-200' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                      {userToDelete.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {userToDelete.username}
                      {isCurrentUser && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">{userToDelete.email}</div>
                    <div className="text-xs text-slate-500">Role: {userToDelete.role}</div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">
                {deleteError ? (
                  <>
                    Please try again or contact support if the problem persists.
                  </>
                ) : isCurrentUser ? (
                  <>
                    You cannot delete your own account while logged in. 
                    Please contact another administrator if you need to remove your account.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong>{userToDelete.username}</strong>? 
                    This will permanently remove the user from the system.
                  </>
                )}
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeDeleteDialog}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  {deleteError || isCurrentUser ? 'Close' : 'Cancel'}
                </motion.button>
                {!deleteError && !isCurrentUser && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(userToDelete.id)}
                    disabled={deletingId === userToDelete.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deletingId === userToDelete.id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;