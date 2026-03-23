import { formatNumber } from "@/lib/util/DraftUtil";


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const ResultsTable = ({
  data,
  field,
}: {
  data: Record<string, Record<string, any>>;
  field: string;
}) => {
  const dates = Object.keys(data);
  const rowNames = Array.from(
    new Set(dates?.flatMap((date) => Object.keys(data[date])))
  );

  return (
    <div className="max-h-full w-full">
      <div className="text-lg font-semibold">{field}</div>
      <div className="max-h-[95%] overflow-auto  scrollbar-thin ">
        <table className="min-w-full border-collapse text-sm">
          {/* Table Header */}
          <thead className="sticky top-0 z-10 ">
            <tr>
              <th className="border-b bg-white p-2 text-left"></th>
              {dates?.map((date) => (
                <th key={date} className="border-b bg-white p-2">
                  {formatDate(date)}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-800">
            {rowNames?.map((rowName) => (
              <tr key={rowName} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{rowName}</td>
                {dates.map((date) => (
                  <td key={date} className="p-2">
                    {data[date][rowName] == null ||
                    data[date][rowName] == undefined
                      ? "-"
                      : formatNumber(data[date][rowName])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
