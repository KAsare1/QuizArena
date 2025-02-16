import QuizLogo from "../components/Logo";
import { Cup, Award, TimerStart, Rank, Book, MedalStar, Flash, Computing, Crown1 } from 'iconsax-react';

function Home() {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen">
      {/* Trophy Icon Behind the Main Component */}
      <Cup size="350" color="#000000" className="absolute opacity-5" />

      {/* Other Background Icons */}
      <Award size="64" color="#000000" className="absolute top-20 right-10 opacity-10" />
      <TimerStart size="64" color="#000000" className="absolute bottom-20 left-10 opacity-10" />
      <Rank size="64" color="#000000" className="absolute bottom-10 right-10 opacity-10" />
      <Book size="64" color="#000000" className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 opacity-10" />
      <MedalStar size="64" color="#000000" className="absolute bottom-1/2 right-1/4 transform translate-x-1/2 translate-y-1/2 opacity-10" />
      <Flash size="64" color="#000000" className="absolute top-20 right-1/3 opacity-10" />
      <Computing size="64" color="#000000" className="absolute top-10 left-1/3 opacity-10"/>
      <Crown1 size="64" color="#000000" className="absolute bottom-10 left-1/3 opacity-10"/>

      {/* Main Component */}
      <QuizLogo className='z-40'/>
    </div>
  );
}

export default Home;
