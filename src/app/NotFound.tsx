import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      Page Not Found
      <Link to={"/"} className="submit px-2">
        Return Home
      </Link>
    </div>
  );
}
