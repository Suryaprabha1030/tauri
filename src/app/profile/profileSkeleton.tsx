import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#DCDCDC" highlightColor="#f2f2f2">
      <div className="mt-1 w-full rounded border p-2">
        <Skeleton />
      </div>
    </SkeletonTheme>
  );
};

export default ProfileSkeleton;
