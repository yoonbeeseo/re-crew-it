import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useTransition } from "react";
import { CgSpinner } from "react-icons/cg";
import { LuDelete } from "react-icons/lu";

type Props = {
  index: number;
  queryKey: any[];
} & Scrap;

export default function ScrapItem({ index, queryKey, ...scrap }: Props) {
  const queryClient = useQueryClient();
  const caching = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient, queryKey]
  );
  const mutate = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/scraps/${scrap.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error(
            "스크랩 삭제에 실패했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onError: (err) => alert(err),
    onSuccess: () => {
      caching();
    },
  });

  const [isPending, fn] = useTransition();
  const onDelete = useCallback(() => {
    if (confirm("해당 스크랩을 삭제하시겠습니까?")) {
      fn(async () => {
        await mutate.mutateAsync();
      });
    }
  }, [mutate]);

  return (
    <div className="flex-row justify-between p-2 hover:bg-theme/2">
      <div className="flex-row gap-2">
        <p>
          {index + 1}.
          {scrap.type === "크루" ? scrap.data.crew : scrap.data.name}
        </p>
        <ul className="flex-row gap-2">
          {scrap.data.skills.map((skill) => (
            <li
              key={skill}
              className="rounded bg-gray-50 text-sm font-light text-gray-500 px-1"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onDelete} className="text-gray-500 hover:text-red-500">
        {isPending ? (
          <CgSpinner className="animate-spin text-red-500" />
        ) : (
          <LuDelete />
        )}
      </button>
    </div>
  );
}
