import Link from "next/link";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <button className="py-2 text-sm bg-teal-500 px-4 text-white rounded-md hover:bg-teal-700 ">
              Join now
            </button>
          </Link>
        )}
        {user && (
          <div className="flex gap-6 items-center">
            <Link href={"/post"}>
              <button className="btn">Post</button>
            </Link>
            <Link href={"/dashboard"}>
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                alt="user image"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
