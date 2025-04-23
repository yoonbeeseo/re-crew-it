import LoginBox from "../components/features/LoginBox";

export default function Home() {
  return (
    <dialog open>
      <LoginBox hide={() => console.log("gogogo")} />
    </dialog>
  );
}
