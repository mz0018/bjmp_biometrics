import { lazy, useState, Suspense } from "react";

const Signup = lazy(() => import('./auth/Signup'));
const Signin = lazy(() => import('./auth/Signin'));

const Screen2 = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Suspense fallback={<p>Loading...</p>}>
        {isSignupOpen ? <Signup /> : <Signin />}
      </Suspense>

      <button
        onClick={() => setIsSignupOpen((prev) => !prev)}
        className="mt-4 text-blue-500 underline"
      >
        {isSignupOpen
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    </div>
  );
};

export default Screen2;
