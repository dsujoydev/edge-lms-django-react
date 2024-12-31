// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardComponent } from "@/components/custom/CardComponent";
import { useAuth } from "@/hooks/useAuth";

export default function Overview() {
  const { user } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <CardComponent
        title={`Welcome, ${user.first_name}!`}
        description={`You are logged in as ${user.user_type}`}
        footer={
          ""
          //   <Button onClick={handleLogout} variant="outline" className="w-full">
          //     Logout
          //   </Button>
        }
      >
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} alt={user.username} />
            <AvatarFallback>
              {user.first_name[0]}
              {user.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
        </div>
        {user.bio && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Bio</h3>
            <p>{user.bio}</p>
          </div>
        )}
      </CardComponent>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Your enrolled or teaching courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No courses yet. Check back later!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates and news</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No announcements at this time.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
