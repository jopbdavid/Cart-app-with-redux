import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartItems } from "../../cartItems.js";
import axios from "axios";
import { openModal } from "../modal/modalSlice.js";

const url = "http://course-api.com/react-useReducer-cart-project";

const initialState = {
  cart: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    try {
      const resp = await axios.get(url);
      const cart = resp.data;
      return cart;
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

const cartSlicer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    },
    removeItem: (state, action) => {
      const newCart = state.cart.filter((item) => item.id !== action.payload);
      state.cart = newCart;
    },
    increase: (state, action) => {
      const newCart = state.cart.map((item) => {
        if (item.id == action.payload) {
          item.amount++;
          return item;
        }

        return item;
      });

      state.cart = newCart;
    },
    decrease: (state, action) => {
      const newCart = state.cart.map((item) => {
        if (item.id == action.payload) {
          if (item.amount === 1) {
            return item;
          }
          item.amount--;

          return item;
        }

        return item;
      });

      state.cart = newCart;
    },
    calculateTotals: (state) => {
      state.amount = state.cart.reduce((x, item) => x + item.amount, 0);
      state.total = state.cart.reduce((total, item) => {
        const value = item.amount * item.price;
        return total + value;
      }, 0);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// console.log(cartSlicer);
export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlicer.actions;
export default cartSlicer.reducer;
