import { useState, useCallback, useEffect } from 'react';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageHelper';

const FileUpload = ({ onFileSelect, initialPreview }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  // whenever initialPreview changes, normalize it to a full URL
  useEffect(() => {
    if (initialPreview) {
      // if it's already a full HTTP URL or data URI, use it directly
      if (
        initialPreview.startsWith('http') ||
        initialPreview.startsWith('data:image')
      ) {
        setPreviewUrl(initialPreview);
      } else {
        // otherwise treat it as a filename and run through our helper
        setPreviewUrl(getImageUrl(initialPreview));
      }
    } else {
      setPreviewUrl(null);
    }
  }, [initialPreview]);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result); // data URI
      reader.readAsDataURL(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onFileSelect(null);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors
        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
        ${error ? 'border-red-500 bg-red-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <div className="relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={handleRemove}
              className="p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
            >
              <FiX size={20} />
            </button>
          </div>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg object-contain"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <FiUploadCloud className="text-2xl text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {isDragging ? 'Drop your image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              High-quality images recommended (max 10MB)
            </p>
          </div>
          <label className="inline-block px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
            Select Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
