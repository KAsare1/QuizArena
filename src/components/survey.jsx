import React, { useState } from "react";

const SurveyModal = ({ onClose }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [hasDisability, setHasDisability] = useState("");
  const [disabilityType, setDisabilityType] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const disabilityOptions = [
    "Visual Impairment",
    "Hearing Impairment",
    "Mobility Impairment",
    "Cognitive Impairment",
    "Speech Impairment",
    "Other",
  ];

  const handleSubmit = () => {
    const surveyData = { age, gender, education, hasDisability, disabilityType, location, rating, comments };
    console.log("Survey Data:", surveyData);

    // Store response or send to API
    localStorage.setItem("hideSurvey", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">Help us improve user experience!</h2>

        {/* Age Input */}
        <label className="block text-sm font-medium">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
          placeholder="Enter your age"
        />

        {/* Gender Selection */}
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Education Level */}
        <label className="block text-sm font-medium">Level of Education</label>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Select Education Level</option>
          <option value="Primary">Primary</option>
          <option value="Secondary">Secondary</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Postgraduate">Postgraduate</option>
          <option value="Other">Other</option>
        </select>

        {/* Disability Option */}
        <label className="block text-sm font-medium">Do you have any disabilities?</label>
        <select
          value={hasDisability}
          onChange={(e) => setHasDisability(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
        >
          <option value="">Select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        {/* Show Disability Dropdown if "Yes" is Selected */}
        {hasDisability === "Yes" && (
          <>
            <label className="block text-sm font-medium">Select Disability Type</label>
            <select
              value={disabilityType}
              onChange={(e) => setDisabilityType(e.target.value)}
              className="w-full border rounded-md p-2 mb-2"
            >
              <option value="">Select Disability</option>
              {disabilityOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Location Input */}
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
          placeholder="Enter your location"
        />

        {/* Rating System */}
        <label className="block text-sm font-medium">Rate your quiz experience</label>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comments Input */}
        <label className="block text-sm font-medium">Additional Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border rounded-md p-2 mb-2"
          placeholder="Your feedback..."
        />

        {/* Buttons */}
        <div className="mt-4 flex justify-between">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Fill later
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Submit
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
            localStorage.setItem("hideSurvey", "true");
            onClose();
          }}>
            Never Show Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;
