import React from 'react';

const Scoreboard = ({ scores }) => {
  return (
    <div className="w-full bg-blue-500 text-white py-4 shadow-lg flex justify-center">
      {scores.map((score, index) => (
        <div key={index} className="mx-4 text-center">
          <h2 className="text-lg font-bold">Contestant {index + 1}</h2>
          <p className="text-2xl">{score}</p>
        </div>
      ))}
    </div>
  );
};

export default Scoreboard;
