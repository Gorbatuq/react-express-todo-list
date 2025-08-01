export const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center text-3xl">
            👤
          </div>
          <h2 className="text-xl font-semibold text-slate-800">User name</h2>
          <p className="text-sm text-slate-500">user@example.com</p>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-600">Registration date:</span>
            <span className="font-medium text-slate-800">01.01.2023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Number of task:</span>
            <span className="font-medium text-slate-800">12</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
            Logout
          </button>
          <button className="bg-slate-200 hover:bg-slate-600 text-black px-4 py-2 rounded-lg transition">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
