const ErrorAlert = (props: { errorMessage: string }) => {
  return (
    <div className="flex w-full flex-row rounded border-l-4 border-red-600">
      <div
        className="flex w-full flex-row items-center justify-between  border-rose-200 bg-red-50 px-2 py-2 text-red-700"
        role="alert"
      >
        <span className="block sm:inline">{props.errorMessage}</span>
      </div>
    </div>
  );
};

export default ErrorAlert;
