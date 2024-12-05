export default function Hero() {
    return (
    <div>
        <p className="mb-6 font-semibold">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent lg:text-[54px] text-[40px]">
            Hi, I&apos;m PP
        </span>
        </p>
      <div className="h-10 mb-8 sm:mb-10">
        {/* <HeroAnimation text1={"<Developer />"} text2="<Student />" /> */}
      </div>
      <p className="mb-8 text-xl text-transparent sm:mb-10 sm:text-[26px] bg-gradient-to-r from-green-200 via-green-100 opacity-60 to-green-200 bg-clip-text w-fit">
        #Abstract #P #Zhiyong
      </p>

      <p className="mb-4 text-sm text-transparent sm:mb-6 sm:text-base bg-gradient-to-b to-muted-foreground from-foreground bg-clip-text">
        I&apos;m an undergraduate student at UEC
        majoring in Computer Science. Passionate about developing applications
        that merge purpose with aesthetics.
      </p>

      {/* <Socials /> */}
    </div>
    )
}