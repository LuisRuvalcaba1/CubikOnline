import { useAuth } from "../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
function Account() {
  const { updatePassword } = useAuth();
  const { register, handleSubmit } = useForm();
  // useEffect(() => {
  //   setNewPassword(params.newPassword);
  //   setEmail(params.email);
  // }, [params.email, params.newPassword]);


  const onSubmit = handleSubmit((data)=> {
    updatePassword(data);
});

  return (
    <div>
      <h1>Account</h1>
      <div>
        <h2>Change Password</h2>
        <form onSubmit={onSubmit}>
          <h1>User Email: </h1>
          <input
            type="email"
            {...register("email", { required: true })}
            style={{
              fontSize: "20px",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "white",
              padding: "10px",
            }}
          />
          <h1>New Password</h1>
          <input
            type="password"
            {...register("newPassword", { required: true })}
            style={{
              fontSize: "20px",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "white",
              padding: "10px",
            }}
          />
          <button type="submit">Change</button>
        </form>
      </div>
    </div>
  );
}
export default Account;
