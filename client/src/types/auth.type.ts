export enum UserType {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "administrator",
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  profilePicture?: string | null;
  bio?: string;
  dateJoined?: string;
  isActive?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
