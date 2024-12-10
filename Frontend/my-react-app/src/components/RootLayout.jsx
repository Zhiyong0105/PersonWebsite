import Footer from "./Footer"
import Header from "./Header"
import MainWrapper from "./MainWrapper"


export default function RootLayout({ children }) {

    return (
        <div className="flex flex-col items-center justify-between px-4 pt-10 mx-auto min-h-screen max-w-screen-lg sm:px-6 md:px-12 lg:max-w-screen-xl lg:px-20">
            <Header />
            <MainWrapper>{children}</MainWrapper>
            <Footer />
        </div>
    )

}