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
      className="group mb-6 sm:mb-10 last:mb-0 w-full"
    >
      <section className="bg-gray-100 w-full border border-black/5 rounded-lg overflow-hidden relative flex flex-col sm:flex-row sm:h-auto transition sm:group-even:flex-row-reverse">
        {/* 左侧内容 */}
        <div className="p-6 sm:p-10 flex flex-col justify-between sm:w-1/2">
          <div>
            <h3 className="text-2xl font-semibold group-hover:text-pink dark:group-hover:text-yellow hover:underline mb-4">
              <Link to={demoUrl || "/"} target="_blank">
                {title}
              </Link>
            </h3>
            <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-300 mb-4">
              <Link
                to={projectUrl || "/"}
                target="_blank"
                className="flex items-center gap-1 hover:underline"
              >
                <span>Code</span>
                <FaGithubSquare className="w-5 h-5" />
              </Link>
              {demoUrl && (
                <Link
                  to={demoUrl}
                  target="_blank"
                  className="flex items-center gap-1 hover:underline"
                >
                  <span>Live Demo</span>
                  <FiExternalLink className="w-5 h-5" />
                </Link>
              )}
            </div>
            <p className="text-gray-700 dark:text-white/70 mb-4">
              {description || "No description available."}
            </p>
          </div>
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 右侧图片 */}
        <div className="relative sm:w-1/2 flex justify-center items-center">
          <img
            src={imageUrl}
            alt={`Image for ${title}`}
            className="w-full h-full object-cover rounded-r-lg shadow-lg transition group-hover:scale-[1.04] group-hover:-translate-x-3 group-hover:translate-y-3 group-hover:-rotate-2"
          />
        </div>
      </section>
    </motion.div>
  );
}
