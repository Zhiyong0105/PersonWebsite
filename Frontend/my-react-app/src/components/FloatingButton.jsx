import { IoArrowUp } from "react-icons/io5";

export default function FloatingButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      onClick={scrollToTop}
      className="w-8 h-8 flex items-center justify-center text-base-content/70 
                hover:text-primary transition-colors cursor-pointer"
    >
      <IoArrowUp className="w-5 h-5" />
    </div>
  );
}