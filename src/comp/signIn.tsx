import { type ReactNode } from "react";
import { useUserContext } from "./context";

function SignInPage(): ReactNode {
  const { userName, password, setUserName, setPassword } = useUserContext();

  return (
    <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] p-8 w-[340px]">
      <h2 className="text-lg font-medium text-white mb-1">Sign in</h2>
      <p className="text-sm text-neutral-600 mb-7">Access your workspace</p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1.5">
          Username
        </label>
        <input
          type="text"
          value={userName ?? ""}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="your_username"
          name="username"
          autoComplete="username"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#555] placeholder-neutral-700 transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password ?? ""}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          name="password"
          autoComplete="current-password"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#555] placeholder-neutral-700 transition-colors"
        />
      </div>

      <button type="submit" className="w-full bg-white text-black text-sm font-medium rounded-lg py-2.5 mt-2 hover:bg-neutral-200 transition-colors cursor-pointer">
        Sign in
      </button>
    </div>
  );
}

export default SignInPage;