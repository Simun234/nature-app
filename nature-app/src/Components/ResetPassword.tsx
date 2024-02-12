import { FormEventHandler, useState } from "react";
import "../index.css";

const users = [
  { username: "user1", email: "user1@example.com", password: "password1" },
  { username: "user2", email: "user2@example.com", password: "password2" },
];

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");

  const handlePasswordReset: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    // Find the user with the given email
    const user = users.find((user) => user.email === email);

    if (user) {
      // Reset the user's password
      user.password = newPassword;
      console.log(`Password for ${email} has been reset successfully.`);
    } else {
      console.log(`No user found with the email ${email}.`);
    }
  };

  return (
    <div>
      <h1 className="font-sans text-2xl text-black p-1 lg:text-3xl md:text-2xl sm:text-lg">
        Reset Your Password
      </h1>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="Enter new password"
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-1 p-1  lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter your email"
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-1 p-1  lg:w-80 lg:h-11 lg:text-xl sm:w-40 sm:h-6 sm:text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-white bg-opacity-50 rounded-2xl text-black font-bold mt-4 lg:w-32 lg:h-11
            md:p-0 w-9 h-auto sm:w-30 sm:h-14 text-xs p-0.5"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
