export type TRegisterUser = {
  name: string;
  contactNo: string;
  userName: string;
  email: string;
  password: string;
};

export type TLoginUser = {
  userName: string;
  email: string;
  password: string;
};

export type TJWTPayload = {
  id: string;
};