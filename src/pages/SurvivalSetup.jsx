import React, { useEffect, useState } from 'react';
import Logo from "../assets/Logo.svg";
import studentLaptop from "../assets/student-laptop.jpg";
import { useNavigate } from 'react-router-dom';
import laptop from "../assets/laptop.jpg";
import writing from '../assets/writing.jpg';
import books from '../assets/books.jpg';

function SurvivalSetup() {

    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const navigate = useNavigate();

    const handleButtonClick = (difficulty) => {
      setSelectedDifficulty(difficulty);
    };

    const handleStartButtonClick = () => {
  
        navigate('/survival-contest');
    };


  return (
    <div className="relative flex flex-col h-screen">

      <div
        className='size-16 m-5'>
        <img src={Logo} alt="Logo z-40" className="" />
      </div>



        <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
            <div className="text-justify ml-24">
                <div className="text-3xl font-semibold leading-tight mb-2">Survival</div>
                <div className="text-xl leading-tight">
                   Let's see how many Questions you can answer <br/> without going wrong!
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mr-60">

<img 
    className="w-56 h-40 rounded-tl-[40px] rounded-tr-[100px] rounded-bl-[60px] rounded-br-3xl mt-16" 
    src={studentLaptop} 
    alt="Image 1" 
/>

<div className='gap-2'>
<div className='flex flex-wrap justify-center mr-10 gap-1'>
<img 
    className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
    src={laptop} 
    alt="Image 2" 
/>
<img 
    className="w-36 h-28 rounded-tl-[40px] rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl" 
    src={books}
    alt="Image 3" 
/>
    
</div>

<img 
    className="w-72 h-28 rounded-tl-3xl rounded-tr-3xl rounded-bl-[60px] rounded-br-3xl mt-1" 
    src={writing}
    alt="Image 4" 
/>

</div>

</div>
        </div>
        <div className="flex flex-col justify-center items-center mt-12">
      <div className='mr-5 text-2xl'>
       <p>How dificult do you want this to be?</p> 
      </div>
      <div className="bg-[#A1DDE8] rounded-3xl w-72 p-3 h-auto mb-8 mt-1">
        <div className='flex flex-col'>

            <>
              <button onClick={() => handleButtonClick('Easy')} className="bg-white p-4 m-2 rounded-2xl">Easy</button>
              <button onClick={() => handleButtonClick('Intermediate')} className="bg-white p-4 m-2 rounded-2xl">Intermediate</button>
              <button onClick={() => handleButtonClick('Hard')} className="bg-white p-4 m-2 rounded-2xl">Hard</button>
              <button onClick={() => handleButtonClick('Auto')} className="bg-white p-4 m-2 rounded-2xl">Auto</button>
              <button className='bg-[#607FF4] px-4 py-1 mt-2 rounded-2xl text-white' onClick={handleStartButtonClick}>
                Start Tournament!
              </button>
            </>
        </div>
      </div>
    </div>

        
      </div>
  );
}

export default SurvivalSetup;
