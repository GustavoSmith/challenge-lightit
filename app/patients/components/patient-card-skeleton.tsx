export function PatientCardSkeleton() {
  return (
    <div className="bg-grey-700/50 relative overflow-hidden rounded-3xl border-2 border-transparent p-6 pl-8 shadow-md">
      {/* Barra lateral de acento (simulada en gris oscuro) */}
      <div className="bg-grey-700 absolute top-0 -left-[2px] h-full w-1.5" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-4">
          {/* Avatar Skeleton */}
          <div className="relative h-16 w-16 flex-shrink-0">
            <div className="bg-grey-700 h-full w-full animate-pulse rounded-2xl" />
          </div>

          {/* Info Principal Skeleton */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
            {/* Nombre */}
            <div className="bg-grey-700 h-6 w-3/4 animate-pulse rounded" />
            {/* Email */}
            <div className="bg-grey-700/50 h-4 w-1/2 animate-pulse rounded" />
            {/* ID */}
            <div className="bg-grey-800 mt-1 h-3 w-1/3 animate-pulse rounded" />
          </div>
        </div>

        {/* Acciones Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="bg-grey-700 h-9 w-9 animate-pulse rounded-xl" />
          <div className="bg-grey-700 h-9 w-9 animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
