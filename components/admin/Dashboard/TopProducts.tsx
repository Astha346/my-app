interface TopProductsProps {
  products: any[];
}

export default function TopProducts({
  products,
}: TopProductsProps) {

  return (
    <div className="bg-white rounded-3xl p-6 shadow">

      <div className="flex justify-between mb-5">

        <h2 className="font-bold text-xl">
          Top Selling Products
        </h2>

        <button className="text-indigo-600">
          View All
        </button>

      </div>


      <div className="space-y-5">

        {products.map((product: any) => (

          <div
            key={product._id}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-4">

              <img
                src={
                  product.image ||
                  "/placeholder.png"
                }
                className="w-14 h-14 rounded-xl object-cover"
              />


              <div>

                <p className="font-medium">
                  {product.name}
                </p>


                <p className="text-sm text-gray-500">
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