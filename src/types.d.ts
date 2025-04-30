type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  imgUrl: string | null;
  job: UserJob | "";
  location: UserLocation | "";
  lookingFor: UserJob[];
  skills: string[];
  crew: string | null;
};

const jobs = [
  "대표",
  "개발자",
  "디자이너",
  "마케터",
  "운영자",
  "기획자",
] as const;

type UserJob = (typeof jobs)[number];

const locations = [
  "서울",
  "부산",
  "대전",
  "대구",
  "광주",
  "울산",
  "포항",
  "경남",
  "경북",
  "전남",
  "전북",
  "충남",
  "충북",
  "경기도",
  "강원도",
  "제주도",
] as const;

type UserLocation = (typeof locations)[number];

type UserWithoutPassword = Omit<User, "password"> & {
  resumes?: Resume[];
};

type Resume = {
  company: string;
  startDate: Date;
  endDate: Date | "현재까지";
  job: UserJob | "";
  skills: string[];
};

type Post = {
  body: string;
  created_at: Date;
  updated_at: Date;
  uid: string;
  title: string;
  id: string; //! uuid
  skills: string[];
  due_at: string;
};

type PromiseResult<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};
