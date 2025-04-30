import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { LuCircleX, LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

type Props = {
  containClassName?: string;
  labelClassName?: string;
  wrapClassName?: string;
  spanClassName?: string;
  messageClassName?: string;
  label?: string;
  message?: string | null;
  onChangeText: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  resetShown?: boolean;
} & ComponentProps<"input">;

export default function useTextInput() {
  const ref = useRef<HTMLInputElement>(null);
  const focus = useCallback(
    () =>
      setTimeout(
        () =>
          ref.current?.focus({
            // preventScroll //! 포커스 시 작동되는 스크롤 애니메이션 효과
          }),
        100
      ),
    []
  );
  const [focused, setFocused] = useState(false);

  const id = useId();

  const TextInput = useCallback(
    ({
      containClassName,
      wrapClassName,
      labelClassName,
      label,
      spanClassName,
      messageClassName,
      message,
      onChangeText,
      resetShown,
      ...props
    }: Props) => {
      return (
        <div className={twMerge("gap-1", containClassName)}>
          {/* //Todo: div 를 border값으로 감싸는 형태로 만들기 */}
          <div className={twMerge("relative", wrapClassName)}>
            {label && (
              <label
                htmlFor={props?.id ?? id}
                className={twMerge(
                  "absolute left-3 text-xs text-gray-500 transition",
                  focused ||
                    (typeof props?.value === "string" &&
                      props?.value?.length > 0) ||
                    (typeof props?.value === "number" && props.value > 0) ||
                    props?.placeholder
                    ? "top-2"
                    : "top-[50%] translate-y-[-50%]",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            <input
              {...props}
              className={twMerge(
                "border border-border rounded-full p-3 pr-9 h-12 bg-transparent outline-none focus:border-theme",
                (focused ||
                  (typeof props?.value === "string" &&
                    props?.value?.length > 0) ||
                  (typeof props?.value === "number" && props.value > 0) ||
                  props?.placeholder) &&
                  "pt-6",
                resetShown === false && "pr-3",
                props?.className
              )}
              onChange={(e) => {
                if (props?.onChange) {
                  props.onChange(e);
                }
                onChangeText(e.target.value, e);
              }}
              id={props?.id ?? id}
              onFocus={(e) => {
                if (props?.onFocus) {
                  props.onFocus(e);
                }
                setFocused(true);
              }}
              onBlur={(e) => {
                if (props?.onBlur) {
                  props.onBlur(e);
                }
                setFocused(false);
              }}
              ref={ref}
            />
            {resetShown !== false && (
              <label
                htmlFor={props?.id ?? id}
                className={twMerge(
                  "absolute z-1 top-[50%] right-2 size-5 flex justify-center items-center rounded-full bg-gray-50 text-gray-500 text-xs cursor-pointer hover:opacity-80 active:opacity-50 translate-y-[-50%]",
                  spanClassName
                )}
                onClick={() => {
                  onChangeText("");
                  focus();
                }}
              >
                <LuX />
              </label>
            )}
          </div>
          {message &&
            ((typeof props?.value === "string" && props?.value?.length > 0) ||
              (typeof props?.value === "number" && props.value > 0)) && (
              <label
                htmlFor={props?.id ?? id}
                className={twMerge(
                  "text-xs text-red-500 px-2",
                  messageClassName
                )}
              >
                {message}
              </label>
            )}
        </div>
      );
    },
    [focus, id, focused]
  );

  return { TextInput, focused, focus, ref, id };
}
