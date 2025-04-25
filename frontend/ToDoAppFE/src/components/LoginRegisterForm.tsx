import { useState } from "react";

type Props = {
  mode: "login" | "register";
  onSubmit: (data: { username: string; password: string; name?: string }) => void;
};

const LoginRegisterForm = ({ mode, onSubmit }: Props) => {
  // Stato dei campi input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  // Stato degli errori
  const [error, setError] = useState("");

  // Validazione e invio del form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset eventuale errore precedente
    setError("");

    // Validazione
    if (mode === "login" && (!username || !password)) {
      setError("Please enter both username and password.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Insert your name.");
        return;
      }

      if (username.length < 5) {
        setError("Username must be at least 5 characters long.");
        return;
      }

      if (!/^(?=.*[0-9]).{8,}$/.test(password)) {
        setError("Password must be at least 8 characters and 1 number.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    // Se tutto è valido, chiama la funzione passata come prop
    onSubmit({
      username,
      password,
      ...(mode === "register" && { name }),
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-12">
          <div className="card log-card bg-light shadow-lg p-4">
            <h2 className="mb-5">{mode === "login" ? "Login" : "Register"}</h2>

            {error && (
              <div className="alert alert-danger fs-7 opacity-75" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="name">Name</label>
                </div>
              )}

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username">Username</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
              </div>

              {mode === "register" && (
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">
                {mode === "login" ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <hr className="text-secondary my-4" />
            <div className="text-center fs-7">
              {mode === "login" ? (
                <p>
                  New here? <a href="/register">Sign up</a>
                </p>
              ) : (
                <p>
                  Been here before? <a href="/login">Sign in</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;
