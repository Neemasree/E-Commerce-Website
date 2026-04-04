import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Styles/loginStyles.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;

      if (isLogin) {
        data = await login(formData.email, formData.password);
      } else {
        data = await register(formData.name, formData.email, formData.password);
      }

      // ✅ ROLE BASED REDIRECT
      if (data.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          {/* HEADER */}
          <div className="login-header">
            <Link to="/" className="brand-link">
              <span className="brand-icon">🛒</span>
              FreshMart Groceries
            </Link>
            <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>
            <p>{isLogin ? "Sign in to continue" : "Join us today"}</p>
          </div>

          {/* FORM */}
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* TOGGLE */}
            <div className="form-footer">
              <p>
                {isLogin ? "New user?" : "Already have an account?"}{" "}
                <button onClick={toggleMode} className="toggle-btn">
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            {/* DEMO INFO */}
            <div className="demo-credentials">
              <h4>Demo Credentials</h4>
              <p>
                <strong>User:</strong> demo@grocerymart.com / demo123
              </p>
              <p>
                <strong>Admin:</strong> admin@grocerymart.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
