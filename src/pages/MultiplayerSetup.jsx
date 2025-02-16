import React, { useState } from 'react';
import Logo from "../assets/Logo.svg";
import studentLaptop from "../assets/student-laptop.jpg";
import { useNavigate } from 'react-router-dom';
import laptop from "../assets/laptop.jpg";
import writing from '../assets/writing.jpg';
import books from '../assets/books.jpg';

function MultiplayerSetup() {

    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const navigate = useNavigate();
    const [mode, setMode] = useState('Join');
    const [channelName, setChannelName] = useState('');

    const handleChannelNameChange = (event) => {
      setChannelName(event.target.value);
    };

    const handleStartButtonClick = () => {
      localStorage.clear();
      localStorage.setItem('channelName', channelName);
      // Navigate or perform additional actions here if needed
      navigate('/multiplayer-contest');
    };

    const toggleMode = (newMode) => {
      setMode(newMode);
    };

    return (
        <div className="relative flex flex-col h-screen">
            <div className='size-16 m-5'>
                <img src={Logo} alt="Logo" className="z-40" />
            </div>

            <div className='flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0'>
                <div className="text-justify ml-24">
                    <div className="text-3xl font-semibold leading-tight mb-2">Challenge a friend</div>
                    <div className="text-xl leading-tight">
                        Compete in thrilling, timed quiz tournaments against others.
                        <br/>
                        Climb the leaderboard, and showcase your knowledge!
                        <br/>
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

            <div className="flex flex-col justify-center items-center mt-16">
                <div className="bg-[#A1DDE8] rounded-3xl w-72 p-4 h-auto mb-8 mt-1 shadow-xl">
                    <div className='flex justify-center mb-4'>
                        <button
                            onClick={() => toggleMode('Join')}
                            className={`bg-blue-500 p-2 m-2 rounded-2xl w-1/2 ${mode === 'Join' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        >
                            Join Channel
                        </button>
                        <button
                            onClick={() => toggleMode('Create')}
                            className={`bg-blue-500 p-2 m-2 rounded-2xl w-1/2 ${mode === 'Create' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        >
                            Create Channel
                        </button>
                    </div>
                    <div className='flex flex-col'>
                        <input
                            placeholder="Enter channel name"
                            value={channelName}
                            onChange={handleChannelNameChange}
                            className="bg-white p-3 m-2 rounded-2xl text-center border-gray-900 border-opacity-20"
                        />
                        <button
                            onClick={handleStartButtonClick}
                            className="bg-blue-500 p-2 m-2 rounded-2xl text-white"
                        >
                            {mode === 'Join' ? 'Join' : 'Create'}
                        </button>
                    </div>
                    </div>
            </div>
        </div>
    );
}

export default MultiplayerSetup;
