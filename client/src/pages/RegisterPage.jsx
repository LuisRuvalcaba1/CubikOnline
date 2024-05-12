import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigation = useNavigate();
  useEffect(() => {
    if (isAuthenticated) navigation("/profile");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    await signup(values);
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        {registerErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            {...register("firstName", {
              required: "El primer nombre es requerido",
              pattern: {
                value: /^[a-zA-Z\s]{3,50}$/,
                message:
                  "El primer nombre debe contener solo letras y tener entre 3 y 50 caracteres",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Primer Nombre"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
          <input
            type="text"
            {...register("lastName", {
              required: "El apellido es requerido",
              pattern: {
                value: /^[a-zA-Z\s]{2,50}$/,
                message:
                  "El apellido debe contener solo letras y tener entre 2 y 50 caracteres",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Apellido Paterno"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
          <input
            type="text"
            {...register("username", {
              required: "El nombre de usuario es requerido",
              pattern: {
                value: /^[a-zA-Z0-9._-]{3,50}$/,
                message:
                  "El nombre de usuario debe contener letras, números y los caracteres ._- y tener entre 3 y 50 caracteres",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
          <input
            type="email"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "El email debe ser válido",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 10,
                message: "La contraseña debe tener al menos 10 caracteres",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)/,
                message:
                  "La contraseña debe contener al menos una letra mayúscula y un número",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Password"
          />
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirmar contraseña es requerido",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            placeholder="Confirmar Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <button
            type="submit"
            className="border-2 border-white-600 rounded-lg px-3 py-2 text-white cursor-pointer hover:bg-gray-900 hover:text-white text-center w-full mt-4"
          >
            Register
          </button>

          <p className="flex gap-x-2 justify-between">
            Already have an account?
            <Link to="/login" className="border-2 border-white rounded-lg px-3 py-2 text-white cursor-pointer hover: bg-gray-900 hover:text-white">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;