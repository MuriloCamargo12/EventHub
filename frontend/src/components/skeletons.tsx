export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-stone-200 ${className}`} />;
}

export function EventListSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Carregando eventos</span>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-10 w-72 max-w-full" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />
      <Skeleton className="mt-8 h-28 w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    </div>
  );
}

export function EventDetailSkeleton() {
  return (
    <div aria-busy="true" className="max-w-2xl">
      <span className="sr-only">Carregando evento</span>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-8 h-4 w-24" />
      <Skeleton className="mt-3 h-10 w-full" />
      <Skeleton className="mt-5 h-5 w-64" />
      <Skeleton className="mt-2 h-5 w-48" />
      <Skeleton className="mt-6 h-24 w-full" />
      <Skeleton className="mt-6 h-5 w-56" />
      <div className="mt-8 flex gap-3">
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function EventFormSkeleton() {
  return (
    <div aria-busy="true" className="max-w-xl">
      <span className="sr-only">Carregando formulário</span>
      <Skeleton className="h-4 w-36" />
      <Skeleton className="mt-6 h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-80 max-w-full" />
      <div className="mt-8 grid gap-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-28" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
    </div>
  );
}

export function ReservationListSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Carregando reservas</span>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-3 h-5 w-56" />
      <div className="mt-8 grid gap-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    </div>
  );
}

export function ParticipantListSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Carregando participantes</span>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-9 w-56" />
      <Skeleton className="mt-3 h-5 w-48" />
      <div className="mt-8 grid gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}
