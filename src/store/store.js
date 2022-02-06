import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialAlertState = { alertType: "none", alertText: "" };

const alertSlice = createSlice({
  name: "alert",
  initialState: initialAlertState,
  reducers: {
    setAlert(state, action) {
      state.alertType = action.payload.alertType;
      state.alertText = action.payload.alertText;
    },
    cancelAlert(state) {
      state.alertText = "";
      state.alertType = "none";
    },
  },
});

const initalFavState = {
  favPosts: [],
  favJourneys: [],
  favExps: [],
  favUsers: [],
};

const favSlice = createSlice({
  name: "fav",
  initialState: initalFavState,
  reducers: {
    updateFavs(state, action) {
      state.favPosts = action.payload.favPosts;
      state.favJourneys = action.payload.favJourneys;
      state.favExps = action.payload.favExps;
      state.favUsers = action.payload.favUsers;
    },
    addItem(state, action) {
      state[action.payload.itemType].push(action.payload.item);
    },
    removeItem(state, action) {
      state[action.payload.itemType] = state[action.payload.itemType].filter(
        (el) => el !== action.payload.item
      );
    },
  },
});

const initialUserState = {
  userImg: "",
  userName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    updateUser(state, action) {
      state.userImg= action.payload.userImg;
      state.userName = action.payload.userName;
    },
    clearUser(state, action) {
      state.userImg = "";
      state.userName = "";
    },
  },
});

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    alert: alertSlice.reducer,
    fav: favSlice.reducer,
  },
});

export const userActions = userSlice.actions;
export const alertActions = alertSlice.actions;
export const favActions = favSlice.actions;

export default store;
