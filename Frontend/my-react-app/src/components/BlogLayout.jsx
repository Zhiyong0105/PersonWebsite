import BlogHeader from "./BlogHeader";
import MainWrapper from "./MainWrapper"
import Footer from "./Footer"
export default function BlogLayout({children}){

    return (
        <div
            className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-4xl xl:px-0"
        >
            <BlogHeader />
            <MainWrapper>{children}</MainWrapper>
            <Footer />

        </div>
    )
}