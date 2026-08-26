export const ProductCardSkeleton = () => (
  <div className="flex flex-col">
    <div className="skeleton aspect-[4/5] rounded-2xl w-full" />
    <div className="skeleton h-4 w-3/4 rounded mt-4" />
    <div className="skeleton h-4 w-1/3 rounded mt-2" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-10">
    <div className="skeleton aspect-square rounded-3xl w-full" />
    <div className="space-y-4">
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-8 w-3/4 rounded" />
      <div className="skeleton h-6 w-1/3 rounded" />
      <div className="skeleton h-24 w-full rounded" />
      <div className="skeleton h-12 w-1/2 rounded-full" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-3 px-4">
        <div className="skeleton h-4 w-full rounded" />
      </td>
    ))}
  </tr>
);

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-sage/30 border-t-sage rounded-full animate-spin" />
      <p className="text-sm text-ink/50 tracking-wide">Loading…</p>
    </div>
  </div>
);
