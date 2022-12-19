import { Children } from "react";

export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-2 rounded-lg my-4">
      <div className="flex items-center gap-3">
        <img src={avatar} alt="profile" className="w-10 rounded-full" />
        <h2>{username}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
