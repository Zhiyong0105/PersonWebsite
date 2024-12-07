import { Link } from "react-router-dom";

export default function Avatar({page}) {
  return (
    <div className="flex items-center justify-start col-span-1">
    <Link to={"/"}>
      <div className={`duration-1000 rounded-full opacity-60 hover:opacity-90 ${page == "/" ? " translate-y-20 scale-150" : ""}`}>
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span className="text-xs">PP</span>
          </div>
        </div>
      </div>
    </Link>

    </div>
  );
}