interface TopProductsProps {
  products: any[];
}

export default function TopProducts({
  products,
}: TopProductsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Top Selling Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Best performing products
          </p>
        </div>

        <button className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100">
          View All
        </button>

      </div>

      {/* Products */}
      <div className="space-y-3">

        {products.map((product: any, index: number) => (

          <div
            key={product._id}
            className="group flex items-center justify-between rounded-2xl border border-transparent p-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
          >

            <div className="flex min-w-0 items-center gap-4">

              {/* Ranking */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">
                {index + 1}
              </div>

              {/* Product Image */}
              <img
                src={
                  product.image ||
                  "/placeholder.png"
                }
                alt={product.name}
                className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-105"
              />

              {/* Product Information */}
              <div className="min-w-0">

                <p className="truncate font-semibold text-slate-800">
                  {product.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {product.sold} sold
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}