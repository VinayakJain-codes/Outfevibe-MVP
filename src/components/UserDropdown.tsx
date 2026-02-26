"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDropdownProps {
    user: User;
    logout: () => Promise<void>;
}

export default function UserDropdown({ user, logout }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Get display name from user metadata
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || "User";
    const photoURL = user.user_metadata?.avatar_url || null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white/90 transition border border-slate-200 hover:border-purple-300 shadow-sm"
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={photoURL || ""} alt={displayName} />
                    <AvatarFallback className="text-sm bg-purple-100 text-purple-600">
                        {getInitials(displayName)}
                    </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium text-slate-700 hidden md:block">{displayName}</span>

                <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden z-50"
                    >
                        {/* USER INFO */}
                        <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-12 w-12 border-2 border-purple-200">
                                    <AvatarImage src={photoURL || ""} alt={displayName} />
                                    <AvatarFallback className="text-lg bg-purple-100 text-purple-600">
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{displayName}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTIONS */}
                        <div className="p-2 space-y-1">

                            <Link
                                href="/profile"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-all group"
                            >
                                <UserIcon className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                                <span>My Profile</span>
                            </Link>

                            <div className="my-1 h-px bg-slate-100 mx-2" />

                            <button
                                onClick={async () => {
                                    await logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-all group"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
