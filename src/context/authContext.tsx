"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    email: string;
    created_at?: string;
    user_metadata: {
        display_name?: string;
        full_name?: string;
        name?: string;
        avatar_url?: string;
    };
}

export interface Session {
    user: User;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, displayName: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock get initial session from localStorage
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setSession({ user: parsedUser });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Mock login
        const mockUser: User = {
            id: "mock-id-" + Date.now(),
            email: email,
            created_at: new Date().toISOString(),
            user_metadata: {
                display_name: email.split("@")[0],
            },
        };
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
    };

    const signup = async (email: string, password: string, displayName: string) => {
        // Mock signup
        const mockUser: User = {
            id: "mock-id-" + Date.now(),
            email: email,
            created_at: new Date().toISOString(),
            user_metadata: {
                display_name: displayName,
            },
        };
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
    };

    const loginWithGoogle = async () => {
        // Mock Google login
        const mockUser: User = {
            id: "mock-google-id-" + Date.now(),
            email: "google.user@example.com",
            created_at: new Date().toISOString(),
            user_metadata: {
                display_name: "Google User",
            },
        };
        localStorage.setItem("auth_user", JSON.stringify(mockUser));
        setUser(mockUser);
        setSession({ user: mockUser });
    };

    const logout = async () => {
        localStorage.removeItem("auth_user");
        setUser(null);
        setSession(null);
        // Force a hard redirect to clear all state properly
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, login, signup, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
