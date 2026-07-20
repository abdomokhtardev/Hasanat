const Skeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-[var(--border-subtle)] rounded-xl ${className}`}></div>
  );
};

export const LessonCardSkeleton = () => (
  <div className="card-glass w-full rounded-2xl overflow-hidden p-0 h-[300px] flex flex-col">
    <Skeleton className="h-48 w-full rounded-b-none" />
    <div className="p-4 flex flex-col gap-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between mt-auto">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

export default Skeleton;
