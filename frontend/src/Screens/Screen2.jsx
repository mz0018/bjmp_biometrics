import { lazy, useState, Suspense } from "react";
import SigninFallback from "../fallback/SigninFallback";
import SignupFallback from "../fallback/SignupFallback";

const Signup = lazy(() => import("./auth/Signup"));
const Signin = lazy(() => import("./auth/Signin"));

const Screen2 = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden xl:flex w-1/2 bg-gray-100"></div>

      <div className="flex flex-col items-center justify-center w-full xl:w-1/2 p-6">
        <Suspense fallback={isSignupOpen ? <SignupFallback /> : <SigninFallback />}>
          {isSignupOpen ? <Signup /> : <Signin />}
        </Suspense>

        <p className="mt-4 text-sm text-[#002868]">
          {isSignupOpen ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignupOpen(false)}
                className="font-semibold text-blue-500 cursor-pointer"
              >
                Sign in
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignupOpen(true)}
                className="font-semibold text-blue-500 cursor-pointer"
              >
                Signup here
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Screen2;
