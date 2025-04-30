import { FormEvent, useCallback, useMemo, useState } from "react";
import { useTextInput } from "../ui";
import { emailValidator, passwordValidator } from "../../utils/validation";
import { Link } from "react-router";
import { LuX } from "react-icons/lu";
import { useAuth } from "../../contexts/auth.context";

type Props = {
  hide: () => void;
};

export default function LoginBox({ hide }: Props) {
  const { signin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Email = useTextInput();
  const Password = useTextInput();

  const emailMessage = useMemo(() => emailValidator(email), [email]);
  const passwordMessage = useMemo(
    () => passwordValidator(password),
    [password]
  );

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (emailMessage) {
        alert(emailMessage);
        return Email.focus();
      }

      if (passwordMessage) {
        alert(passwordMessage);
        return Password.focus();
      }

      const { success, message, data } = await signin(email, password);
      if (!success || !data) {
        return alert(message ?? "Error message");
      }
      alert(`${data.name}님 환영합니다!`);
      hide();
    },
    [
      email,
      password,
      signin,
      emailMessage,
      passwordMessage,
      Email,
      Password,
      hide,
    ]
  );
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 w-75 bg-white rounded-2xl p-5 shadow-md relative"
    >
      <h1 className="text-2xl font-black text-center text-theme py-2">
        내 동료가 되어라!
      </h1>
      <button
        type="button"
        className="absolute top-2 right-2 size-5"
        onClick={hide}
      >
        <LuX />
      </button>
      <Email.TextInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        message={emailMessage}
      />
      <Password.TextInput
        type="password"
        label="비밀번호"
        value={password}
        onChangeText={setPassword}
        message={passwordMessage}
      />
      <button className="submit">로그인</button>
      <Link to="/signup" className="py-2 text-gray-500 text-sm">
        회원가입
      </Link>
    </form>
  );
}
