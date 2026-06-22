import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/games';

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.platformId) queryParams.append('platformId', params.platformId);
      if (params.genreId) queryParams.append('genreId', params.genreId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener videojuegos.');
    }
  }
);

export const addGame = createAsyncThunk(
  'games/addGame',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear videojuego.');
    }
  }
);

export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar videojuego.');
    }
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar videojuego.');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Game
      .addCase(addGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGame.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Game
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Game
      .addCase(deleteGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGame.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = gamesSlice.actions;
export default gamesSlice.reducer;
