import { useAuth } from "../context/AuthContext.jsx";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

function Account() {
  const { updatePassword } = useAuth();
  const { register, handleSubmit } = useForm();
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  const [showPassForm, setShowPassForm] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const form = useRef();

  const serviceID = "service_pldhi1s";
  const templateID = "template_x9ft7di";
  const publicKey = "kKxJMNK70fUYPciwV";

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(e.target.elements.message.value);
    setToken(e.target.elements.message.value);
    // e.target.elements.message.value = token
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
    setShowTokenInput(true);
  };

  const verifyToken = (e) => {
    e.preventDefault();
    const enteredToken = e.target.elements.token.value;

    if (enteredToken === token) {
      setShowPassForm(true);
    } else {
      alert("Token no valido");
    }
  };

  const generateToken = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let token = "";

    for (let i = 0; i < 2; i++) {
        token += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    for (let i = 0; i < 4; i++) {
        token += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return token;
};

// Ejemplo de uso
console.log(generateToken());

  // const newToken = generateToken()
  // setToken(newToken)

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    updatePassword(data);
  });

  return (
    <div>
      <h1>Account</h1>
      <div>
        <h2>Change Password</h2>
        <form ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type="text" name="to_name" className="text-black" />
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="text-black"
            {...register("email")}
          />
          <input
            type="hidden"
            name="message"
            value={generateToken()}
            // {...register("message")}
          />
          <input type="submit" value="Send" />
          <input
            type="hidden"
            name="from_name"
            value={"Cubik"}
            //{...register("from_name")}
          />
        </form>
        {showTokenInput && (
          <form onSubmit={verifyToken}>
            <label>Token</label>
            <input type="text" name="token" className="text-black" />
            <input type="submit" value="Verify" />
          </form>
        )}
        {showPassForm && (
          <form onSubmit={onSubmit}>
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              {...register("newPassword")}
              className="text-black"
              required
            />
            <input type="submit" value="Change Password" />
          </form>
        )}
      </div>
    </div>
  );
}
export default Account;
