interface DocumentProps {
  data: any;
}

const DocumentSection = ({ data }: DocumentProps) => {
  const presentationData = data?.presentation;
  const transcriptData = data?.transcript;
  return (
    <>
      {data && Object.keys(data)?.length > 0 ? (
        <div className="flex flex-col justify-center w-full ">
          <h1 className="font-semibold text-lg max-md:text-sm p-1">
            Documents
          </h1>
          <>
            {presentationData && presentationData?.length > 0 && (
              <>
                <h1 className="font-semibold text-base max-md:text-xs p-1">
                  Presentations
                </h1>
                <div className="p-1 gap-2 grid grid-cols-3  max-sm:grid-cols-2 grid-flow-row">
                  {presentationData?.map(({ link, subject }, index: number) => (
                    <div
                      key={index}
                      className="flex p-1 rounded-md bg-white hover:bg-gray-100 border h-[50px] hover:cursor-pointer"
                    >
                      <a
                        key={`${link}-${index}`}
                        href={link}
                        target="_blank"
                        className="text-base flex flex-row min-w-0 w-full"
                      >
                        <div className="rounded-none flex items-center w-[50px]">
                          <img
                            src="/svg/slides.svg"
                            alt=""
                            width={40}
                            height={20}
                            className=" px-1"
                          />
                        </div>
                        <div className="w-full px-1 flex items-center">
                          <p className="max-md:text-xs text-sm text-wrap">
                            {subject}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
            {transcriptData && transcriptData?.length > 0 && (
              <>
                <h1 className="font-semibold text-base max-md:text-xs p-1">
                  Transcripts
                </h1>
                <div className="p-1 gap-2 grid grid-cols-3  max-sm:grid-cols-2 grid-flow-row">
                  {transcriptData?.map(({ link, subject }, index: number) => (
                    <div
                      key={index}
                      className="flex p-1 rounded-md bg-white hover:bg-gray-100 border h-[50px] hover:cursor-pointer"
                    >
                      <a
                        key={`${link}-${index}`}
                        href={link}
                        target="_blank"
                        className="text-base flex flex-row min-w-0 w-full"
                      >
                        <div className="rounded-none flex items-center w-[50px] ">
                          <img
                            src="/svg/file.svg"
                            alt=""
                            width={40}
                            height={20}
                            className=" px-1"
                          />
                        </div>
                        <div className="w-full px-1 flex items-center">
                          <p className="max-md:text-xs text-sm text-wrap">
                            {subject}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        </div>
      ) : (
        <span className="flex flex-col w-full">
          <h1 className="font-semibold text-lg max-md:text-sm p-1">
            Documents
          </h1>
          <span className="flex max-sm:text-sm w-full h-[250px] items-center justify-center text-lg text-gray-400">
            No Documents Available{" "}
          </span>
        </span>
      )}
    </>
  );
};

export default DocumentSection;
