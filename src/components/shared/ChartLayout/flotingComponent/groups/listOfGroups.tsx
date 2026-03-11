import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
interface ListOfGroupsProps {
  setGroupsOpen: Dispatch<SetStateAction<boolean>>;
  GroupsOpen: boolean;
  setShowList: Dispatch<SetStateAction<boolean>>;
  onSelectWatchlist: Dispatch<SetStateAction<any>>;
  setSelectedGroup: Dispatch<SetStateAction<any>>;
  setSelectedGroupData: Dispatch<SetStateAction<any>>;
}

const ListOfGroups: React.FC<ListOfGroupsProps> = ({
  setGroupsOpen,
  GroupsOpen,
  setShowList,
  onSelectWatchlist,
  setSelectedGroup,
  setSelectedGroupData,
}) => {
  const [list, setList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const CreateGroupsApi = new UserWatchlistRouterApi(baseConfig());
        const res = await CreateGroupsApi.fetchGroupsV1UsersMeGroupsGet();
        setList(res.data);
      } catch (error: any) {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    fetchGroups();
  }, []);

  const getObjectByName = (array: any, Groupname: any) => {
    return array.find((obj: any) => obj.name === Groupname);
  };

  const handleWatchlistClick = (GroupName: string) => {
    setSelectedGroup(GroupName);
    const result = getObjectByName(list, GroupName);
    setSelectedGroupData(result);
    onSelectWatchlist(null);
    setTimeout(() => {
      setShowList(false);
    }, 200);
  };

  return (
    <div
      className="relative flex  h-full w-full flex-col  items-center justify-center overflow-y-auto scrollbar-none "
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <div
        className={`sticky top-0 z-[10001]  flex w-full cursor-pointer flex-row items-center  gap-2 px-5 text-[0.85rem] font-semibold max-sm:py-1 max-sm:text-[0.75rem] sm:max-md:py-[0.3rem] sm:max-md:text-[0.8rem] md:max-xl:py-[0.45rem] xl:py-2 ${
          GroupsOpen
            ? "bg-z-green-500 text-white "
            : "bg-white text-z-green-500"
        }`}
      >
        <h1 className="text-[0.75rem]">Groups</h1>
        <Image
          src="/svg/arrowFall.svg"
          className="h-[1.2rem] w-[1.2rem]"
          width="20"
          height="20"
          alt="plus"
          onClick={() => setGroupsOpen(true)}
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        />
      </div>

      {GroupsOpen && (
        <div className="z-[10000] flex h-[10rem]  w-full flex-col  ">
          {list &&
            list.map((item: any) => (
              <div
                key={item.name}
                className=" flex w-full cursor-pointer flex-row items-center justify-between  border-b-[0.1rem] border-z-gray-100 px-5 text-[0.75rem] hover:bg-z-gray-100 max-sm:gap-[0.1rem] max-sm:py-1 sm:max-md:py-[0.3rem] md:max-xl:py-[0.45rem] xl:gap-[0.5rem] xl:py-2"
                onClick={() => handleWatchlistClick(item.name)}
              >
                <span>{item.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ListOfGroups;
