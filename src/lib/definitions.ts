export type IAuth = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type IUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  photo: string;
};

export type ITask = {
  id: number;
  name: string;
  description?: string;
  is_done: boolean;
  date_created: string;
  date_updated: string;
  owner: number;
};

export type INewTask = Pick<ITask, "name" | "description">;

export type ITaskListAPIResponse = {
  count: number;
  next: string;
  previous: string;
  results: ITask[];
};

export type ISignUpFormStatus = {
  isFilledOut: boolean;
  email: null | string;
};

export type ISignUpAPIError = {
  data: {
    email?: string[];
    first_name?: string[];
    last_name?: string[];
    password?: string[];
    re_password?: string[];
  };
  status: number;
};

export type ISignInAPIError = {
  data: {
    detail?: string;
  };
  status: number;
};

export type IResetPasswordConfirmAPIError = {
  data: {
    new_password?: string[];
    re_new_password?: string[];
    token?: string[];
    uid?: string[];
  };
  status: number;
};

export type IResetEmailConfirmAPIError = {
  data: {
    new_email?: string[];
    re_new_email?: string[];
    token?: string[];
    uid?: string[];
  };
  status: number;
};
