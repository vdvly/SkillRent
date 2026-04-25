export class UserDto {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  averageRating: number;
  createdAt: Date;
}
