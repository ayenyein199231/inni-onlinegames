'use client';

import SnakeGame from '../../components/games/snake-game'; // သင် SnakeGame ကို ထည့်ထားတဲ့နေရာ

const GamesPage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <SnakeGame />
    </div>
  );
};

export default GamesPage;
