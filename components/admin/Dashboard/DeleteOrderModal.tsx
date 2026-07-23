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

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


      <div className="bg-white rounded-2xl w-105 p-6 shadow-lg">


        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Delete Order
        </h2>



        <p className="text-gray-600 mb-6">

          Are you sure you want to delete this order?
          This action cannot be undone.

        </p>



        <div className="flex justify-end gap-3">


          <button

            onClick={() => setDeleteOrder(null)}

            className="px-5 py-2 border rounded-lg hover:bg-gray-100"

          >
            Cancel

          </button>



          <button

            onClick={deleteHandler}

            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"

          >
            Delete

          </button>



        </div>


      </div>


    </div>

  );
}