// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CardComponent } from "@/components/custom/CardComponent";
import { useAuth } from "@/hooks/useAuth";
import { CalendarDays, BookOpen, Bell, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Overview() {
  const { user } = useAuth();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* User Profile Card - Enhanced */}
        <CardComponent
          className="md:w-2/3"
          title={`Welcome back, ${user.first_name}!`}
          description={
            <span className="flex items-center">
              <Badge variant="outline" className="mr-2 capitalize">
                {user.user_type}
              </Badge>
              <span className="text-muted-foreground">Last login: Today at 9:30 AM</span>
            </span>
          }
          footer={
            <div className="text-sm text-muted-foreground">
              <p>Member since {new Date().toLocaleDateString()}</p>
            </div>
          }
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} 
                alt={user.username} 
              />
              <AvatarFallback className="text-xl font-bold">
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">0 Courses</Badge>
                <Badge variant="secondary">0 Assignments</Badge>
              </div>
            </div>
          </div>
          
          {user.bio ? (
            <div className="mb-6 bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="mr-2">📝</span> Bio
              </h3>
              <p className="text-sm">{user.bio}</p>
            </div>
          ) : (
            <div className="mb-6 bg-muted/50 p-4 rounded-lg border border-dashed border-muted-foreground/50">
              <p className="text-sm text-muted-foreground text-center">
                Your profile is incomplete. Add a bio to tell others about yourself.
              </p>
            </div>
          )}
        </CardComponent>

        {/* Quick Stats Card - Without Progress Component */}
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
            <CardDescription>Weekly learning activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>Weekly Goal</span>
                <span className="font-medium">0/5 hours</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-primary h-full w-0 rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Study Time
                </div>
                <p className="text-2xl font-bold">0h</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center text-sm font-medium mb-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Completion
                </div>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Courses Card - Enhanced */}
        <Card className="overflow-hidden border-t-4 border-t-blue-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Courses
            </CardTitle>
            <CardDescription>Your enrolled or teaching courses</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-dashed p-6 text-center">
              <h3 className="font-medium mb-2">No courses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't enrolled in any courses yet.
              </p>
              <button className="text-sm text-primary font-medium hover:underline">
                Browse available courses
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Card - Enhanced */}
        <Card className="overflow-hidden border-t-4 border-t-amber-500">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Announcements
            </CardTitle>
            <CardDescription>Latest updates and news</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-dashed p-6 text-center">
              <h3 className="font-medium mb-2">No announcements</h3>
              <p className="text-sm text-muted-foreground">
                There are no announcements at this time. Check back later!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Your schedule for the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-6 text-center">
            <h3 className="font-medium mb-2">Your calendar is clear</h3>
            <p className="text-sm text-muted-foreground">
              You have no upcoming events scheduled for the next 7 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
