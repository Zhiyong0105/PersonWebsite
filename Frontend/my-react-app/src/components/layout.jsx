import React from "react";
import Header from "./Header";
import MainWrapper from "./MainWrapper";
import Footer from "./Footer";

export default function RootLayout({ children }) {
  return (
    
          <div className="flex flex-col items-center px-4 pt-10 mx-auto max-w-4xl lg:max-w-5xl sm:px-12 md:px-20 lg:px-12 xl:max-w-7xl min-h-svh">
            <Header />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
          </div>
    
  );
}
