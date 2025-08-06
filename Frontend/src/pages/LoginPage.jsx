import { useState } from "react";
import { Webhook, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {
  //   mutate: loginMutation,
  //   isPending,
  //   error,
  // } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // This is how we did it using our custom hook - optimized version
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-base-200 via-base-100 to-base-200 overflow-hidden"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-6xl h-full max-h-[90vh] mx-auto bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-10 flex flex-col justify-center overflow-y-auto">
          {/* LOGO */}
          <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center justify-start gap-3 animate-fade-in">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <Webhook className="size-8 text-white" />
            </div>
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              DarkPing
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-6 animate-slide-down">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error.response?.data?.message || "An error occurred during login"}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-sm sm:text-base opacity-70 leading-relaxed">
                  Sign in to your account to continue your language journey and connect with friends worldwide
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Email Address</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:input-primary focus:scale-[1.02]"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="input input-bordered w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:input-primary focus:scale-[1.02]"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:scale-100" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-base">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-primary hover:text-primary-focus font-semibold hover:underline transition-all duration-200 hover:scale-105 inline-block"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

                 {/* IMAGE SECTION */}
         <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 items-center justify-center relative overflow-hidden">
           {/* Background decoration */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
           <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
           
           <div className="max-w-md p-4 sm:p-6 relative z-10 overflow-y-auto max-h-full flex flex-col justify-center">
             {/* Illustration */}
             <div className="relative aspect-square max-w-[200px] sm:max-w-[250px] mx-auto mb-4 sm:mb-6 flex-shrink-0">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
               <img 
                 src="/img.png" 
                 alt="Language connection illustration" 
                 className="w-full h-full object-contain relative z-10 animate-float" 
               />
             </div>

                         <div className="text-center space-y-2 sm:space-y-3 flex-shrink-0">
               <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                 Connect with language partners worldwide
               </h2>
               <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                 Practice conversations, make friends, and improve your language skills together in a supportive community
               </p>
               
               {/* Feature highlights */}
               <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                 <div className="text-center p-2 bg-base-100/50 rounded-xl backdrop-blur-sm">
                   <div className="text-lg sm:text-xl mb-1">🌍</div>
                   <p className="text-xs font-medium">Global Community</p>
                 </div>
                 <div className="text-center p-2 bg-base-100/50 rounded-xl backdrop-blur-sm">
                   <div className="text-lg sm:text-xl mb-1">💬</div>
                   <p className="text-xs font-medium">Real-time Chat</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
