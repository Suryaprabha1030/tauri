import { Dispatch, useState } from "react";

interface addGroupProps {
  setGroupName: Dispatch<React.SetStateAction<any>>;
  groupName: string;
}
const AddGroup: React.FC<addGroupProps> = ({ setGroupName, groupName }) => {
  const [groups, setGroups] = useState<any>([groupName]);

  const addGroup = () => {
    // Get the new group number (length of array + 1)
    const newGroupNumber = groups.length + 1;
    const newGroup = `Group${newGroupNumber}`;

    // Add the new group to the array
    setGroups([...groups, newGroup]);
  };
  const changeGroupName = (name: any) => {
    if (name !== groupName) {
      setGroupName(name);
    }
  };

  return (
    <div
      className={`shadow-t-3xl z-[10000]  flex h-[7rem] w-[14rem] w-full flex-col items-start justify-start  overflow-y-auto rounded-lg bg-white text-[0.75rem] shadow-2xl scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200`}
    >
      <span
        className="selected  flex w-full cursor-pointer flex-row items-center justify-between  gap-[0.5rem] border-b-[0.1rem] border-z-gray-100 bg-z-green-500 px-5  py-2 text-white"
        onClick={addGroup}
      >
        createGroup
      </span>
      <ul className="w-full">
        {groups.map((group: any, index: any) => (
          <li
            key={index}
            className="w-full cursor-pointer gap-[0.5rem] border-b-[0.1rem]   border-z-gray-100 px-5 py-2 text-[0.85rem] hover:bg-z-gray-100"
            onClick={() => changeGroupName(group)}
          >
            {group}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddGroup;
