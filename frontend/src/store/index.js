import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import platformsReducer from './platformsSlice';
import genresReducer from './genresSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    platforms: platformsReducer,
    genres: genresReducer,
  },
});

export default store;
