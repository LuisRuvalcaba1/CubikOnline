//import { Dialog, DialogContent } from "@headlessui/react";
//import { TrophyIcon } from "@heroicons/react/24/solid";
//import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function WinModal() {
  const navigate = useNavigate();
  const handleContinue = () => {
    navigate("/");
  };
  return (
      <div className="fixed inset-0 bg-gray-950 text-gray-50 rounded-2xl bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="bg-gradient-to-r from-[#00b894] to-[#55efc4] rounded-full p-4">
            <TrophyIcon className="h-12 w-12" />
          </div>
          <div className="text-2xl font-bold">You Won the Tournament!</div>
          <div className="text-sm text-gray-400">
            Felicidades! Has ganado el torneo. Continua tu travecia en el siguiente torneo.
          </div>
          <div>
            <button
              onClick={handleContinue}
              className="w-full"
            >
              Continue to Next Round
            </button>
          </div>
        </div>
      </div>
  );
}

function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
     <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
