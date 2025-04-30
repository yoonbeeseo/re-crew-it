import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import RForm from "./RForm";
import RList from "./RList";
import { useAuth } from "../../../contexts/auth.context";

type T = Resume;

type Props = {
  resume: T;
  onChangeR: (target: keyof T, value: any) => void;
  setPayload: (payload: T | null) => void;

  resumes: T[];
  onChangeResumes: (resumes: T[]) => void;

  isEditing: boolean;
};

const initialState: Props = {
  onChangeR: () => {},
  onChangeResumes: () => {},
  setPayload: () => {},
  resumes: [],
  resume: {
    company: "",
    endDate: "현재까지",
    job: "",
    skills: [],
    startDate: new Date(),
  },
  isEditing: false,
};

const ResumeContext = createContext(initialState);

function ResumeComponent({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<T[]>([]);
  const onChangeResumes = useCallback(
    async (resumes: T[]) => {
      setResumes(resumes);
      if (!user) {
        return;
      }
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...user, resumes }),
      });
      if (!res.ok) {
        return alert("resume updated failed!" + res.statusText);
      }
      console.log("resumes updated!");
    },
    [user]
  );

  const [resume, setResume] = useState(initialState.resume);
  const onChangeR = useCallback((target: keyof T, value: any) => {
    setResume((prev) => ({ ...prev, [target]: value }));
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const setPayload = useCallback((payload: T | null) => {
    // if(payload === null ){
    //   setResume(initialState.resume)
    // } else setResume( payload )

    setResume(payload ?? initialState.resume);
    setIsEditing(payload ? true : false);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        setPayload,
        onChangeR,
        onChangeResumes,
        resume,
        resumes,
        isEditing,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

ResumeComponent.Context = ResumeContext;
ResumeComponent.initialState = initialState;
ResumeComponent.Form = RForm;
ResumeComponent.List = RList;

export default ResumeComponent;
