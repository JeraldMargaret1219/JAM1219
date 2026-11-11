import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api, setToken, getToken } from "./api";

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [authed, setAuthed] = useState(!!getToken());
  const [cart, setCart] = useState({ cart_products: [] });

  const logout = useCallback(() => {
    setToken(null);
    setAuthed(false);
    setCart({ cart_products: [] });
  }, []);

  const refreshCart = useCallback(async () => {
    if (!getToken()) return;
    try {
      setCart(await api("/cart/"));
    } catch (e) {
      if (e.status === 401) logout();
    }
  }, [logout]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const login = async (username, password) => {
    const data = await api("/auth/login/", { method: "POST", body: { username, password }, auth: false });
    setToken(data.access);
    setAuthed(true);
    await refreshCart();
  };

  const register = async (form) => {
    await api("/auth/register/", { method: "POST", body: form, auth: false });
    await login(form.username, form.password);
  };

  const cartCount = cart.cart_products.reduce((n, i) => n + i.quantity, 0);

  return (
    <Ctx.Provider value={{ authed, login, register, logout, cart, setCart, refreshCart, cartCount }}>
      {children}
    </Ctx.Provider>
  );
}
