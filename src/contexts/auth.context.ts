import { createContext, useContext } from "react";

export type AuthProps = {
  user: null | UserWithoutPassword;
  signin: (
    email: string,
    password: string
  ) => Promise<PromiseResult<UserWithoutPassword>>;

  //Todo: signup signout

  signup: (user: User) => Promise<PromiseResult>;
  signout: () => Promise<PromiseResult>;
};

export const AuthContext = createContext<AuthProps>({
  user: null,
  signin: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  signout: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);
