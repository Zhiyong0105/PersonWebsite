// export default function User(){
//     return (
//     <button className="btn btn-circle">
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="h-6 w-6"
//         fill="none"
//         viewBox="0 0 24 24"
//         stroke="currentColor">
//         <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth="2"
//         d="M6 18L18 6M6 6l12 12" />
//     </svg>
//     </button>
//     )
// }
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function AddUserButton() {
  return (
    <button className="btn btn-square">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12" />
    </svg>
    </button>
  );
}
