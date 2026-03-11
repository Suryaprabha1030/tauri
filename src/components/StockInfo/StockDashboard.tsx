const StockDashboard = ({ name, value }) => {
    return (
        <div className={`flex relative flex-col rounded-md border bg-white gap-2 p-2 m-0.5`}>
            <h2 className="max-sm:text-xs flex justify-center text-sm">{name}</h2>
            <span className="font-semibold text-xl max-sm:text-base flex justify-center">{value}</span>
        </div>
    )
}
export default StockDashboard