export default function SkeletonCard() {
  return (
    <div className="card bg-base-100 border border-base-300 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-base-200 aspect-square"></div>
      <div className="card-body p-4 space-y-3">
        <div className="bg-base-200 h-6 rounded"></div>
        <div className="bg-base-200 h-8 w-1/2 rounded"></div>
        <div className="flex justify-end gap-2 mt-3">
          <div className="bg-base-200 h-8 w-16 rounded"></div>
          <div className="bg-base-200 h-8 w-16 rounded"></div>
        </div>
      </div>
    </div>
  );
}