import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/genres';

export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener géneros.');
    }
  }
);

export const addGenre = createAsyncThunk(
  'genres/addGenre',
  async (genreData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, genreData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear género.');
    }
  }
);

export const updateGenre = createAsyncThunk(
  'genres/updateGenre',
  async ({ id, genreData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, genreData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar género.');
    }
  }
);

export const deleteGenre = createAsyncThunk(
  'genres/deleteGenre',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar género.');
    }
  }
);

const genresSlice = createSlice({
  name: 'genres',
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
      // Fetch Genres
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Genre
      .addCase(addGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Genre
      .addCase(updateGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Genre
      .addCase(deleteGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = genresSlice.actions;
export default genresSlice.reducer;
