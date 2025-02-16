import React from 'react';

const AnswerBox = ({ transcript }) => {
    return (
    <div className="bg-[#A1DDE8] rounded-3xl w-3/4 self-end p-4">
        <div className="text-xl font-normal mb-1">Your Answer</div>
        <div className="bg-white p-4 rounded-2xl" transcript={transcript}>
        {transcript}
        </div>
      </div>
    );
};

export default AnswerBox;
