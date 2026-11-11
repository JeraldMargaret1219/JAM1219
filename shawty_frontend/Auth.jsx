import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "./store.jsx";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const { login, register } = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", first_name: "", last_name: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) await login(f.username, f.password);
      else await register(f);
      nav("/");
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="auth-wrap">
      <form className="panel auth" onSubmit={submit}>
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>
        {!isLogin && (
          <>
            <input placeholder="First name" value={f.first_name} onChange={set("first_name")} required />
            <input placeholder="Last name" value={f.last_name} onChange={set("last_name")} required />
            <input type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
          </>
        )}
        <input placeholder="Username" value={f.username} onChange={set("username")} required autoComplete="username" />
        <input type="password" placeholder="Password (8+ characters)" value={f.password} onChange={set("password")} required minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-solid full">{isLogin ? "Log in" : "Create account"}</button>
        <p className="muted center">
          {isLogin ? <>New to Shawty? <Link to="/register">Sign up</Link></> : <>Already have an account? <Link to="/login">Log in</Link></>}
        </p>
      </form>
    </div>
  );
}
