import axios from "axios";

interface RecentOrdersProps {
  orders: any[];
  setSelectedOrder: (order: any) => void;
  setDeleteOrder: (order: any) => void;
  setOrders: (orders: any[]) => void;
}

export default function RecentOrders({
  orders,
  setSelectedOrder,
  setDeleteOrder,
}: RecentOrdersProps) {

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">

      <div className="flex justify-between mb-6">
        <h2 className="font-bold text-xl">
          Recent Orders
        </h2>

        <button className="text-indigo-600">
          View All
        </button>
      </div>


      <table className="w-full">

        <thead>
          <tr className="text-gray-500 border-b">

            <th className="pb-4 text-left">
              Order
            </th>

            <th className="pb-4 text-left">
              Customer
            </th>

            <th className="pb-4 text-left">
              Amount
            </th>

            <th className="pb-4 text-left">
              Status
            </th>

            <th className="pb-4 text-left">
              Actions
            </th>

          </tr>
        </thead>


        <tbody>

        {orders.map((order:any)=>(

          <tr
            key={order._id}
            className="border-b"
          >

            <td className="py-5">
              #{order._id.slice(-6)}
            </td>


            <td>
              {order.customerName}
            </td>


            <td>
              Rs {order.total.toFixed(2)}
            </td>


            <td>

              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm
                ${
                  order.status==="Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status==="Processing"
                  ? "bg-blue-100 text-blue-700"
                  : order.status==="Completed"
                  ? "bg-green-100 text-green-700"
                  : order.status==="Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
                }`}
              >

                <span
                  className={`w-2.5 h-2.5 rounded-full
                  ${
                    order.status==="Pending"
                    ? "bg-yellow-500"
                    : order.status==="Processing"
                    ? "bg-blue-500"
                    : order.status==="Completed"
                    ? "bg-green-500"
                    : order.status==="Cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                  }`}
                />

                {order.status}

              </span>

            </td>


            <td className="space-x-3">


              <button
                className="text-blue-600"
                onClick={() =>
                  setSelectedOrder(order)
                }
              >
                View
              </button>



              <button
                className="text-green-600"
                onClick={async()=>{

                  const status = prompt(
                    "Enter status:\nPending\nProcessing\nCompleted\nCancelled"
                  );


                  if(!status) return;


                  await axios.patch(
                    `http://localhost:3001/orders/${order._id}/status`,
                    {
                      status
                    }
                  );


                  window.location.reload();

                }}
              >
                Edit
              </button>



              <button
                className="text-red-600"
                onClick={() =>
                  setDeleteOrder(order)
                }
              >
                Delete
              </button>


            </td>


          </tr>

        ))}

        </tbody>

      </table>

    </div>
  );
}