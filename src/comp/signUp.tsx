import { type ReactNode } from "react";
import { useUserContext } from "./context";

function SignUpPage(): ReactNode {
  const { userName, password, setUserName, setPassword, emailId, setEmailId } = useUserContext();

  return (
    <div className="bg-[#111] rounded-2xl border border-[#2a2a2a] p-8 w-[340px]">
      <h2 className="text-lg font-medium text-white mb-1">Create account</h2>
      <p className="text-sm text-neutral-600 mb-7">Join and start collaborating</p>

      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1.5">
          Username
        </label>
        <input
          type="text"
          value={userName ?? ""}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="choose_a_username"
          name="username"
          autoComplete="username"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#555] placeholder-neutral-700 transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={emailId ?? ""}
          onChange={(e) => setEmailId(e.target.value)}
          placeholder="you@example.com"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm px-3 py-2.5 outline-none focus:border-[#555] placeholder-neutral-700 transition-colors"
        />
      </div>

      <button type="submit" className="w-full bg-white text-black text-sm font-medium rounded-lg py-2.5 mt-2 hover:bg-neutral-200 transition-colors cursor-pointer">
        Create account
      </button>
    </div>
  );
}

export default SignUpPage;