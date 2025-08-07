import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/userSlice.js";
import { loginUser } from "../api/auth.js";

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ 
        email: emailOrUsername,
        password,
      });

      dispatch(loginSuccess({ user: data.user, token: data.token }));
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-8 mt-12">
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Email or Username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm text-gray-600 text-center">
          Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}

export default Login;