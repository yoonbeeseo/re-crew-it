import { use } from "react";
import ResumeComponent from "./ResumeComponent";

type Props = {
  showForm: () => void;
};

export default function RList({ showForm }: Props) {
  const { resumes } = use(ResumeComponent.Context);
  return (
    <div>
      {resumes.length > 0 ? (
        <ul>
          {resumes.map((resume) => (
            <li key={resume.company}>{resume.company}</li>
          ))}
        </ul>
      ) : (
        <button onClick={showForm}>이력서를 추가해주세요.</button>
      )}
    </div>
  );
}
