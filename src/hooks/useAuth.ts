import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../GlobalStateStore";

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.token);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    dispatch({ type: "SET_TOKEN", payload: token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "CLEAR_TOKEN" });
    window.location.href = "/";
  };

  return { token, login, logout, isAuthenticated: !!token };
};
