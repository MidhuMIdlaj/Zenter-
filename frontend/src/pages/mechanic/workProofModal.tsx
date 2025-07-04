import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  X, ImagePlus, CheckCircle } from 'lucide-react';
import { Complaint } from '../../types/complaint';

interface WorkProofModalProps {
  complaint: Complaint;
  mechanicId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const WorkProofModal: React.FC<WorkProofModalProps> = ({
  complaint,
  onClose,
  onSuccess
}) => {
  const [proofDescription, setProofDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    try {
      if (!proofDescription.trim()) {
        setError('Please provide a description of the work done');
        return;
      }
      
      if (selectedImages.length === 0) {
        setError('Please add at least one image for proof of work');
        return;
      }
      
      setIsSubmitting(true);
      setError(null);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      
      // Dismiss success screen after a delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Failed to submit work proof. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Work Completed!</h2>
          <p className="text-gray-600 mb-4">
            Your work proof has been submitted successfully.
          </p>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
            className="h-1 bg-green-500 rounded-full mt-4"
          />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Submit Work Proof
        </h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-blue-800 font-medium mb-2">Complaint Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{complaint.customerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{complaint.contactNumber || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Issue Description</p>
              <p className="font-medium">{complaint.description || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description of Work Done
          </label>
          <textarea
            value={proofDescription}
            onChange={(e) => {
              setProofDescription(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Describe the repairs or maintenance performed..."
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error && !proofDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            rows={4}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Work Proof Images
          </label>
          
          {/* Image preview area */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative h-32 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={image} 
                  alt={`Work proof ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Upload button */}
            <div className={`border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-32 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors ${
              error && selectedImages.length === 0 ? 'border-red-300 bg-red-50' : ''
            }`}>
              <label htmlFor="image-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <ImagePlus size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">Upload clear images of the completed work.</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className={`px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={18} className="mr-1" />
                Submit Completed Work
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkProofModal;