// import React from "react";
// import {
//   Coins,
//   LogOut,
//   Menu,
//   MessageSquare,
//   MoreHorizontal,
//   PanelLeftIcon,
//   PanelRight,
//   PenSquare,
//   Pin,
//   Plus,
//   Trash2,
//   User,
//   X,
// } from "lucide-react";
// import { useState } from "react";
// import { useEffect } from "react";
// import { getConversations } from "../features/getConversations";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addConversation,
//   removeConversation,
//   setConversationPinned,
//   setConversations,
//   setConvTitle,
//   setSelectedConversation,
// } from "../redux/conversationSlice";

// import { createConversation } from "../features/createConversation";
// import logOut from "../features/logOut";
// import { setUserdata } from "../redux/userSlice";
// import BillingDrawer from "./BillingDrawer";
// import { updateConversation } from "../features/updateConversation";
// import { deleteConversation } from "../features/deleteConversation";
// function SideBar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const dispatch = useDispatch();
//   const [imageError, setImageError] = useState(false);
//   const { conversations, selectedConversation } = useSelector(
//     (state) => state.conversation,
//   );
//   const { userData } = useSelector((state) => state.user);
//   const userId = userData?._id || userData?.userId;
//   const [showBilling, setShowBilling] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   useEffect(() => {
//     const getConv = async () => {
//       if (!userId) {
//         dispatch(setConversations([]));
//         return;
//       }
//       const data = await getConversations();
//       if (Array.isArray(data)) {
//         dispatch(setConversations(data));
//       }
//     };
//     getConv();
//   }, [userId]);

//   const handleRename = async (conversation) => {
//     const title = window.prompt("Rename conversation", conversation.title);
//     if (!title?.trim() || title.trim() === conversation.title) return;
//     const updated = await updateConversation({
//       id: conversation._id,
//       title: title.trim(),
//     });
//     if (updated?._id)
//       dispatch(
//         setConvTitle({
//           conversationId: conversation._id,
//           title: updated.title,
//         }),
//       );
//     setOpenMenuId(null);
//   };

//   const handlePin = async (conversation) => {
//     const updated = await updateConversation({
//       id: conversation._id,
//       pinned: !conversation.pinned,
//     });
//     if (updated?._id)
//       dispatch(
//         setConversationPinned({
//           conversationId: conversation._id,
//           pinned: updated.pinned,
//         }),
//       );
//     setOpenMenuId(null);
//   };

//   const handleDelete = async (conversation) => {
//     if (!window.confirm("Delete this conversation?")) return;
//     if (await deleteConversation(conversation._id)) {
//       dispatch(removeConversation(conversation._id));
//     }
//     setOpenMenuId(null);
//   };

//   const handleCreateConversation = async () => {
//     const data = await createConversation();
//     dispatch(addConversation(data));
//   };

//   if (collapsed) {
//     return (
//       <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
//         <button
//           className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
//           onClick={() => setCollapsed(false)}
//         >
//           <PanelRight />
//         </button>

//         <button
//           className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer "
//           onClick={() => dispatch(setSelectedConversation(null))}
//         >
//           <Plus size={17} />
//         </button>

//         <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5">
//           {conversations.map((conv, i) => {
//             const isActive = selectedConversation?._id == conv?._id;
//             return (
//               <div
//                 key={conv?._id}
//                 onClick={() => dispatch(setSelectedConversation(conv))}
//                 className={`group relative flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.06]
//                 ${
//                   isActive
//                     ? "bg-indigo-500/10 border-indigo-500/[0.18]"
//                     : "bg-transparent border-transparent"
//                 }`}
//               >
//                 <div
//                   className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}
//                 >
//                   <MessageSquare size={13} />
//                 </div>

//               </div>
//             );
//           })}
//         </div>

//         <div className='"relative shrink-0'>
//           {userData?.avatar && !imageError ? (
//             <img
//               className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
//               src={userData?.avatar}
//               alt={"image"}
//               onError={() => setImageError(true)}
//             />
//           ) : (
//             <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
//               <User size={15} className="text-slate-400" />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <button
//         className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
//         onClick={() => setMobileOpen(true)}
//       >
//         <Menu size={14} />
//       </button>

//       {mobileOpen && (
//         <div
//           onClick={() => setMobileOpen(false)}
//           className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
//         />
//       )}

//       <div
//         className={` fixed lg:static inset-y-0 left-0 z-50
//         w-[270px] h-screen shrink-0
//         bg-[#0d0f14] border-r border-white/[0.06]
//         transition-transform duration-250
//         ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
// `}
//       >
//         <div className="flex flex-col h-full">
//           <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
//             <div
//               className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
//               onClick={() => setCollapsed(true)}
//             >
//               <PanelLeftIcon />
//             </div>

//             <button
//               onClick={() => setMobileOpen(false)}
//               className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
//             >
//               <X />
//             </button>
//             <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
//               JarvisAI
//             </span>
//             <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
//               {userData?.plan || "free"}
//             </span>
//             <button
//               className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
//               onClick={() => dispatch(setSelectedConversation(null))}
//             >
//               <PenSquare size={14} />
//             </button>
//           </div>

//           <div className="px-4 pt-4 pb-1">
//             <button
//               className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
//               onClick={() => dispatch(setSelectedConversation(null))}
//             >
//               <Plus size={15} />
//               New Chat
//             </button>
//           </div>

//           {conversations.length == 0 ? (
//             <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
//               No Recent Conversations
//             </div>
//           ) : (
//             <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
//               Recents
//             </div>
//           )}

//           <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             {conversations?.map((conv, i) => {
//               const isActive = selectedConversation?._id == conv?._id;
//               return (
//                 <div
//                   key={conv?._id}
//                   onClick={() => dispatch(setSelectedConversation(conv))}
//                   className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
//                 ${
//                   isActive
//                     ? "bg-indigo-500/10 border-indigo-500/[0.18]"
//                     : "bg-transparent border-transparent"
//                 }`}
//                 >
//                   <div
//                     className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
//                 ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/[0.05] text-slate-500"}`}
//                   >
//                     <MessageSquare size={13} />
//                   </div>
//                   <span
//                     className={`text-[13px] font-medium truncate flex-1 ${isActive ? "text-slate-100" : "text-slate-300"}`}
//                   >
//                     {conv?.title || "New Chat"}
//                   </span>
//                   {conv.pinned && (
//                     <Pin size={12} className="shrink-0 text-indigo-400" />
//                   )}
//                   <button
//                     onClick={(event) => {
//                       event.stopPropagation();
//                       setOpenMenuId(openMenuId === conv._id ? null : conv._id);
//                     }}
//                     className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-slate-500 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white/[0.1] hover:text-slate-200 transition-all"
//                     aria-label={`Actions for ${conv?.title || "conversation"}`}
//                   >
//                     <MoreHorizontal size={15} />
//                   </button>
//                   {openMenuId === conv._id && (
//                     <div
//                       onClick={(event) => event.stopPropagation()}
//                       className="absolute right-2 top-10 z-20 w-36 rounded-lg border border-white/[0.1] bg-[#171a22] p-1 shadow-xl"
//                     >
//                       <button
//                         onClick={() => handleRename(conv)}
//                         className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                       >
//                         <PenSquare size={13} /> Rename
//                       </button>
//                       <button
//                         onClick={() => handlePin(conv)}
//                         className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                       >
//                         <Pin size={13} /> {conv.pinned ? "Unpin" : "Pin"}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(conv)}
//                         className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
//                       >
//                         <Trash2 size={13} /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mx-2.5 h-px bg-white/[0.06]" />
//           <div className="px-3.5 py-3.5">
//             {userData ? (
//               <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
//                 <div className='"relative shrink-0'>
//                   {userData?.avatar && !imageError ? (
//                     <img
//                       className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
//                       src={userData?.avatar}
//                       alt={"image"}
//                       onError={() => setImageError(true)}
//                     />
//                   ) : (
//                     <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
//                       <User size={15} className="text-slate-400" />
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[13.5px] font-semibold text-slate-100 truncate">
//                     {userData?.name || "user"}
//                   </p>
//                   <p className="text-[11px] text-slate-600 mt-px">
//                     {`${userData?.plan}` || "free plan"}{" "}
//                   </p>
//                 </div>
//                 <div className="flex gap-1">
//                   <button
//                     onClick={() => setShowBilling(true)}
//                     className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
//                   >
//                     <Coins size={16} />
//                   </button>
//                   <button
//                     className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
//                     onClick={() => {
//                       logOut();
//                       dispatch(setUserdata(null));
//                     }}
//                   >
//                     <LogOut size={16} />
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150">
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
//     </>
//   );
// }

// export default SideBar;

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PanelLeftIcon,
  PanelRight,
  PenSquare,
  Pin,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";

import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";

import {
  addConversation,
  removeConversation,
  setConversationPinned,
  setConversations,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";

import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import BillingDrawer from "./BillingDrawer";
import { updateConversation } from "../features/updateConversation";
import { deleteConversation } from "../features/deleteConversation";
import { setArtifacts, setMessages } from "../redux/messageSlice";
import { auth } from "../../utils/firebase";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Stores which chat's three-dot menu is open
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const [isResizing, setIsResizing] = useState(false);

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  const { userData } = useSelector((state) => state.user);

  const userId = userData?._id || userData?.userId;

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Unable to close the server session", error);
    } finally {
      await signOut(auth);
      dispatch(setUserdata(null));
      dispatch(setConversations([]));
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));
      setMobileOpen(false);
    }
  };

  // --------------------------------------------------
  // GET CONVERSATIONS
  // --------------------------------------------------

  useEffect(() => {
    const getConv = async () => {
      if (!userId) {
        dispatch(setConversations([]));
        return;
      }

      const data = await getConversations();

      if (Array.isArray(data)) {
        dispatch(setConversations(data));
      }
    };

    getConv();
  }, [userId, dispatch]);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (event) => {
      setSidebarWidth(Math.min(420, Math.max(220, event.clientX)));
    };
    const stopResizing = () => setIsResizing(false);

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // --------------------------------------------------
  // RENAME CONVERSATION
  // --------------------------------------------------

  const handleRename = async (conversation) => {
    const title = window.prompt("Rename conversation", conversation.title);

    if (!title?.trim()) {
      setOpenMenuId(null);
      return;
    }

    if (title.trim() === conversation.title) {
      setOpenMenuId(null);
      return;
    }

    const updated = await updateConversation({
      id: conversation._id,
      title: title.trim(),
    });

    if (updated?._id) {
      dispatch(
        setConvTitle({
          conversationId: conversation._id,
          title: updated.title,
        }),
      );
    }

    setOpenMenuId(null);
  };

  // --------------------------------------------------
  // PIN CONVERSATION
  // --------------------------------------------------

  const handlePin = async (conversation) => {
    const updated = await updateConversation({
      id: conversation._id,
      pinned: !conversation.pinned,
    });

    if (updated?._id) {
      dispatch(
        setConversationPinned({
          conversationId: conversation._id,
          pinned: updated.pinned,
        }),
      );
    }

    setOpenMenuId(null);
  };

  // --------------------------------------------------
  // DELETE CONVERSATION
  // --------------------------------------------------

  const handleDelete = async (conversation) => {
    const confirmed = window.confirm("Delete this conversation?");

    if (!confirmed) {
      setOpenMenuId(null);
      return;
    }

    const deleted = await deleteConversation(conversation._id);

    if (deleted) {
      dispatch(removeConversation(conversation._id));

      // If the deleted chat was selected,
      // clear the selected conversation.
      if (selectedConversation?._id === conversation._id) {
        dispatch(setSelectedConversation(null));
      }
    }

    setOpenMenuId(null);
  };

  // --------------------------------------------------
  // CREATE CONVERSATION
  // --------------------------------------------------

  const handleCreateConversation = async () => {
    const data = await createConversation();

    if (data?._id) {
      dispatch(addConversation(data));
      dispatch(setSelectedConversation(data));
      dispatch(setMessages([]));
      dispatch(setArtifacts([]));
    }
  };

  // --------------------------------------------------
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);


//   Handle Pins




  // --------------------------------------------------
  // COLLAPSED SIDEBAR
  // --------------------------------------------------

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-[56px] h-screen bg-[#0d0f14] border-r border-white/[0.06] py-4 gap-1 shrink-0">
        {/* Expand Sidebar */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(false)}
        >
          <PanelRight />
        </button>

        {/* New Chat */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
          onClick={handleCreateConversation}
        >
          <Plus size={17} />
        </button>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-5">
          {conversations.map((conv) => {
            const isActive = selectedConversation?._id === conv?._id;

            return (
              <div
                key={conv?._id}
                onClick={() => dispatch(setSelectedConversation(conv))}
                title={conv?.title || "New Chat"}
                className={`group relative flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.06]
                ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                    : "bg-transparent border-transparent"
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-[20px] h-[20px] rounded-lg transition-colors duration-150
                  ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "bg-white/[0.05] text-slate-500"
                  }`}
                >
                  <MessageSquare size={13} />
                </div>
              </div>
            );
          })}
        </div>

        {/* User Avatar */}
        <div className="relative shrink-0">
          {userData?.avatar && !imageError ? (
            <img
              className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
              src={userData?.avatar}
              alt="image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
              <User size={15} className="text-slate-400" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 bg-transparent border-none cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // FULL SIDEBAR
  // --------------------------------------------------

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 rounded-lg bg-[#0d0f14] border border-white/[0.06] text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={14} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50
        w-[270px] lg:w-auto h-screen shrink-0
        sidebar bg-[#0d0f14] border-r border-white/[0.06] relative
        transition-transform duration-250
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ "--sidebar-width": `${sidebarWidth}px` }}
      >
        <div className="flex flex-col h-full">
          <div
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture?.(event.pointerId);
              setIsResizing(true);
            }}
            className="hidden lg:block absolute top-0 right-[-4px] z-30 h-full w-2 cursor-col-resize touch-none hover:bg-indigo-500/60 transition-colors"
            aria-label="Resize sidebar"
            role="separator"
            aria-orientation="vertical"
          />
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
            {/* Collapse */}
            <div
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => setCollapsed(true)}
            >
              <PanelLeftIcon />
            </div>

            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <X />
            </button>

            {/* Logo */}
            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              JarvisAI
            </span>

            {/* Plan */}
            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>

            {/* New Chat */}
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={handleCreateConversation}
            >
              <PenSquare size={14} />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pt-4 pb-1">
            <button
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
              onClick={handleCreateConversation}
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {/* Recent label */}
          {conversations.length === 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No Recent Conversations
            </div>
          ) : (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              Recents
            </div>
          )}

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations?.map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;

              return (
                <div
                  key={conv?._id}
                  onClick={() => dispatch(setSelectedConversation(conv))}
                  className={`group relative flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150 hover:bg-white/[0.06]
                  ${
                    isActive
                      ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                      : "bg-transparent border-transparent"
                  }`}
                >
                  {/* Chat Icon */}
                  <div
                    className={`flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-lg transition-colors duration-150
                    ${
                      isActive
                        ? "bg-indigo-500/15 text-indigo-400"
                        : "bg-white/[0.05] text-slate-500"
                    }`}
                  >
                    <MessageSquare size={13} />
                  </div>

                  {/* Chat Title */}
                  <span
                    className={`text-[13px] font-medium truncate flex-1 ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {conv?.title || "New Chat"}
                  </span>

                  {/* Pin */}
                  {conv.pinned && (
                    <Pin size={12} className="shrink-0 text-indigo-400" />
                  )}

                  {/* Three Dots */}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId(openMenuId === conv._id ? null : conv._id);
                    }}
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-slate-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white/[0.1] hover:text-slate-200 transition-all"
                    aria-label={`Actions for ${conv?.title || "conversation"}`}
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {/* Action Menu */}
                  {openMenuId === conv._id && (
                    <div
                      onClick={(event) => event.stopPropagation()}
                      className="absolute right-2 top-10 z-50 w-36 rounded-lg border border-white/[0.1] bg-[#171a22] p-1 shadow-xl"
                    >
                      <button
                        onClick={() => handleRename(conv)}
                        className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      >
                        <PenSquare size={13} />
                        Rename
                      </button>
                      <button
                        onClick={() => handlePin(conv)}
                        className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white"
                      >
                        <Pin size={13} />
                        {conv.pinned ? "Unpin" : "Pin"}
                      </button>
                      <button
                        onClick={() => handleDelete(conv)}
                        className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom separator */}
          <div className="mx-2.5 h-px bg-white/[0.06]" />

          {/* User section */}
          <div className="px-3.5 py-3.5">
            {userData ? (
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/[0.05] transition-colors duration-150">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {userData?.avatar && !imageError ? (
                    <img
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      src={userData?.avatar}
                      alt="image"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* User information */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "user"}
                  </p>

                  <p className="text-[11px] text-slate-600 mt-px">
                    {`${userData?.plan}` || "free plan"}
                  </p>
                </div>

                {/* User buttons */}
                <div className="flex gap-1">
                  {/* Billing */}
                  <button
                    onClick={() => setShowBilling(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/[0.08] hover:text-slate-400 transition-all duration-150"
                  >
                    <Coins size={16} />
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 h-8 px-2 rounded-[7px] border border-white/[0.08] bg-transparent text-slate-400 cursor-pointer hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
                    onClick={handleLogout}
                    aria-label="Sign out"
                  >
                    <LogOut size={16} />
                    <span className="text-[11px] font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl py-[11px] cursor-pointer hover:bg-white/[0.08] transition-colors duration-150">
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Billing Drawer */}
      <BillingDrawer open={showBilling} onClose={() => setShowBilling(false)} />
    </>
  );
}

export default SideBar;
