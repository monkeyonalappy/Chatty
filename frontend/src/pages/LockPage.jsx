import { useState } from "react";
import { KeyRound, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const LockPage = ({ onUnlocked }) => {
  const [password, setPassword] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUnlocking(true);

    try {
      await axiosInstance.post("/auth/unlock", { password });
      onUnlocked();
      toast.success("Access granted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to unlock the app");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="size-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Private Chat</h1>
          <p className="text-base-content/60">
            Enter the access password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="label" htmlFor="site-password">
            <span className="label-text font-medium">Access password</span>
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
            <input
              id="site-password"
              type="password"
              className="input input-bordered w-full pl-10"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isUnlocking}
          >
            {isUnlocking ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Unlock app"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockPage;
