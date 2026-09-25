import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import { loginWithRetry } from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import BillingDrawer from "../components/BillingDrawer";
import logOut from "../features/logOut";
import { Coins, LogOut, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [accountOpen, setAccountOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return undefined;

    const closeOnOutsideTap = (event) => {
      if (!accountRef.current?.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideTap);
    return () => document.removeEventListener("pointerdown", closeOnOutsideTap);
  }, [accountOpen]);
  const handleLogin = async (token) => {
    try {
      const { data } = await loginWithRetry(token);
      dispatch(setUserdata(data));
    } catch (error) {
      console.log(error);
    }
  };

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    await handleLogin(token);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Unable to close the server session", error);
    } finally {
      await signOut(auth);
      dispatch(setUserdata(null));
      setAccountOpen(false);
    }
  };

  return (
    <div className="app-shell h-[100dvh] min-h-[320px] flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      <Artifact />

      {userData && (
        <div ref={accountRef} className="fixed top-3 right-3 z-40">
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((open) => !open)}
              className="group flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#111522]/95 p-0.5 text-slate-300 shadow-[0_6px_18px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition hover:border-cyan-200/70 hover:shadow-[0_0_18px_rgba(103,232,249,.22)]"
              aria-label="Open account menu"
              aria-expanded={accountOpen}
            >
              {userData?.avatar ? (
                <img src={userData.avatar} alt="" className="h-full w-full rounded-[9px] object-cover transition duration-300 group-hover:scale-105" />
              ) : (
                <User size={15} />
              )}
            </button>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-[#111522] bg-cyan-300 shadow-[0_0_7px_rgba(103,232,249,.9)]" />
          </div>

          {accountOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#151925]/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-white/[0.07] px-2 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/[0.06] text-slate-300">
                  {userData?.avatar ? (
                    <img src={userData.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User size={15} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-100">{userData?.name || "Account"}</p>
                  <p className="text-[10px] text-slate-500">{userData?.plan || "free"} plan</p>
                </div>
                <button type="button" onClick={() => setAccountOpen(false)} className="ml-auto text-slate-500 hover:text-slate-200" aria-label="Close account menu">
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">Plan</p>
                  <p className="mt-0.5 truncate text-xs font-semibold capitalize text-slate-100">
                    {userData?.plan || "free"}
                  </p>
                </div>
                <div className="rounded-xl border border-indigo-300/10 bg-indigo-500/10 px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-indigo-200/60">Credits</p>
                  <p className="mt-0.5 text-xs font-semibold text-indigo-100">
                    {userData?.credits ?? 0}
                    <span className="font-normal text-indigo-200/60"> / {userData?.totalCredits ?? 0}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  setBillingOpen(true);
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-xs text-slate-300 transition hover:bg-indigo-500/10 hover:text-indigo-200"
              >
                <Coins size={14} className="text-yellow-400" />
                Top up credits
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-xs text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}

      <BillingDrawer open={billingOpen} onClose={() => setBillingOpen(false)} />

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="login-card w-[min(90vw,390px)] bg-[#13151c] border border-white/[0.1] rounded-3xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to JarvisAI
              </h2>
              <p className="text-[13px] text-slate-500">
                Please login to continue using the app.
              </p>
            </div>

            <button
              className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200  transition-all duration-150 cursor-pointer"
              onClick={googleLogin}
            >
              <FcGoogle size={15} />
              Continue With Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
