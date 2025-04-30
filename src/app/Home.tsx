import { useAuth } from "../contexts/auth.context";

export default function Home() {
  const { user } = useAuth();
  return <div>{user ? user.email : "No user"}</div>;
}
