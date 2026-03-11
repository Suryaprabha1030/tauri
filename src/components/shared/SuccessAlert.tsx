const SuccessAlert = (props: { message: string }) => {
  return (
    <div className="flex w-full flex-row rounded border-l-4 border-green-600">
      <div
        className="flex w-full flex-row items-center justify-between  border-rose-200 bg-green-50 px-2 py-2 text-green-700"
        role="alert"
      >
        <span className="block sm:inline">{props.message}</span>
      </div>
    </div>
  );
};

export default SuccessAlert;
