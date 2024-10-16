import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export const metadata = {
  title: "Sign In - Open PRO",
  description: "Page description",
};

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in by looking for a JWT token
    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      // If the user is already logged in, redirect to the lookup page
      router.push("/lookup");
    }
  }, [router]);

  // Function to handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"; // Redirect to Google login endpoint
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Welcome back
            </h1>
          </div>
          {/* Google Sign In */}
          <div className="mx-auto max-w-[400px]">
            <div className="space-y-5">
              <button
                onClick={handleGoogleLogin}
                className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
              >
                Sign In with Google
              </button>
            </div>
          </div>
          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            Don't have an account?{" "}
            <Link className="font-medium text-indigo-500" href="/signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
