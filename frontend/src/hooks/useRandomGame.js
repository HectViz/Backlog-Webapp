import { useState, useCallback } from 'react';

export function useRandomGame(games = []) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = useCallback((filterStatus = '') => {
    const eligibleGames = games.filter(game => {
      if (filterStatus) {
        return game.status === filterStatus;
      }
      return game.status !== 'Completado';
    });

    if (eligibleGames.length === 0) {
      setSelectedGame(null);
      return;
    }

    setIsSpinning(true);
    setSelectedGame(null);

    let counter = 0;
    const duration = 2000;
    const intervalTime = 80;

    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleGames.length);
      setSelectedGame(eligibleGames[randomIndex]);
      counter += intervalTime;

      if (counter >= duration) {
        clearInterval(timer);
        setIsSpinning(false);
      }
    }, intervalTime);
  }, [games]);

  return {
    selectedGame,
    isSpinning,
    spin,
  };
}

export default useRandomGame;
