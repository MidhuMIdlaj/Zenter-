import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Edit3,
  MessageCircle,
  Video,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminProfileService } from '../../api/admin/adminService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/Store';
import { useNavigate } from 'react-router-dom';
import { setAdminAuth } from '../../store/AdminAuthSlice';

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const indianPhoneRegex = /^[6-9]\d{9}$/;

const MatchUpProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>({ ...profileData });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof ProfileData]?: string }>({});

  const adminId = useSelector((state: RootState) => state.adminAuth?.adminData?.id);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    if (!adminId) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await AdminProfileService.getProfile(adminId);
        const data = response.admin || response.data?.admin || response;

        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || ''
        });
        setEditData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || ''
        });
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [adminId]);

  // Validation on every change in editData
  useEffect(() => {
    const newErrors: { [key in keyof ProfileData]?: string } = {};

    if (!editData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!editData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!editData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!indianPhoneRegex.test(editData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be a valid 10-digit Indian number starting with 6-9.';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email.trim())) {
      newErrors.email = 'Invalid email format.';
    }

    setErrors(newErrors);

  }, [editData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if(Object.keys(errors).length > 0) {
      toast.error("Please fix form errors before saving.");
      return;
    }
    try {
      setIsSaving(true);
      const updatedProfile = await AdminProfileService.updateProfile(
        adminId!,
        {
          firstName: editData.firstName.trim(),
          lastName: editData.lastName.trim(),
          phoneNumber: editData.phoneNumber.trim()
        }
      );

      setProfileData(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error : any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditData(prev => ({ 
      ...prev, 
      [field]: value || '' 
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border-2 border-white/30">
                  <User size={28} />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {profileData.firstName || 'Not set'} {profileData.lastName || 'Not set'}
                  </h1>
                  <p className="text-blue-100 flex items-center space-x-2">
                    <Phone size={14} />
                    <span>{profileData.phoneNumber || 'Not set'}</span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || Object.keys(errors).length > 0}
                      className="p-3 bg-green-500/80 rounded-full text-white hover:bg-green-500 transition-all disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="p-3 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-all disabled:opacity-50"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <User className="mr-2 text-blue-500" size={20} />
              Profile Information
            </h3>
            <div className="space-y-4">
              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-800 font-medium">{profileData.email}</span>
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                  </>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-medium">
                      {profileData.firstName || 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                  </>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-medium">
                      {profileData.lastName || 'Not set'}
                    </span>
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      value={editData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. 9876543210"
                    />
                    {errors.phoneNumber && <p className="text-red-600 text-xs mt-1">{errors.phoneNumber}</p>}
                  </>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-medium">
                      {profileData.phoneNumber || 'Not set'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/admin/chat')}
                disabled={isEditing}
                className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg transition-all ${
                  isEditing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:shadow-md'
                }`}
              >
                <MessageCircle size={20} />
                <span className="font-medium">Send Message</span>
              </button>

              <button
                onClick={() => navigate('/admin/video-call')}
                disabled={isEditing}
                className={`w-full flex items-center justify-center space-x-3 p-4 rounded-lg transition-all ${
                  isEditing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 hover:bg-green-100 text-green-600 hover:shadow-md'
                }`}
              >
                <Video size={20} />
                <span className="font-medium">Start Video Call</span>
              </button>
            </div>

            {/* Profile Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Profile Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Name: <span className="font-medium">{profileData.firstName} {profileData.lastName}</span></div>
                <div>Email: <span className="font-medium">{profileData.email}</span></div>
                <div>Contact: <span className="font-medium">{profileData.phoneNumber || 'Not set'}</span></div>
                <div>Status: <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Active</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Mode Notification */}
        {isEditing && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Edit3 size={16} />
              <span className="text-sm font-medium">
                Edit mode is active. Make your changes and click the check button to save.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchUpProfilePage;
