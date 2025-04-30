import { use, useCallback, useEffect, useMemo, useState } from "react";
import ResumeComponent from "./ResumeComponent";
import { DatePicker, useSelect, useTextInput } from "../../ui";
import { LuX } from "react-icons/lu";
import { jobs } from "../../../dummy";

type Props = {
  closeFn: () => void;
  user?: UserWithoutPassword;
};
export default function RForm({ closeFn, user }: Props) {
  const { resume, onChangeR, isEditing, onChangeResumes, resumes } = use(
    ResumeComponent.Context
  );
  const { company, endDate, job, skills, startDate } = resume;
  const [skill, setSkill] = useState("");

  const Company = useTextInput();
  const Job = useSelect();

  const Skill = useTextInput();

  const companyMessage = useMemo(() => {
    if (company.length === 0) {
      return "직장 이름을 입력해주세요.";
    }
    return null;
  }, [company]);
  const jobMessage = useMemo(() => {
    if (job.length === 0) {
      return "직업을 선택해주세요.";
    }
    return null;
  }, [job]);

  const skillsMessage = useMemo(() => {
    if (skills.length === 0) {
      return "최소 1개 이상의 기술/스택을 입력해주세요.";
    }
    return null;
  }, [skills]);

  const handleSubmit = useCallback(() => {
    if (companyMessage) {
      alert(companyMessage);
      return Company.focus();
    }
    if (jobMessage) {
      alert(jobMessage);
      return Job.show();
    }
    if (skillsMessage) {
      alert(skillsMessage);
      return Skill.focus();
    }

    if (Skill.focused) {
      return;
    }
    if (isEditing) {
      //Todo: 수정 로직 ㄱ
      return;
    }
    //!추가 로직
    const found = resumes.find((r) => r.company === resume.company);
    if (found) {
      return alert("이미 추가된 직장입니다.");
    }
    onChangeResumes([resume, ...resumes]);
    return closeFn();
  }, [
    resume,
    companyMessage,
    jobMessage,
    skillsMessage,
    Company,
    Job,
    Skill,
    isEditing,
    onChangeResumes,
    resumes,
    closeFn,
  ]);

  useEffect(() => {
    if (user && resume.company.length === 0) {
      onChangeR("skills", user.skills);
    }
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="gap-2 flex flex-col"
    >
      <h1 className="text-center font-black text-2xl">이력서 관리</h1>
      <Company.TextInput
        value={company}
        onChangeText={(value) => onChangeR("company", value)}
        label="직장이름"
        placeholder="밀짚모자 해적단"
      />
      <Job.Component
        data={jobs}
        onSelectOption={(option) => {
          onChangeR("job", option);
        }}
        label="직군/직업"
        value={job}
      />
      <div className="gap-1">
        <label htmlFor={"skills"} className="text-xs text-gray-500">
          나의 기술/스택
        </label>
        <ul className="flex-wrap flex-row gap-2">
          {skills.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="gap-1 bg-gray-50 h-12 px-2 rounded-full"
                onClick={() =>
                  onChangeR(
                    "skills",
                    skills.filter((skill) => skill !== item)
                  )
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
                  const found = skills.find((item) => item === skill);
                  onChangeR(
                    "skills",
                    found
                      ? skills.filter((item) => item !== skill)
                      : [...skills, skill]
                  );
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
      <DatePicker
        startDate={startDate}
        endDate={endDate}
        onSelectEndDate={(newEndDate) => {
          console.log(newEndDate);
          onChangeR("endDate", newEndDate);
        }}
        onSelectStartDate={(newStartDate) => {
          console.log(newStartDate);
          onChangeR("startDate", newStartDate);
        }}
      />
      <button className="submit">확인 ㄱㄱ</button>
    </form>
  );
}
