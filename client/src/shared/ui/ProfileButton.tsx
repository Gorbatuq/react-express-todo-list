import { PiFinnTheHumanLight } from "react-icons/pi"
import { Link } from "react-router-dom"

export const ProfileButton = () => {
    return (
        <Link to="/profile" >
            <div className="flex items-center text-5xl">
                <PiFinnTheHumanLight className="p-1 hover:bg-slate-100 border-2 bg-slate-50 dark:bg-gray-700 dark:text-gray-200 border-slate-300 dark:border-slate-600  rounded-full" />
            </div>
      </Link>
    )
}

