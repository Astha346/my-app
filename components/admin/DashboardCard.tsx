type props = {
    title: string;
    value: string;
}

export default function DashboardCard({title,value}:props) {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-gray-500">
              {title}
            </h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
           
        </div>
    )
}