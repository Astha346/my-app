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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-125 shadow-lg">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <button
            onClick={() => setSelectedOrder(null)}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>

        </div>


        <div className="space-y-3">

          <p>
            <strong>Order ID:</strong>{" "}
            {order._id}
          </p>

          <p>
            <strong>Customer:</strong>{" "}
            {order.customerName}
          </p>

          <p>
            <strong>Total:</strong>{" "}
            Rs {order.total}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {order.status}
          </p>

        </div>

      </div>

    </div>
  );
}