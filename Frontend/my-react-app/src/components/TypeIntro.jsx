import { TypeAnimation } from 'react-type-animation';

export default function TypeIntro() {
  return (
    <div className="h-[3rem] md:h-[4rem] flex items-center justify-center">
      <TypeAnimation
        sequence={[
          "A BackEnd <Developer /> .",
          2000,
          'A Full Stack Developer',
          2000,
        ]}
        wrapper="span"
        speed={50}
        className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent 
                  bg-gradient-to-r from-primary to-secondary"
        repeat={Infinity}
        cursor={true}
        style={{
          display: 'inline-block',
          minWidth: '20rem',
        }}
      />
    </div>
  );
}