"use client";

import { Suspense } from "react";
import LoginInner from "./login-inner";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
