import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithubSquare } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Project({
  title,
  description,
  tags,
  imageUrl,
  projectUrl,
  demoUrl,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="group mb-6 sm:mb-10 last:mb-0 max-w-5xl mx-auto"
    >
      <section className="bg-base-200 border border-base-300 rounded-lg overflow-hidden 
                         relative flex flex-col sm:flex-row sm:h-[400px] transition 
                         sm:group-even:flex-row-reverse hover:shadow-xl">
        {/* 左侧内容 */}
        <div className="p-6 sm:p-10 flex flex-col justify-between sm:w-1/2 relative z-10">
          <div>
            <h3 className="text-2xl font-semibold text-base-content 
                         group-hover:text-primary transition-colors duration-300 
                         hover:underline mb-4">
              <Link to={demoUrl || "/"} target="_blank">
                {title}
              </Link>
            </h3>
            <div className="flex gap-3 text-sm text-base-content/70 mb-4">
              <Link
                to={projectUrl || "/"}
                target="_blank"
                className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
              >
                <span>Code</span>
                <FaGithubSquare className="w-5 h-5" />
              </Link>
              {demoUrl && (
                <Link
                  to={demoUrl}
                  target="_blank"
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                >
                  <span>Live Demo</span>
                  <FiExternalLink className="w-5 h-5" />
                </Link>
              )}
            </div>
            <p className="text-base-content/80 mb-4 leading-relaxed">
              {description || "No description available."}
            </p>
          </div>
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-base-300 px-3 py-1 text-[0.7rem] uppercase 
                           tracking-wider text-base-content/90 rounded-full"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 右侧图片容器 */}
        <div className="relative sm:w-1/2 h-[200px] sm:h-full overflow-hidden">
          {/* 图片遮罩渐变 */}
          <div className="absolute inset-0 bg-gradient-to-r from-base-200 
                         via-transparent to-transparent sm:group-even:from-transparent 
                         sm:group-even:via-transparent sm:group-even:to-base-200 
                         z-[1] pointer-events-none" />
          
          {/* 图片 */}
          <img
            src={imageUrl}
            alt={`Project ${title}`}
            className="w-full h-full object-cover object-left-top 
                     transition-transform duration-500 ease-out
                     group-hover:scale-110"
          />
        </div>
      </section>
    </motion.div>
  );
}
