"use client";

import type { ReactNode } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}
