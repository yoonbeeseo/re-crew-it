import { ComponentProps, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  contentClassName?: string;
} & ComponentProps<"dialog">;

export default function useModal() {
  const [showing, setShowing] = useState(false);
  const show = useCallback(() => setShowing(true), []);
  const hide = useCallback(() => setShowing(false), []);

  const Modal = useCallback(
    ({ children, contentClassName, ...props }: Props) => {
      return (
        showing && (
          <dialog
            {...props}
            open
            className={twMerge(
              props?.className ??
                "z-50 size-full bg-black/10 flex justify-center items-center"
            )}
          >
            <div className={twMerge("emerge bottom", contentClassName)}>
              {children}
            </div>
            <span className="absolute -z-10 size-full" onClick={hide} />
          </dialog>
        )
      );
    },
    [hide, showing]
  );

  return {
    showing,
    show,
    hide,
    Modal,
  };
}
