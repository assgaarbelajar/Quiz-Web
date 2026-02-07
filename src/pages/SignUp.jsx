import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = signup(username, password);
    if (!result.success) {
      setError(result.message);
    } else {
      setError("");
      navigate("/quiz");
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password (min 6, letters & numbers)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: "12px" }}
          />
          <button className="button" type="submit">
            Signup
          </button>
        </form>

        {error && <div className="error-text">{error}</div>}

        <p className="helper-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
