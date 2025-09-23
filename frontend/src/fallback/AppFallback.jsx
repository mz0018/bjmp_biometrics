const AppFallback = () => {
  return (
    <section className="relative z-10 max-w-2xl text-center text-white">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        {/* Logo */}
        <div className="w-16 h-16 bg-gray-400 rounded-full" />

        {/* Title */}
        <div className="h-6 w-2/3 bg-gray-500 rounded" />
        <div className="h-6 w-1/2 bg-gray-500 rounded" />

        {/* Description */}
        <div className="h-4 w-3/4 bg-gray-600 rounded mt-4" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 w-full">
          <div className="h-10 w-48 bg-gray-600 rounded-2xl" />
          <div className="h-10 w-48 bg-gray-600 rounded-2xl" />
        </div>

        {/* Footer */}
        <div className="h-4 w-2/3 bg-gray-700 rounded mt-8" />
      </div>
    </section>
  );
};

export default AppFallback;
