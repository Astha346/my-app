export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">

      <div className="bg-gray-200 p-6 rounded-xl">
        <h3 className="font-bold">Laptops</h3>
        <p>Min. 40% Off</p>
      </div>

      <div className="bg-gray-200 p-6 rounded-xl">
        <h3 className="font-bold">Beauty</h3>
        <p>Up to 25% Off</p>
      </div>

      <div className="bg-gray-200 p-6 rounded-xl">
        <h3 className="font-bold">Fruits</h3>
        <p>Min. 65% Off</p>
      </div>

    </div>
  );
}