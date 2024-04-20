import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    signin,
    statusChangeAuth,
    isAuthenticated,
    errors: signinErrors,
  } = useAuth();
  const navigation = useNavigate();

  const onSubmit = handleSubmit((data) => {
    data.status = "active";
    data.role = "user";
    statusChangeAuth(data);
    signin(data);
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigation("/profile");
    }
  }, [isAuthenticated, navigation]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {signinErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
          <br />
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Password"
          />
          <br />
          {errors.password && (
            <p className="text-red-500 bg-center">Password is required</p>
          )}
          <button type="submit">Login</button>

          <p className="flex gap-x-2 justify-between">
            Dont have an account?
            <Link to="/register" className="sky-text-500">
              {" "}
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
