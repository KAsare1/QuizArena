import React, { useState, useEffect } from 'react';

const QuizQuestion = ({ socket, connected }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    if (!socket || !connected) return;

    // Handle incoming WebSocket messages
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'initial_state':
          setCurrentQuestion(data.data.current_question);
          break;
        case 'question_update':
          setCurrentQuestion(data.data.question);
          break;
        case 'game_over':
          setCurrentQuestion({ Question: 'Game Over!' });
          break;
        default:
          break;
      }
    };

    socket.addEventListener('message', handleMessage);

    // Clean up the event listener on unmount or when socket/connected changes
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, connected]);

  return (
    <div className="bg-[#A1DDE8] rounded-3xl p-2 w-3/4 h-1/2 mb-1 justify-center self-center mt-3">
      <div className="text-xl font-normal">Question</div>
      <div className="bg-white p-12 rounded-2xl">
        {/* Render the Question property of the object */}
        {currentQuestion ? currentQuestion.Question : 'Loading question...'}
      </div>
    </div>
  );
};

export default QuizQuestion;
