import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/platforms';

export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener plataformas.');
    }
  }
);

export const addPlatform = createAsyncThunk(
  'platforms/addPlatform',
  async (platformData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, platformData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear plataforma.');
    }
  }
);

export const updatePlatform = createAsyncThunk(
  'platforms/updatePlatform',
  async ({ id, platformData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, platformData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar plataforma.');
    }
  }
);

export const deletePlatform = createAsyncThunk(
  'platforms/deletePlatform',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al eliminar plataforma.');
    }
  }
);

const platformsSlice = createSlice({
  name: 'platforms',
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
      // Fetch Platforms
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Platform
      .addCase(addPlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlatform.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addPlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Platform
      .addCase(updatePlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlatform.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Platform
      .addCase(deletePlatform.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlatform.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deletePlatform.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = platformsSlice.actions;
export default platformsSlice.reducer;
