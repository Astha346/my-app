interface ViewOrderModalProps {
  order: any | null;
  setSelectedOrder: (order: any) => void;
}

export default function ViewOrderModal({
  order,
  setSelectedOrder,
}: ViewOrderModalProps) {

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View information about this order
            </p>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>

        </div>

        {/* Content */}
        <div className="space-y-4 p-6">

          {/* Order ID */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Order ID
            </p>

            <p className="mt-1 break-all font-semibold text-slate-800">
              #{order._id}
            </p>

          </div>

          {/* Customer */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {order.customerName}
              </p>

            </div>

            {/* Total */}
            <div className="rounded-2xl border border-slate-100 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                Rs {order.total}
              </p>

            </div>

          </div>

          {/* Status */}
          <div className="rounded-2xl border border-slate-100 p-4">

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status
            </p>

            <div className="mt-2">

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold
                ${
                  order.status === "Pending"
                    ? "bg-yellow-50 text-yellow-700"
                    : order.status === "Processing"
                    ? "bg-blue-50 text-blue-700"
                    : order.status === "Completed"
                    ? "bg-green-50 text-green-700"
                    : order.status === "Cancelled"
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >

                <span
                  className={`h-2 w-2 rounded-full
                  ${
                    order.status === "Pending"
                      ? "bg-yellow-500"
                      : order.status === "Processing"
                      ? "bg-blue-500"
                      : order.status === "Completed"
                      ? "bg-green-500"
                      : order.status === "Cancelled"
                      ? "bg-red-500"
                      : "bg-slate-400"
                  }`}
                />

                {order.status}

              </span>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 px-6 py-4">

          <button
            onClick={() => setSelectedOrder(null)}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}