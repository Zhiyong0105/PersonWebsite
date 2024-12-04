import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const navigationItems = [
  { name: "Home", href: "/home" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

function Navbar({ page }) {
  return (
    <div className="justify-center col-span-2 mt-0.5 sm:flex h-14">
      <ul className="items-center justify-center bg-[#f2f2f21a] rounded-full sm:flex px-2 py-1">
        {navigationItems.map((item) => {
          const isSelected = page === item.href;
          return (
            <motion.li key={item.name} className="relative">
              {isSelected && (
                <>
                  <motion.div
                    className="absolute left-1/4 w-1/2 mx-auto border-t-[3px] rounded-full shadow-[0_20px_100px_8px_#fff]"
                    layoutId="selected"
                  ></motion.div>
                  <motion.div
                    className="absolute top-0.5 bottom-0.5 w-full bg-[#f2f2f20d] rounded-full"
                    layoutId="selecteddiv"
                  ></motion.div>
                </>
              )}
              <Link to={item.href}>
                <motion.div
                  whileHover={{
                    backgroundColor: "#f2f2f20d",
                  }}
                  className={`px-4 py-3 rounded-full ${
                    ["Home", "Blog", "About"].includes(item.name) ? "tracking-widest" : "tracking-tight"
                  } font-bold text-sm`}
                >
                  {item.name}
                </motion.div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}


export default Navbar;
