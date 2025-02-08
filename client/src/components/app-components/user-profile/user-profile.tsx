import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserProfileProps = {
  fallback: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ fallback }) => {
  return (
    <Avatar>
      <AvatarFallback className="bg-fuchsia-800 text-white">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserProfile;
