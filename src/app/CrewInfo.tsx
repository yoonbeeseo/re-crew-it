import { useCallback, useMemo, useState, useTransition } from "react";
import { useModal, useTextInput } from "../components/ui";
import { CgSpinner } from "react-icons/cg";
import CrewCard from "../components/features/home/CrewCard";

type Props = {
  user: UserWithoutPassword;
};

export default function CrewInfo({ user }: Props) {
  const Crew = useModal();
  const Name = useTextInput();
  const [name, setName] = useState(user?.crew ?? "");
  const message = useMemo(() => {
    if (name.length === 0) {
      return "크루 이름을 입력해주세요.";
    }
    if (name.length < 1) {
      return "크루 이름을 확인해주세요.";
    }
    return null;
  }, [name]);

  const [isPending, fn] = useTransition();
  const handleCrew = useCallback(() => {
    fn(async () => {
      const response = await fetch(`api/users?id=${user.id}`);
      const fetchedUser = (await response.json()) as User[];
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...fetchedUser[0],
          crew: name,
          updated_at: new Date().getTime(),
        }),
      });
      if (!res.ok) {
        return alert(
          `크루 정보가 ${
            user.crew ? "수정" : "생성"
          }되지 않았습니다. 잠시 후 다시 시도해주세요.`
        );
      }
      alert(`크루 정보가 ${user.crew ? "수정" : "생성"}되었습니다.`);
    });
  }, [name, user]);
  return (
    <div className="pt-15 min-h-screen">
      {user.crew ? (
        <CrewCard
          index={0}
          {...user}
          onEdit={Crew.show}
          onDelete={async () => {
            const response = await fetch(`api/users?id=${user.id}`);
            const fetchedUser = (await response.json()) as User[];

            const res = await fetch(`/api/users/${user.id}`, {
              method: "PUT",
              body: JSON.stringify({
                ...fetchedUser[0],
                crew: null,
                updated_at: new Date().getTime(),
              }),
            });

            if (!res.ok) {
              return alert(
                `크루 정보가 삭제되지 않았습니다. 잠시 후 다시 시도해주세요.`
              );
            }
            alert(`크루를 해체하였습니다.`);
          }}
        />
      ) : (
        <button className="flex-1" onClick={Crew.show}>
          크루를 생성하세요.
        </button>
      )}
      <Crew.Modal contentClassName="bg-white p-5 rounded-xl border border-border shadow-md w-full max-w-100">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            handleCrew();
          }}
          className="flex flex-col gap-4"
        >
          <Name.TextInput
            value={name}
            onChangeText={setName}
            placeholder="밀짚 모자 해적단"
            message={message}
            label="크루 이름"
          />
          <button className="submit" disabled={isPending}>
            {isPending ? (
              <CgSpinner className="animate-spin" />
            ) : (
              `크루 ${user?.crew ? "수정" : "생성"}`
            )}
          </button>
        </form>
      </Crew.Modal>
    </div>
  );
}
