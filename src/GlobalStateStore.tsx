import { createStore } from "redux";

interface AppState {
  token: string | null;
}

interface Action {
  type: string;
  payload: string;
}

const initialState: AppState = { token: localStorage.getItem("token") };

const reducer = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case "SET_TOKEN":
      return { ...state, token: action.payload ?? state.token };
    case "CLEAR_TOKEN":
      return { ...state, token: null };
    default:
      return state;
  }
};

const globalStateStore = createStore(reducer);
export type RootState = ReturnType<typeof globalStateStore.getState>;
export default globalStateStore;
