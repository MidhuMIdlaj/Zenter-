import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  ImageIcon, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Camera,
  Trash2
} from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompletionData) => Promise<void>;
  taskTitle: string;
  customerName: string;
  isLoading?: boolean;
}

interface CompletionData {
  description: string;
  photos: File[];
}

const TaskCompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  taskTitle,
  customerName,
  isLoading = false
}) => {
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{ description?: string; photos?: string }>({});

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    console.log(files)
    const newFiles = Array.from(files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photos: 'Only image files are allowed' }));
        return false;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photos: 'File size should be less than 5MB' }));
        return false;
      }
      
      return true;
    });

    // Limit to 5 photos total
    const totalFiles = photos.length + newFiles.length;
    if (totalFiles > 5) {
      setErrors(prev => ({ ...prev, photos: 'Maximum 5 photos allowed' }));
      return;
    }
     console.log(newFiles, 'newFiles')
    setPhotos(prev => [...prev, ...newFiles]);
    setErrors(prev => ({ ...prev, photos: undefined }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { description?: string; photos?: string } = {};
    
    if (!description.trim()) {
      newErrors.description = 'Work completion description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onSubmit({
        description: description.trim(),
        photos
      });
      
      // Reset form on successful submission
      setDescription('');
      setPhotos([]);
      setErrors({});
    } catch (error) {
      console.error('Error submitting completion data:', error);
    }
  };

  const handleClose = () => {
    setDescription('');
    setPhotos([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <CheckCircle className="mr-3 text-green-600" size={28} />
                Complete Task
              </h2>
              <div className="space-y-1">
                <p className="text-gray-700 font-medium">{taskTitle}</p>
                <p className="text-sm text-gray-500">Customer: {customerName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Work Description Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 items-center">
              <FileText className="mr-2 text-blue-600" size={16} />
              Work Completion Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: undefined }));
                }
              }}
              className={`w-full p-4 border-2 rounded-xl transition-all duration-200 resize-none focus:outline-none ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              rows={4}
              placeholder="Describe the work completed, any issues found, parts replaced, recommendations for the customer, etc..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {description.length}/500 characters
            </p>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 items-center">
              <Camera className="mr-2 text-green-600" size={16} />
              Before/After Photos
              <span className="ml-2 text-xs text-gray-500 font-normal">(Optional - Max 5 photos, 5MB each)</span>
            </label>
            
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : errors.photos 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading || photos.length >= 5}
              />
              
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-full shadow-md">
                    <Upload className="text-gray-400" size={24} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drop photos here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>
            </div>

            {errors.photos && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.photos}
              </p>
            )}
          </div>

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <ImageIcon className="mr-2 text-purple-600" size={16} />
                Selected Photos ({photos.length}/5)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removePhoto(index)}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {photo.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !description.trim()}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Completing Task...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Complete Task</span>
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 flex items-start">
              <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> Once you complete this task, the customer will be notified and the task status will be updated to "Completed". Make sure all work is finished and documented properly.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionModal;