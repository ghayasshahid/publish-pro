import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../GlobalStateStore";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state);

  const login = (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "SET_AUTH", payload: { token, user } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "CLEAR_TOKEN" });
    window.location.href = "/";
  };

  return { token, user, login, logout, isAuthenticated: !!token };
};
