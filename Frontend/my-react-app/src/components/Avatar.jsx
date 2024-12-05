import { Link } from "react-router-dom";

export default function Avatar() {
  return (
    <div className="flex items-center justify-start col-span-1">
      <Link to={"/"}>
        <div className="items-center justify-center text-3xl font-bold opacity-50 hover:opacity-90">
          PP
        </div>

      </Link>
    </div>
  );
}