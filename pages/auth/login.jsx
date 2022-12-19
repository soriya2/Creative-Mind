import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

function Login() {
  const [user, loading] = useAuthState(auth);
  //sign in with google
  const route = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (error) {
      console.error("message error", error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700">
      <h1 className="text-2xl font-medium text-teal-500 ">Join Today</h1>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          className="text-white p-4 bg-gray-700 w-full font-medium rounded-lg flex gap-4
        "
          onClick={GoogleLogin}
        >
          <FcGoogle size={24} />
          Sign in with Googole
        </button>
      </div>
    </div>
  );
}

export default Login;
