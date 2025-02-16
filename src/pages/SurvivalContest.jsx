import React, { useState, useEffect } from 'react';
import { Setting2, Back} from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import SecMicrophone from '../components/ContestSpeech';

function SurvivalContest() {

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [transcript, setTranscript] = useState(''); // Initialize the navigate hook


    useEffect(() => {
      fetch('http://127.0.0.1:8000/first_round/quiz')
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched questions:', data);
          setQuestions(data.questions || []);
        })
        .catch((error) => console.error('Error fetching questions:', error));
    }, []);

    const handleTranscriptChange = (newTranscript) => {
      setTranscript(newTranscript);
    };

    const getCurrentQuestion = () => {
      if (questions.length > 0 && currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        return currentQuestion['Question'];
      }
      return 'Loading questions...';
    };
    
    const handleNextQuestion = () => {
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex < questions.length - 1 ? prevIndex + 1 : 0
      );
    };

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            handleNextQuestion();
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, [currentQuestionIndex, questions]);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

    return (
      <div className="relative bg-white p-4">
        {/* Top section with back and settings buttons */}
        <div className="flex justify-between items-center h-20 mb-20">
        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer"/>
          <div className="bg-[#A1DDE8] w-1/6 rounded-3xl items-center shadow p-4 align-bottom mt-8">
            <div className="text-2xl font-medium self-center justify-center">Time Left</div>
            <div className="text-3xl font-medium mt-4">{timeLeft} seconds</div>
          </div>
          <Setting2 size="32" color="#555555" className="cursor-pointer"/>
        </div>

  
        {/* Round information */}
        <div className="flex mt-16">
        {/* Left side: Round description and Question */}
        <div className="flex flex-col w-1/2 p-4 ml-5">
          <div className="bg-[#A1DDE8] rounded-3xl p-4 w-3/4 h-1/2 self-end mb-8">
            <div className="text-xl font-normal mb-1">Question</div>
            <div className="bg-white p-10 rounded-2xl">
              {getCurrentQuestion()}
            </div>
          </div>
          <div className="w-3/4 self-end">
            <SecMicrophone onTranscriptChange={handleTranscriptChange} showTranscript={true} />
          </div>
        </div>
  
        {/* Right side: Time Left and Contestants */}
        <div className="grid grid-cols-2 gap-10 w-1/2 p-4">
          <div className="bg-cyan-50 rounded-3xl shadow p-4">
            <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
            <div className="text-2xl font-light">Contestant 1</div>
            <div className="text-2xl font-light mt-4">0</div>
          </div>
        </div>
      </div>
  
        {/* Submit Answer Button */}
        <button className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-8 p-1 mx-auto w-60 flex justify-center items-center">
          <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
        </button>
      </div>
    );
  }
  
  export default SurvivalContest;
  