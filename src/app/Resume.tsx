import ResumeComponent from "../components/features/resume/ResumeComponent";
import { useModal } from "../components/ui";

export default function Resume({ user }: { user: UserWithoutPassword }) {
  const RFModal = useModal();
  return (
    <ResumeComponent>
      <ResumeComponent.List showForm={RFModal.show} />
      <RFModal.Modal contentClassName="bg-white p-5 rounded-xl border border-border shadow-md w-full max-w-100">
        <ResumeComponent.Form user={user} closeFn={RFModal.hide} />
      </RFModal.Modal>
    </ResumeComponent>
  );
}
