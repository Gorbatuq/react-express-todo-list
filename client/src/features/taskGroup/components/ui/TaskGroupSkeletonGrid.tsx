export const TaskGroupSkeletonGrid = () => (
  // Creating a similar structure while waiting for loading
  <div className="mt-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
      {/* Create 6 Group Cards */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-72 rounded-xl shadow-lg bg-white p-4 animate-pulse space-y-4"
        >
          <div className="h-5 w-1/2 bg-gray-300 rounded" />

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-200 rounded px-2 py-2">
              <div className="h-4 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-4 bg-gray-400 rounded-full" />
            </div>
            <div className="flex items-center justify-between bg-gray-200 rounded px-2 py-2">
              <div className="h-4 w-2/3 bg-gray-300 rounded" />
              <div className="h-4 w-4 bg-gray-200 rounded-full" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="h-9 w-full bg-gray-100 rounded" />
            <div className="h-9 w-9 bg-gray-300 rounded" />
          </div>

          <div className="flex justify-between mt-2">
            <div className="h-6 w-14 bg-gray-100 rounded" />
            <div className="h-6 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-14 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
