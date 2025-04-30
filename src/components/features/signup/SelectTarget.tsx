import { Link } from "react-router";

export default function SelectTarget() {
  return (
    <div className="justify-center items-center h-screen gap-5">
      <h1 className="font-black text-4xl text-theme">누구를 찾고 계신가요?</h1>
      <ul className="flex-row gap-5">
        <Link to="/signup?target=crew" className={link}>
          팀원
        </Link>
        <Link to="/signup?target=individual" className={link}>
          크루
        </Link>
      </ul>
    </div>
  );
}

const link = "border text-theme p-5 rounded-xl hover:bg-theme/10 text-xl";
