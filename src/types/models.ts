//for Album model and resources
export interface IAlbum {
  artist: String;
  genre: String;
  label: String;
  selling_information: {
    certifications: String;
    sales: String;
  };
  singles: [String];
  ratingsAverage: Number;
  ratingsQuantity: Number;
  imageCover: String;
  images: [String];
  //createdAt: Date;
  title: String;
  tracks: [String];
  year: Number;
}

//For user model and resources
export interface IUser
{
  name: string;
  email: string;
  photo: string;
  password: string;
  confirmPassword: string;
}
