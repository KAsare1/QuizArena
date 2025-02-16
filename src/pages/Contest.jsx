import React, { useState, useEffect } from 'react';
import { Setting2, Back } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import SecMicrophone from '../components/ContestSpeech';

function Contest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [transcript, setTranscript] = useState('');
  const [contestantPoints, setContestantPoints] = useState([0, 0, 0]);  
  const [resultMessage, setResultMessage] = useState('');
  const [timerActive, setTimerActive] = useState(true);
  const [currentContestantIndex, setCurrentContestantIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);  // Track whose turn it is

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript);
  };

  const [botAnswers, setBotAnswers] = useState({});

  useEffect(() => {
    if (currentContestantIndex !== 0) {
      setTimeout(() => handleBotTurn(currentContestantIndex), 2000);
    }
  }, [currentContestantIndex]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/first_round/quiz');
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timerActive && !isPaused) { // Only run timer when not paused
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
    }
  }, [currentQuestionIndex, questions, timerActive, isPaused, currentContestantIndex]);


  const moveToNextContestant = () => {
    setIsPaused(false); // Resume timer for next contestant
    setCurrentContestantIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % 3;
      return nextIndex;
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : 0
    );
    setTimeLeft(30);
    setResultMessage('');
    setTimerActive(true);
    setIsPaused(false);
    moveToNextContestant();
  };

  const handleBotTurn = async (botIndex) => {
    const currentQuestion = questions[currentQuestionIndex];
  
    if (!currentQuestion) return;
  
    const payload = {
      question: {
        sn: currentQuestion["S/N"],
        has_preamble: currentQuestion["Has Preamble"] === "Yes",
        preamble_text: currentQuestion["Preamble Text"] || null,
        question_text: currentQuestion["Question"],
        has_question_figure: currentQuestion["Question has figure"] === "Yes",
        has_answer_figure: currentQuestion["Answer has figure"] === "Yes",
        correct_answer: currentQuestion["Answer"],
        calculations_present: currentQuestion["calculations present"] === "Yes",
        subject: currentQuestion["Subject"]
      },
      user_correct_count: contestantPoints[0],
      bot_correct_count: contestantPoints[botIndex]
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/agent/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Bot Answer:", data);
  
      setBotAnswers((prev) => ({
        ...prev,
        [botIndex]: data.bot_answer
      }));
  
      setIsPaused(true); // Pause the timer while showing result
  
      if (data.is_correct) {
        // Update bot's score and wait 5 seconds
        setContestantPoints((prevPoints) =>
          prevPoints.map((points, idx) => (idx === botIndex ? points + 1 : points))
        );
        
        setTimeout(() => {
          moveToNextContestant();
        }, 5000); // 5 seconds pause for correct answer
      } else {
        setBotAnswers((prev) => ({
          ...prev,
          [botIndex]: "Contestant is thinking..."
        }));
        
        setTimeout(() => {
          moveToNextContestant();
        }, 4000); // 4 seconds pause for incorrect answer
      }
    } catch (error) {
      console.error("Error fetching bot answer:", error);
      moveToNextContestant(); // Move to next contestant even if there's an error
    }
  };

  const handleSubmitAnswer = () => {
    setTimerActive(false);  

    const userAnswer = transcript;
    const correctAnswer = questions[currentQuestionIndex]?.Answer;

    fetch('http://127.0.0.1:8000/first_round/check-answer-sec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_answer: userAnswer,
        correct_answer: correctAnswer,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API result:', data);
        const points = data.points; 
        const isCorrect = data.correct;  
        
        if (data.result === 'Correct') {
          setResultMessage('Correct!');
        } else {
          setResultMessage('Incorrect!');
        }

        setContestantPoints((prevPoints) =>
          prevPoints.map((pointsForContestant, idx) =>
            idx === currentContestantIndex ? pointsForContestant + points : pointsForContestant
          )
        );

        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      })
      .catch((error) => console.error('Error checking answer:', error));
  };

  const getCurrentQuestion = () => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      return questions[currentQuestionIndex]['Question'];
    }
    return 'Loading questions...';
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative bg-white p-4">
      <div className="flex justify-between items-center mb-20">
        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer" />
        <Setting2 size="32" color="#555555" className="cursor-pointer" />
      </div>

      <div className="flex">
        <div className="flex flex-col w-1/2 p-4 ml-5">
          <div className="mb-4 w-3/4 self-end">
            <div className="text-2xl font-semibold">Round 1</div>
            <div className="text-xl font-light mt-2">
              This is the Round of Fundamentals. Good Luck!
            </div>
          </div>
          <div className="bg-[#A1DDE8] rounded-3xl p-4 w-3/4 h-full self-end mb-8">
            <div className="text-xl font-normal mb-1">Question</div>
            <div className="bg-white p-10 rounded-2xl">
              {getCurrentQuestion()}
            </div>
          </div>
          {currentContestantIndex === 0 ? (
  // Your turn: Show microphone input
            <div className="w-3/4 self-end">
              <SecMicrophone onTranscriptChange={handleTranscriptChange} showTranscript={true} />
            </div>
          ) : (
            <div className="w-3/4 self-end">
            <div className='items-center'>
            <div className="bg-[#9adfb1] rounded-3xl self-center justify-center p-4">
                <div className="text-xl font-normal">Contestant {currentContestantIndex +1 }'s answer</div>
                <div className="bg-white p-5 rounded-2xl min-h-[50px] flex items-center justify-center">
                    {botAnswers[currentContestantIndex] ? (
                        <p className="text-lg font-semibold text-gray-800">
                            {botAnswers[currentContestantIndex]}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">Waiting for bot's response...</p>
                    )}
                </div>
            </div>
        </div>
        </div>
      )}
        </div>

        <div className="grid grid-cols-2 gap-10 w-2/6 p-4">
          <div className="bg-[#A1DDE8] rounded-3xl shadow p-4">
            <div className="text-2xl font-medium">Time Left</div>
            <div className="text-3xl font-medium mt-4">{timeLeft} seconds</div>
          </div>
          {[1, 2, 3].map((num, idx) => (
            <div key={num} className="bg-cyan-50 rounded-3xl shadow p-4">
              <div className="bg-cyan-50 rounded-full shadow w-20 h-20 mb-4"></div>
              <div className={`text-2xl font-light ${idx === currentContestantIndex ? 'text-blue-600 font-bold' : ''}`}>
                {idx === 0 ? 'You' : `Contestant ${num}`}
              </div>
              <div className="text-2xl font-light mt-4">
                {contestantPoints[idx]} points
              </div>
            </div>
          ))}
        </div>
      </div>

      {resultMessage && (
        <div className="text-2xl font-bold text-center mt-4">{resultMessage}</div>
      )}

      <button
        className={`GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-8 p-1 mx-auto w-60 flex justify-center items-center ${
          currentContestantIndex !== 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmitAnswer}
        disabled={currentContestantIndex !== 0}
      >
        <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
      </button>

      <div className="text-center text-xl font-semibold mt-6">
        {currentContestantIndex === 0 ? "It's Your Turn!" : `It's Contestant ${currentContestantIndex + 1}'s Turn`}
      </div>
    </div>
  );
}

export default Contest;
