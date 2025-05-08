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

  payload: null | T;
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
    startDate: new Date().toLocaleDateString(),
    id: "",
    uid: "",
  },
  payload: null,
};

const ResumeContext = createContext(initialState);

function ResumeComponent({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<T[]>([]);

  const [resume, setResume] = useState(initialState.resume);
  const onChangeR = useCallback((target: keyof T, value: any) => {
    setResume((prev) => ({ ...prev, [target]: value }));
  }, []);
  const [payload, setPayload] = useState<null | T>(null);

  const fetchResumes = useCallback(async (uid: string) => {
    const res = await fetch(`/api/resumes?uid=${uid}`);
    const data = (await res.json()) as Resume[];

    return data ?? [];
  }, []);

  useEffect(() => {
    if (user) {
      fetchResumes(user.id).then((fetchedResumes) =>
        setResumes(fetchedResumes)
      );
    }
  }, [user]);

  useEffect(() => {
    if (payload) {
      setResume(payload);
    }
  }, [payload]);
  return (
    <ResumeContext.Provider
      value={{
        setPayload,
        onChangeR,
        onChangeResumes: setResumes,
        resume,
        resumes,
        payload,
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
