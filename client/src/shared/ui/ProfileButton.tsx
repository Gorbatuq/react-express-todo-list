import { PiFinnTheHumanLight } from "react-icons/pi"
import { Link } from "react-router-dom"

export const ProfileButton = () => {
    return (
        <Link to="/profile" >
            <div className="flex items-center text-5xl">
                <PiFinnTheHumanLight className="p-1 hover:bg-zinc-50 border-2 bg-white dark:bg-slate-800 dark:text-gray-200 border-slate-300 dark:border-slate-600 dark:hover:bg-slate-700  rounded-full" />
            </div>
      </Link>
    )
}
