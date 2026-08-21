import { createStore } from "redux";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  token: string | null;
  user: User | null;
}

interface Action {
  type: string;
  payload: any;
}

const initialState: AppState = {
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

const reducer = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "CLEAR_TOKEN":
      return { ...state, token: null, user: null };
    default:
      return state;
  }
};

const globalStateStore = createStore(reducer);
export type RootState = ReturnType<typeof globalStateStore.getState>;
export default globalStateStore;
