import React, { useState } from 'react';
import { Back, ToggleOn, ToggleOff, Lock, Unlock, VolumeUp, VolumeCross } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-10 right-10 p-4 rounded-lg shadow-lg transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      <span>{message}</span>
      <button className="ml-4 text-white font-bold" onClick={onClose}>X</button>
    </div>
  );
};

function SettingsPage() {
  const navigate = useNavigate();

  // States to store settings values
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isSpeechRecognitionEnabled, setIsSpeechRecognitionEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // File upload state

  // State for toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Toggle functions
  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);
  const toggleSpeechRecognition = () => setIsSpeechRecognitionEnabled(!isSpeechRecognitionEnabled);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Handle file selection for the PDF
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload to the backend
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Replace this URL with your backend endpoint
      const response = await axios.post("http://127.0.0.1:8000/new-questions/generate-questions/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success toast
      setToastMessage({ message: "Questions generated successfully!", type: 'success' });

      console.log("Generated questions:", response.data);
    } catch (error) {
      // Show error toast
      setToastMessage({ message: "Failed to generate questions.", type: 'error' });

      console.error("Error uploading file:", error);
    }

    // Automatically close toast after 3 seconds
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative bg-white p-6 h-screen">
      {/* Top section with back button */}
      <div className="flex justify-between items-center mb-10">
        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer" />
        <div className="text-3xl font-semibold text-gray-700">Settings</div>
        <div></div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Sound Settings */}
        <div className="bg-[#A1DDE8] p-4 rounded-3xl shadow-lg flex justify-between items-center">
          <div className="flex items-center">
            {isSoundEnabled ? <VolumeUp size="32" color="#555555" /> : <VolumeCross size="32" color="#555555" />}
            <div className="ml-4 text-xl font-light">Sound</div>
          </div>
          <div onClick={toggleSound} className="cursor-pointer">
            {isSoundEnabled ? <ToggleOn size="32" color="#4CAF50" /> : <ToggleOff size="32" color="#F44336" />}
          </div>
        </div>

        {/* Speech Recognition Settings */}
        <div className="bg-[#A1DDE8] p-4 rounded-3xl shadow-lg flex justify-between items-center">
          <div className="flex items-center">
            {isSpeechRecognitionEnabled ? <Unlock size="32" color="#555555" /> : <Lock size="32" color="#555555" />}
            <div className="ml-4 text-xl font-light">Speech Recognition</div>
          </div>
          <div onClick={toggleSpeechRecognition} className="cursor-pointer">
            {isSpeechRecognitionEnabled ? <ToggleOn size="32" color="#4CAF50" /> : <ToggleOff size="32" color="#F44336" />}
          </div>
        </div>

        {/* Dark Mode */}
        <div className="bg-[#A1DDE8] p-4 rounded-3xl shadow-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="ml-4 text-xl font-light">Dark Mode</div>
          </div>
          <div onClick={toggleDarkMode} className="cursor-pointer">
            {isDarkMode ? <ToggleOn size="32" color="#4CAF50" /> : <ToggleOff size="32" color="#F44336" />}
          </div>
        </div>

        {/* Add Questions from a Book */}
        <div className="bg-[#A1DDE8] p-4 rounded-3xl shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="ml-4 text-xl font-light">Add Questions from a Book</div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="mt-4 sm:mt-0 sm:ml-4" />
            <button
              onClick={handleFileUpload}
              className="bg-indigo-500 text-white px-4 py-2 rounded-2xl shadow-md mt-4 sm:mt-0 sm:ml-4 hover:bg-indigo-600 transition-all"
            >
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-indigo-500 rounded-2xl shadow-md p-4 text-white font-light w-40 hover:bg-indigo-600 transition-all">
          Save Changes
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
    </div>
  );
}

export default SettingsPage;
