import React, { useState } from "react"
import { formatNumber } from "@/lib/util/DraftUtil"


const tableHeaders = ["CMP", "PE", "EPS", "Mar.Cap(Cr)", "PAT(Cr)", "Div. Yield(%)", "Sales Qtr(Cr)", "Debt(Cr)"]
const apiFields = ['cmp_rs', "pe", "eps_12m_rs", 'mar_cap_rs_cr', "pat_12m_rs_cr", "div_yld_percent", "sales_qtr_rs_cr", "debt_rs_cr"]

interface PeersTableProp {
  data: any
}

const PeersTable = ({ data }: PeersTableProp) => {
  const [sortCol, setSortCol] = useState({ col: 0, order: 1 })

  let tableFormatData = data;

  let demoData = data?.map((item) => ({
    [item.name]: apiFields.reduce((acc, field, colIndex) => {
      acc[tableHeaders[colIndex]] = item[field];
      return acc;
    }, {})
  }))

  const columnData = demoData?.map((row, index) => {
    const peerName = Object.keys(row)[0]
    const peerData = row[peerName]
    const keys = Object.keys(peerData)
    return ({
      row: row,
      value: peerData[keys[sortCol.col]]
    })
  }
  );

  columnData.sort((a, b) => (a.value - b.value) * sortCol.order);

  tableFormatData = columnData.map(item => item.row);   
  return (
    <div className="max-h-full w-full py-2 ">
      <div className="overflow-auto scrollbar-thin">
        <table className="text-[0.85rem] text-center min-w-full border-collapse max-sm:text-[0.65rem] table-fixed">
          <thead className="z-9 sticky left-0 top-0 ">
            <tr className="border-b-2 text-left text-z-gray-300">
              <th className="sticky left-0 p-2 bg-white">Name</th>
              {tableHeaders?.map((item, index) =>
                <th key={index} className="p-2 text-left bg-white">
                  <button className={`text-nowrap`}
                    onClick={() => {
                      setSortCol((prev) => {
                        if (prev.order === 1) {
                          return { col: index, order: -1 }
                        } else {
                          return { col: index, order: 1 }
                        }
                      }
                      )
                    }
                    }>
                    {item}
                    {sortCol.col === index && <span className={`px-0.5 ${sortCol.order === 1 ? 'text-green-500' : 'text-red-400'}`}>
                      {sortCol.order === 1 ? '↑' : '↓'}
                    </span>}
                  </button>


                </th>
              )}
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {tableFormatData && tableFormatData?.map((row, index) => {
              const key = Object.keys(row)[0]
              const values = row[key]
              const rowValues = Object.values(values)
              return (
                  <tr key={index} className={`${index % 2 == 0 ? "bg-white" : "bg-gray-100"} p-2 text-left`}>
                    <td className={` ${index % 2 == 0 ? "bg-white" : "bg-gray-100"} text-left p-2 sticky left-0 z-1 font-medium `}>
                      {key}
                    </td>
                    {rowValues.map((value, rowIndex) => {
                      if (value === null || value === undefined) {
                        return <td key={`${index}-${rowIndex}`} className="p-2 text-left">-</td>
                      }
                      return (
                        <td key={`${index}-${rowIndex}`} className="p-2 text-left">{formatNumber(value)}</td>
                      )
                    })}
                  </tr>
              )
            })}

          </tbody>
        </table>
      </div>
    </div>
  )
}
PeersTable.displayName = "PeersTable"
export default React.memo(PeersTable);