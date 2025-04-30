import { ChangeEvent, ComponentProps, useCallback, useId, useRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  data: string[];
  label?: string;
  onSelectOption: (
    value: string,
    event: ChangeEvent<HTMLSelectElement>
  ) => void;
  containerClassName?: string;
  labelClassName?: string;
  placeholder?: string;
} & ComponentProps<"select">;

export default function useSelect() {
  const ref = useRef<HTMLSelectElement>(null);
  const focus = useCallback(
    () => setTimeout(() => ref.current?.focus(), 100),
    []
  );
  const show = useCallback(
    () => setTimeout(() => ref.current?.showPicker(), 100),
    []
  );

  const id = useId();
  const Component = useCallback(
    ({
      data,
      label,
      labelClassName,
      containerClassName,
      onSelectOption,
      placeholder,
      ...props
    }: Props) => {
      return (
        <div className={twMerge("gap-1", containerClassName)}>
          {label && (
            <label
              htmlFor={props?.id ?? id}
              className={twMerge(" text-xs text-gray-500", labelClassName)}
            >
              {label}
            </label>
          )}
          <select
            {...props}
            onChange={(e) => onSelectOption(e.target.value, e)}
            id={props?.id ?? id}
            ref={ref}
            className={twMerge(
              "border border-border rounded-full p-3 pr-9 h-12 bg-transparent outline-none focus:border-theme",
              props?.className
            )}
          >
            <option value="">{placeholder ?? "선택"}</option>
            {data.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    },
    [id]
  );

  return { id, ref, show, focus, Component };
}
