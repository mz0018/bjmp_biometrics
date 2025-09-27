import { lazy, useState, Suspense } from "react";

const Signup = lazy(() => import("./auth/Signup"));
const Signin = lazy(() => import("./auth/Signin"));

const SigninFallback = lazy(() => import("../fallback/SigninFallback"));
const SignupFallback = lazy(() => import("../fallback/SignupFallback"));

const Screen2 = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden xl:flex w-1/2 bg-gray-100 relative">
        <img src="/img/office.webp" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55"></div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[200px] bg-red-500/40 flex items-center justify-center px-6">
          <img 
            src="/img/banner-v2.png" 
            alt="banner" 
            loading="lazy"
            className="w-full h-full object-contain" 
          />
        </div>
      </div>

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
