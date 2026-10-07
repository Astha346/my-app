interface DeleteOrderModalProps {
  order: any;
  setDeleteOrder: (order: any) => void;
  deleteHandler: () => void;
}

export default function DeleteOrderModal({
  order,
  setDeleteOrder,
  deleteHandler,
}: DeleteOrderModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl">

        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
            !
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-slate-900">
          Delete Order
        </h2>

        <p className="mt-3 leading-6 text-slate-500">
          Are you sure you want to delete this order?
          This action cannot be undone.
        </p>

        {/* Order information */}
        {order && (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50/60 p-4">

            <p className="text-sm text-slate-500">
              Order
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              #{order._id?.slice(-6)}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {order.customerName}
            </p>

          </div>
        )}

        {/* Buttons */}
        <div className="mt-7 flex justify-end gap-3">

          <button
            onClick={() => setDeleteOrder(null)}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={deleteHandler}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
          >
            Delete Order
          </button>

        </div>

      </div>

    </div>
  );
}