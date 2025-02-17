import React, { useEffect, useState } from 'react';
import Logo from "../assets/Logo.svg";
import { useNavigate } from 'react-router-dom';
import studentLaptop from "../assets/student-laptop.jpg";
import laptop from "../assets/laptop.jpg";
import writing from '../assets/writing.jpg';
import books from '../assets/books.jpg';
import { Cup, Setting2, TimerStart, Rank, Profile2User, MedalStar, Flash, Computing, Crown1, Award, Book } from 'iconsax-react';
import SurveyModal from '../components/survey';

function MainMenu() {
    const navigate = useNavigate();
    const [showSurvey, setShowSurvey] = useState(false);
    const handleButtonClick = (route) => {
        navigate(route);
      };
    
  useEffect(() => {
    const isOnline = navigator.onLine;
    const hideSurvey = localStorage.getItem("hideSurvey");

    if (isOnline && !hideSurvey) {
      setTimeout(() => setShowSurvey(true), 2000); // Show after 2 sec
    }
  }, []);


  return (
    <div className="relative flex flex-col h-screen">

<Cup size="64" color="#000000" className="absolute opacity-5" />

{/* Other Background Icons */}
<Award size="64" color="#000000" className="absolute top-20 right-10 opacity-10" />
<TimerStart size="64" color="#000000" className="absolute bottom-20 left-10 opacity-10" />
<Rank size="64" color="#000000" className="absolute bottom-10 right-10 opacity-10" />
<Book size="64" color="#000000" className="absolute bottom-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 opacity-10" />
<MedalStar size="64" color="#000000" className="absolute bottom-1/2 right-1/4 transform translate-x-1/2 translate-y-1/2 opacity-10" />
<Flash size="64" color="#000000" className="absolute top-20 right-1/3 opacity-10" />
<Computing size="64" color="#000000" className="absolute top-10 left-1/3 opacity-10"/>
<Crown1 size="64" color="#000000" className="absolute bottom-10 left-1/3 opacity-10"/>

      <div
        className='size-16 m-5'>
        <img src={Logo} alt="Logo" className="transition-transform duration-1000 view-transition z-40"/>
      </div>



        <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
            <div className="text-justify ml-24">
                <div className="text-3xl font-semibold leading-tight mb-2">Select Game Mode</div>
                <div className="text-xl leading-tight">
                Browse through various quiz categories <br />such as General Knowledge, Science, History, and more.<br />Good Luck!
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1 mr-60 z-40">

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

        <div className="flex justify-center items-center mr-24 z-40">
        <button className="bg-[#E8FBFF] rounded-[21px] shadow p-6 h-4/5 flex flex-col items-center" onClick={() => handleButtonClick('/setup-tournament')}>
      <div className="text-black text-2xl font-semibold mb-4">Quick Contest</div>
      <Flash size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">

  <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center" onClick={() => handleButtonClick('/coming-soon')}>
      <div className="text-black text-2xl font-semibold mb-4">Tournament</div>
      <Cup size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>
    <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center" onClick={() => handleButtonClick('/setup-practice')}>
      <div className="text-black text-2xl font-semibold mb-4">Practice</div>
      <MedalStar size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>

        <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center" onClick={() => handleButtonClick('/setup-survival')}>
      <div className="text-black text-2xl font-semibold mb-4">Survival</div>
      <TimerStart size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>


    <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center" onClick={() => handleButtonClick('/setup-multiplayer')}>
      <div className="text-black text-2xl font-semibold mb-4">Challenge a Friend</div>
      <Profile2User size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>


    <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center">
      <div className="text-black text-2xl font-semibold mb-4">Ranking</div>
      <Rank size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>
    <button className="bg-[#E8FBFF] rounded-[21px] shadow p-4 flex flex-col items-center" onClick={() => handleButtonClick('/menu-settings')}>
      <div className="text-black text-2xl font-semibold  mb-4">Settings</div>
      <Setting2 size="32" color="#555555" className='w-[80px] h-[80px]'/>
    </button>
    {showSurvey && <SurveyModal onClose={() => setShowSurvey(false)} />}

  </div>
</div>

        
      </div>
  );
}

export default MainMenu;
