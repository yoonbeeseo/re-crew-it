import { PropsWithChildren, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../auth.context";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState(fetchUser());

  const signin = useCallback(async (email: string, password: string) => {
    const res = await fetch(`/api/users?email=${email}`);
    if (!res.ok) {
      return { success: false, message: "존재하지 않는 유저입니다." };
    }
    const fetchedUsers = (await res.json()) as User[];
    if (fetchedUsers.length === 0) {
      return { success: false, message: "존재하지 않는 유저입니다." };
    }
    if (fetchedUsers.length === 0) {
      return { success: false, message: "존재하지 않는 유저입니다." };
    }
    const { password: pwd, ...data } = fetchedUsers[0];
    if (pwd !== password) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." };
    }

    localStorage.setItem("crew-user", JSON.stringify(data));
    setUser(data);
    return { success: true, data };
  }, []);

  const signout = useCallback(async (): Promise<PromiseResult> => {
    setUser(null);
    localStorage.removeItem("crew-user");
    return { success: true };
  }, []);

  const signup = useCallback(async (user: User): Promise<PromiseResult> => {
    const res = await fetch(`/api/users?email=${user.email}`);
    const users = await res.json();
    if (users.length > 0) {
      return { success: false, message: "이미 존재하는 회원입니다." };
    }
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return {
        success: false,
        message:
          "유저를 데이터베이스에 저장하면서 문제가 생겼습니다. 회원가입 실패!",
      };
    }
    const { password, ...data } = user;
    setUser(data);
    localStorage.setItem("crew-user", JSON.stringify(data));
    return { success: true };
  }, []);

  useEffect(() => {
    console.log({ user });
  }, [user]);

  useEffect(() => {
    const user = fetchUser();
    if (user) {
      const fetchFn = async () => {
        const res = await fetch(`/api/users/${user.id}`);
        const { password, ...data } = await res.json();

        return data;
      };
      fetchFn().then((fetchedUser) => {
        setUser(fetchUser);
        localStorage.setItem("crew-user", JSON.stringify(fetchedUser));
        console.log("fresh version of user is stored");
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signin, signout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

const fetchUser = (): UserWithoutPassword | null => {
  const res = localStorage.getItem("crew-user");
  if (!res) {
    return null;
  }
  const user = JSON.parse(res) as UserWithoutPassword | null;

  return user;
};
