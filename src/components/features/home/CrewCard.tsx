import { useCallback, useTransition } from "react";
import { IoLocationOutline, IoPersonCircle } from "react-icons/io5";
import { LuBookmark, LuDelete, LuPen } from "react-icons/lu";
import { v4 } from "uuid";
import { useAuth } from "../../../contexts/auth.context";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router";

type Props = {
  index: number;
  isIndividual?: boolean;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
} & UserWithoutPassword;

export default function CrewCard({
  index,
  isIndividual,
  onEdit,
  onDelete,
  ...individual
}: Props) {
  const { user } = useAuth();
  const [isPending, fn] = useTransition();
  const navi = useNavigate();

  const onBookmark = useCallback(() => {
    fn(async () => {
      if (onEdit) {
        return onEdit();
      }
      if (user?.id === individual.id) {
        return navi("/crewinfo");
      }
      const scrapData = await fetch(`api/scraps?uid=${user?.id}`);
      const scraps = (await scrapData.json()) as Scrap[];
      const found = scraps.find((item) => item.data.id === individual.id);
      if (found) {
        return alert("이미 스크랩하였습니다.");
      }

      const newScrap: Scrap = {
        data: individual,
        id: v4(),
        uid: user?.id!,
        saved_at: new Date().getTime(),
        type: isIndividual ? "프리랜서" : "크루",
      };
      const res = await fetch(`/api/scraps`, {
        method: "POST",
        body: JSON.stringify(newScrap),
      });
      if (!res.ok) {
        return alert(res.statusText);
      }
      alert("해당 크루를 스크랩하였습니다.");
    });
  }, [individual, user, onEdit, navi]);

  const onDeleteButton = useCallback(() => {
    fn(async () => {
      if (confirm("크루를 삭제하시겠습니까?") && onDelete) {
        await onDelete();
      }
    });
  }, [onDelete]);

  return (
    <div className="border p-5 rounded-2xl m-2">
      <div className="flex-row items-center gap-2">
        {individual.imgUrl ? (
          <img
            src={individual.imgUrl}
            alt={individual.name}
            className="size-20 border rounded-full border-border"
          />
        ) : (
          <div className="size-20 justify-center items-center border border-border rounded-full bg-gray-50 text-gray-500">
            <IoPersonCircle className="size-full text-border" />
          </div>
        )}
        <div className="items-start">
          <p className="font-semibold text-2xl">
            {isIndividual ? individual.name : individual.crew}
          </p>
          <div className="flex-row items-center gap-2 text-gray-500">
            <IoLocationOutline /> <p>{individual.location}</p>
          </div>
        </div>
      </div>
      <div className="text-left py-5">{individual.lookingFor.join(", ")}</div>
      <p className="text-left text-xs text-gray-500">
        {individual.skills.join(", ")}
      </p>
      <div className="flex-row justify-between mt-5">
        <p className="text-xs text-theme">{getUpdatedTime(individual)}</p>
        <div className="flex-row gap-2">
          <button onClick={onBookmark}>
            {isPending ? (
              <CgSpinner className="animate-spin" />
            ) : onEdit || user?.id === individual.id ? (
              <LuPen />
            ) : (
              <LuBookmark />
            )}
          </button>
          {onDelete && (
            <button onClick={onDeleteButton}>
              {isPending ? (
                <CgSpinner className="animate-spin" />
              ) : (
                <LuDelete />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getUpdatedTime({ created_at, updated_at }: UserWithoutPassword) {
  const base =
    new Date().getTime() - (updated_at ?? new Date(created_at).getTime());

  const days = Math.floor(base / 1000 / 60 / 60 / 24);
  if (days > 0) {
    return days + "일 전";
  }
  const hours = Math.floor(base / 1000 / 60 / 60);
  if (hours > 0) {
    return hours + "시간 전";
  }

  const mins = Math.floor(base / 1000 / 60);
  if (mins > 0) {
    return mins + "분 전";
  }
  return "방금 전";
}
