import { Link } from "react-router";
import LandingSlide from "../components/features/home/LandingSlide";
import { useQuery } from "@tanstack/react-query";
import CrewCard from "../components/features/home/CrewCard";

export default function Home() {
  const individuals = useQuery({
    queryKey: ["individuals"],
    queryFn: async (): Promise<UserWithoutPassword[]> => {
      const res = await fetch("/api/users");
      const data = (await res.json()) as User[];
      const individuals: UserWithoutPassword[] = [];
      data.map(({ password, ...user }) => !user.crew && individuals.push(user));

      const shuffled = individuals.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 8);
      return selected;
    },
  });

  const crews = useQuery({
    queryKey: ["crews"],
    queryFn: async (): Promise<UserWithoutPassword[]> => {
      const res = await fetch("api/users");
      const data = (await res.json()) as User[];
      const crews: UserWithoutPassword[] = [];
      data.map(({ password, ...user }) => user.crew && crews.push(user));

      const shuffled = crews.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 8);
      return selected;
    },
  });
  return (
    <div className="">
      <div className="h-screen pt-15 justify-center items-center bg-theme text-white">
        <div className="gap-5">
          <div className="text-5xl font-black items-center">
            <p className="font-extralight text-3xl" style={{ fontWeight: 100 }}>
              나에게는 항해사가 필요해,
            </p>
            <h1>내 배를 이끌어줘!</h1>
          </div>
          <Link to="/signup" className="submit bg-white text-theme">
            크루 등록하기
          </Link>
        </div>
      </div>
      <LandingSlide title="프리랜서 찾기" href="/individual">
        {individuals.data?.map((item, index) => (
          <CrewCard isIndividual key={item.id} index={index} {...item} />
        ))}
      </LandingSlide>
      <LandingSlide title="크루 찾기" href="crew">
        {crews.data?.map((item, index) => (
          <CrewCard key={item.id} index={index} {...item} />
        ))}
      </LandingSlide>
    </div>
  );
}
