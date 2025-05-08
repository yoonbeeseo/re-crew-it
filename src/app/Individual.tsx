import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { LuChevronsUp, LuSearch } from "react-icons/lu";
import { useInView } from "react-intersection-observer";
import { useScreen } from "../contexts/screen.context";
import IndividualCard from "../components/features/home/CrewCard";

export default function Individual() {
  const [items, setItems] = useState<UserWithoutPassword[]>([]);

  const { data: users } = useQuery({
    queryKey: ["individuals"],
    queryFn: async (): Promise<UserWithoutPassword[]> => {
      const res = await fetch("/api/users");
      const data = (await res.json()) as User[];
      const users: UserWithoutPassword[] = [];
      data.map(({ password, ...user }) => !user.crew && users.push(user));
      setItems(users);
      return users;
    },
  });

  const [keyword, setKeyword] = useState("");
  const keywordRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (keyword.length === 0) {
      alert("검색어를 입력해주세요.");
      return keywordRef.current?.focus();
    }
    const found: UserWithoutPassword[] = [];
    if (!users) {
      return setItems([]);
    }
    users.map((user) => {
      const lowered = keyword.toLocaleLowerCase();
      if (
        user.name.toLocaleLowerCase().includes(lowered) ||
        user.skills.some((skill) =>
          skill.toLocaleLowerCase().includes(lowered)
        ) ||
        user.location.includes(lowered)
      ) {
        found.push(user);
      }
    });
    console.log(found);
    setItems(found);
  }, [keyword, users]);

  useEffect(() => {
    if (items.length > 0) {
      const sortedItems = items.sort((a, b) => {
        const at = a?.updated_at ?? new Date(a.created_at).getTime();
        const bt = b?.updated_at ?? new Date(b.created_at).getTime();
        if (at > bt) {
          return -1;
        } else if (at < bt) {
          return 1;
        } else {
          return 0;
        }
      });
      setItems(sortedItems);
    }
  }, [items]);

  type InfiniteType = {
    totalCount: number;
    currentPage: number;
    data: UserWithoutPassword[];
    itemsToShow: number; //! numOfRows
    totalPages: number;
  };
  const { isPending, hasNextPage, data, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["individuals", "infinite", items],
      initialPageParam: 1,
      queryFn: async ({ pageParam: currentPage }): Promise<InfiniteType> => {
        const itemsToShow = 20;
        const totalCount = items.length;
        const data = items.slice(
          itemsToShow * (currentPage - 1),
          itemsToShow * currentPage
        );
        const totalPages = Math.ceil(totalCount / itemsToShow);

        return {
          currentPage,
          data,
          itemsToShow,
          totalCount,
          totalPages,
        };
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.totalPages - lastPage.currentPage > 0) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
    });

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const { scroll } = useScreen();
  return (
    <div className="min-h-screen">
      <form
        className="min-h-50 p-15 bg-theme justify-center items-center flex"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="bg-white rounded-2xl p-5">
          <div className="flex-row gap-2">
            <label
              htmlFor="keyword"
              className="size-10 justify-center items-center flex text-gray-500"
            >
              <LuSearch />
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              ref={keywordRef}
              placeholder="검색어를 입력해주세요."
              className="border flex-1 outline-none px-2 rounded-full border-gray-500 focus:border-white transition"
            />
          </div>
          <button className="submit mt-4">프리랜서 찾기</button>
        </div>
      </form>
      <div>
        <div className="flex-row justify-between p-2">
          <p className="font-semibold">총 {items.length}명의 프리랜서</p>
          <p className="font-light text-sm text-gray-500">
            {"최신 업데이트 순서"}
          </p>
        </div>
        <ul className="pb-10">
          {isPending || isFetchingNextPage ? (
            <div>loading...</div>
          ) : (
            data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.data?.map((item, j) => (
                  <li key={j}>
                    <IndividualCard index={j} {...item} isIndividual />
                  </li>
                ))}
              </Fragment>
            ))
          )}
          {hasNextPage && <li ref={ref}>다음 것을 불러올까요??</li>}
        </ul>
      </div>
      {scroll >= 200 && (
        <button
          className="fixed bottom-2 right-2 z-10 size-12 submit text-2xl"
          onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        >
          <LuChevronsUp />
        </button>
      )}
    </div>
  );
}
