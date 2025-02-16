import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.svg";


function QuizLogo() {
  const navigate = useNavigate();

  const handleButtonClick = () => {

      navigate('/main-menu');

  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="relative flex items-center">
      <img src={Logo} alt="Logo" className="transition-transform duration-1000 view-transition"/>
        <span className="text-4xl font-extrabold -ml-4 mt-4 text-neutral-800">uizArena</span>
      </div>
      <button
        onClick={handleButtonClick}
        className="bg-[#607FF4] text-white rounded-full px-12 py-1 mt-5 text-2xl z-40"
      >
        Play
      </button>
    </div>
  );
}

export default QuizLogo;
