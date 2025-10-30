
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lavender-100 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-dark-primary">
        {children}
      </div>
    </main>
  );
}
