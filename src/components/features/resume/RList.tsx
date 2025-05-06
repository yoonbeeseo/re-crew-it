import { use, useCallback } from "react"
import ResumeComponent from "./ResumeComponent"
import { useModal } from "../../ui"
import { useAuth } from "../../../contexts/auth.context"
import RForm from "./RForm"

type Props = {
  showForm: () => void
}

export default function RList({ showForm }: Props) {
  const { resumes, setPayload } = use(ResumeComponent.Context)
  const { user } = useAuth()

  const ResumeItem = useCallback(
    (resume: Resume) => {
      const Modal = useModal()
      const onUpdate = () => {
        setPayload(resume)
        Modal.show()
      }

      const onDelete = async () => {
        if (confirm("해당 이력서를 삭제하시겠습니까?")) {
          const res = await fetch(`/api/resumes/${resume.id}`, { method: "DELETE" })
          if (!res.ok) {
            return alert("삭제에 실패했습니다.")
          }
          alert("이력서를 삭제했습니다.")
        }
      }

      return (
        <div className="border p-2 rounded border-gray-200 hover:bg-gray-50">
          <div>
            <p className="font-semibold">
              {resume.company} <span className="font-normal px-1 rounded bg-theme text-white">{resume.job}</span>
            </p>
            <p>
              {new Date(resume.startDate).toLocaleDateString()}~{resume.endDate === "현재까지" ? resume.endDate : new Date(resume.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-row gap-2 justify-end">
            <button onClick={onUpdate}>수정</button>
            <button onClick={onDelete} className="bg-red-500 text-white rounded p-1">
              삭제
            </button>
          </div>
          <Modal.Modal contentClassName="bg-white p-5 rounded-xl border border-border shadow-md w-full max-w-100">
            <RForm closeFn={Modal.hide} user={user!} />
          </Modal.Modal>
        </div>
      )
    },
    [setPayload, user]
  )

  return (
    <div className="pt-15">
      {resumes.length > 0 ? (
        <ul className="p-5 gap-2">
          {resumes.map((resume) => (
            <li key={resume.company}>
              <ResumeItem {...resume} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border justify-center items-center h-screen">
          <button onClick={showForm}>이력서를 추가해주세요.</button>
        </div>
      )}
    </div>
  )
}
