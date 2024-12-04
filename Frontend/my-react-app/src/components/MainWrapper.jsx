import React from "react";

export default function MainWrapper({ children }) {
  return (
    <main className="duration-1000 w-full translate-y-20 mt-20 mb-20 min-h-[calc(100vh-350px)]">
      {children}
    </main>
  );
}
