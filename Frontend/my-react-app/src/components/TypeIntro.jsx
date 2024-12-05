import { TypeAnimation} from "react-type-animation"

export default function TypeIntro(){
    return (
        <TypeAnimation
        className="text-2xl tracking-widest md:text-5xl"
        sequence={[
            500,
            "一名后端开发工程师。",
            1000,
            "A BackEnd <Developer /> .",
            1000,
        ]}
        speed={10}
        repeat={Infinity}
        >

        </TypeAnimation>
    )
}