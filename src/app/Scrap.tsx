import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/auth.context";
import ScrapItem from "../components/features/scrap/ScrapItem";
import { useMemo } from "react";

export default function Scrap() {
  const { user } = useAuth();
  const queryKey = useMemo(() => [user?.id, "scraps"], [user]);
  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: async (): Promise<Scrap[]> => {
      const res = await fetch(`/api/scraps?uid=${user?.id}`);
      const data = (await res.json()) as Scrap[];
      const sortedScraps = data.sort((a, b) => {
        if (a.saved_at > b.saved_at) {
          return -1;
        } else if (a.saved_at < b.saved_at) {
          return 1;
        } else {
          return 0;
        }
      });

      return sortedScraps;
    },
  });

  if (isPending) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div className="h-screen pt-15">
      {data.map((scrap, index) => (
        <ScrapItem key={index} index={index} {...scrap} queryKey={queryKey} />
      ))}
    </div>
  );
}
