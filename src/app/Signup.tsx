import { useSearchParams } from "react-router";
import { SelectTarget, SignupForm } from "../components/features/signup";

export default function Signup() {
  const target = useSearchParams()[0].get("target");
  return (
    <div className="con">
      {!target ? <SelectTarget /> : <SignupForm target={target} />}
    </div>
  );
}

//! single responsibility pattern
