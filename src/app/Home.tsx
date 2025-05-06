import { useAuth } from "../contexts/auth.context"

export default function Home() {
  const { user } = useAuth()
  return <div className="">{user ? user.email : " no user "}</div>
}
