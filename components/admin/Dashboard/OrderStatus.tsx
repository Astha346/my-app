"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";


interface Props {
  statusData:any[];
}


export default function OrderStatus({
  statusData,
}:Props){

  const COLORS = [
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#F59E0B",
  ];


  return (
    <div className="bg-white rounded-3xl p-6 shadow">

      <h2 className="font-bold text-xl mb-5">
        Order Status
      </h2>


      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={statusData}
              dataKey="count"
              nameKey="id"
              outerRadius={110}
              label
            >

              {statusData.map(
                (_:any,index:number)=>(
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}