import { useAuth } from "../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { getUserByEmailRequest } from "../api/auth.js";
function Account() {
  const { updatePassword } = useAuth();
  const { register, handleSubmit } = useForm();
  const token = '';
  const form = useRef();

  const serviceID = "service_pldhi1s";
  const templateID = "template_x9ft7di";
  const publicKey = "kKxJMNK70fUYPciwV";

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(serviceID, templateID, form.current, {
        publicKey: publicKey,
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  const generateToken = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  };
  

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    updatePassword(data);
  });

  return (
    <div>
      <h1>Account</h1>
      <div>
        <h2>Change Password</h2>
        <form ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type="text" name="to_name" className="text-black"/>
          <label>Email</label>
          <input type="email" name="to_email" className="text-black"/>
          <input type="hidden" value={generateToken(token)} {...register("message")} />
          <input type="submit" value="Send" />
          <input type="hidden" value={"Cubik"} {...register("from_name")} />
        </form>
      </div>
      <div>
        
        <h2>Change Password</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
          />
          <button type="submit">Change</button>
        </form>
        </div>
    </div>
  );
}
export default Account;
