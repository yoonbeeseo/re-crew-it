import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useSelect, useTextInput } from "../../ui";
import { LuChevronLeft, LuX } from "react-icons/lu";
import { useNavigate } from "react-router";
import { emailValidator, passwordValidator } from "../../../utils/validation";
import { useAuth } from "../../../contexts/auth.context";
import { v4 } from "uuid";
import { jobs, locations } from "../../../dummy";

type Props = {
  target: string;
};

export default function SignupForm({ target }: Props) {
  const navi = useNavigate();
  const [newUser, setNewUser] = useState<User>({
    email: "",
    name: "",
    password: "",
    created_at: new Date(),
    crew: null,
    id: "",
    imgUrl: null,
    lookingFor: [],
    skills: [],
    job: "",
    location: "",
  });
  const [skill, setSkill] = useState("");

  const onChangeUser = useCallback(
    (value: string, e?: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!e) {
        return;
      }

      setNewUser((prev) => ({ ...prev, [e.target.id]: value }));
    },
    []
  );

  const Email = useTextInput();
  const Password = useTextInput();
  const Name = useTextInput();
  const Crew = useTextInput();
  const Job = useSelect();
  const Lo = useSelect();
  const LF = useSelect();
  const Skill = useTextInput();

  const emailMessage = useMemo(
    () => emailValidator(newUser.email),
    [newUser.email]
  );
  const passwordMessage = useMemo(
    () => passwordValidator(newUser.password),
    [newUser.password]
  );
  const nameMessage = useMemo(() => {
    if (newUser.name.length === 0) {
      return "이름을 입력해주세요.";
    }
    if (newUser.name.length < 2) {
      return "이름은 최소 2글자 이상으로 입력해주세요.";
    }
    return null;
  }, [newUser.name]);

  const crewMessage = useMemo(() => {
    if (!newUser.crew) {
      return "크루 이름을 입력해주세요.";
    }
    if (newUser.crew.length === 0) {
      return "크루 이름을 입력해주세요.";
    }
    if (newUser.crew.length < 2) {
      return "크루 이름은 최소 2글자 이상으로 입력해주세요.";
    }
    return null;
  }, [newUser.crew]);

  const jobMessage = useMemo(() => {
    if (newUser.job.length === 0) {
      return "직업/직군을 선택해주세요.";
    }
    return null;
  }, [newUser.job]);
  const locationMessage = useMemo(() => {
    if (newUser.location.length === 0) {
      return "지역/위치를 선택해주세요.";
    }
    return null;
  }, [newUser.location]);
  const lookingForMessage = useMemo(() => {
    if (newUser.lookingFor.length === 0) {
      return "최소 1개 이상의 찾으시는 동료의 직업/직군을 선택해주세요.";
    }
    return null;
  }, [newUser.lookingFor]);
  const skillsMessage = useMemo(() => {
    if (newUser.skills.length === 0) {
      return "최소 1개 이상의 본인의 스킬/스택을 입력해주세요.";
    }
    return null;
  }, [newUser.skills]);

  const { signup } = useAuth();
  const handleSubmit = useCallback(async () => {
    if (emailMessage) {
      alert(emailMessage);
      return Email.focus();
    }
    if (passwordMessage) {
      alert(passwordMessage);
      return Password.focus();
    }
    if (nameMessage) {
      alert(nameMessage);
      return Name.focus();
    }
    if (jobMessage) {
      alert(jobMessage);
      return Job.show();
    }
    if (locationMessage) {
      alert(locationMessage);
      return Lo.show();
    }
    if (lookingForMessage) {
      alert(lookingForMessage);
      return LF.show();
    }
    if (skillsMessage) {
      alert(skillsMessage);
      return Skill.focus();
    }

    if (Skill.focused) {
      return;
    }
    const user = { ...newUser, id: v4() };
    const { success, message, data } = await signup(user);
    if (!success) {
      return alert(
        message ??
          "회원가입하면서 무슨 문제가 생긴듯 합니다. 다시 한 번 시도해주세요."
      );
    }
    console.log(data);
    alert("회원가입을 축하합니다.");
    //Todo: home/crew /crewinfo/resume
    if (user.crew) {
      navi("/crewinfo");
    } else {
      navi("/resume");
    }
  }, [
    signup,
    emailMessage,
    passwordMessage,
    nameMessage,
    jobMessage,
    locationMessage,
    lookingForMessage,
    skillsMessage,
    Email,
    Password,
    Name,
    Job,
    Lo,
    LF,
    Skill,
    newUser,
  ]);

  return (
    <div>
      <div className="flex-row justify-between border-b border-border items-center">
        <button
          onClick={() => {
            if (
              confirm(
                "이전으로 돌아가시면 입력했던 정보는 사라지게 됩니다. 정말 이전으로 돌아가시겠습니까?"
              )
            ) {
              navi(-1);
            }
          }}
          className="text-theme w-25 justify-start p-5"
        >
          <LuChevronLeft /> 이전
        </button>
        <h1 className="text-theme text-2xl font-black">
          {target !== "crew" ? "크루" : "회원"} 정보 입력
        </h1>
        <button
          onClick={() => {
            if (
              confirm(
                "취소하시면 입력한 정보는 사라집니다. 회원가입을 취소하겠습니까?"
              )
            ) {
              navi("/");
            }
          }}
          className="w-25 justify-end p-5"
        >
          취소
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2 con max-w-100 p-5 mx-auto"
      >
        <Email.TextInput
          id="email"
          value={newUser.email}
          onChangeText={onChangeUser}
          label="이메일"
          placeholder="your@email.com"
          message={emailMessage}
        />
        <Password.TextInput
          id="password"
          value={newUser.password}
          onChangeText={onChangeUser}
          label="비밀번호"
          type="password"
          placeholder="* * * * * * * *"
          message={passwordMessage}
        />
        <Name.TextInput
          id="name"
          value={newUser.name}
          onChangeText={onChangeUser}
          placeholder="몽키.D.루피"
          label="이름"
          message={nameMessage}
        />
        <div className="gap-1">
          <div className="flex-row gap-2">
            <Job.Component
              data={jobs}
              onSelectOption={onChangeUser}
              placeholder="직군 선택"
              label="직업/직군"
              containerClassName="flex-1"
              id="job"
              value={newUser.job}
            />
            <Lo.Component
              data={locations}
              onSelectOption={onChangeUser}
              placeholder="지역 선택"
              label="지역/위치"
              containerClassName="flex-1"
              id="location"
              value={newUser.location}
            />
          </div>
          {(jobMessage || locationMessage) && (
            <span className="text-xs text-red-500">
              {jobMessage || locationMessage}
            </span>
          )}
        </div>

        {(newUser.job === "대표" || target !== "crew") && (
          <Crew.TextInput
            value={newUser.crew ?? ""}
            onChangeText={onChangeUser}
            label="크루 이름"
            placeholder="밀짚모자 해적단"
            id="crew"
            message={crewMessage}
          />
        )}

        <div className="gap-1">
          <label htmlFor={"lookingFor"} className="text-xs text-gray-500">
            찾는 동료의 직업/직군
          </label>
          <ul className="flex-wrap flex-row gap-2">
            {newUser.lookingFor.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="gap-1 bg-gray-50 h-12 px-2 rounded-full"
                  onClick={() =>
                    setNewUser((prev) => ({
                      ...prev,
                      lookingFor: prev.lookingFor.filter((job) => job !== item),
                    }))
                  }
                >
                  {item} <LuX />
                </button>
              </li>
            ))}
            <li>
              <LF.Component
                data={jobs}
                value={""}
                id="lookingFor"
                onSelectOption={(job) => {
                  const found = newUser.lookingFor.find((item) => item === job);
                  setNewUser((prev) => ({
                    ...prev,
                    lookingFor: found
                      ? prev.lookingFor.filter((item) => item !== job)
                      : [...prev.lookingFor, job as UserJob],
                  }));
                }}
              />
            </li>
          </ul>
          {lookingForMessage && (
            <span className="text-xs text-red-500">{lookingForMessage}</span>
          )}
        </div>

        <div className="gap-1">
          <label htmlFor={"skills"} className="text-xs text-gray-500">
            나의 기술/스택
          </label>
          <ul className="flex-wrap flex-row gap-2">
            {newUser.skills.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="gap-1 bg-gray-50 h-12 px-2 rounded-full"
                  onClick={() =>
                    setNewUser((prev) => ({
                      ...prev,
                      skills: prev.skills.filter((job) => job !== item),
                    }))
                  }
                >
                  {item} <LuX />
                </button>
              </li>
            ))}
            <li>
              <Skill.TextInput
                value={skill}
                onChangeText={setSkill}
                onKeyDown={(e) => {
                  const { key, nativeEvent } = e;
                  if (
                    key === "Enter" &&
                    Skill.focused &&
                    !nativeEvent.isComposing
                  ) {
                    const found = newUser.skills.find((item) => item === skill);
                    setNewUser((prev) => ({
                      ...prev,
                      skills: found
                        ? prev.skills.filter((item) => item !== skill)
                        : [...prev.skills, skill],
                    }));
                    setSkill("");
                  }
                }}
                label="나의 기술/스택"
                placeholder="React Js"
                id="skills"
              />
            </li>
          </ul>
          {skillsMessage && (
            <span className="text-xs text-red-500">{skillsMessage}</span>
          )}
        </div>

        <button className="submit">회원가입</button>
      </form>
    </div>
  );
}
