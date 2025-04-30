import { useState } from "react";
import useTextInput from "./useTextInput";
import useSelect from "./useSelect";

type Props = {
  startDate: Date;
  endDate: Date | string;
  onSelectStartDate: (date: Date) => void;
  onSelectEndDate: (date: Date | string) => void;
};

export default function DatePicker({
  endDate,
  onSelectEndDate,
  onSelectStartDate,
  startDate,
}: Props) {
  const [end, setEnd] = useState("현재까지");
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

  const Start = useTextInput();
  const End = useTextInput();
  const SE = useSelect();
  return (
    <div className="flex-row gap-2">
      <Start.TextInput
        onChangeText={(value) => onSelectStartDate(new Date(value))}
        type="date"
        value={formatDate(startDate)}
        label="시작일"
        placeholder="1999.04.19"
        resetShown={false}
        containClassName="flex-1"
      />

      <div className="flex-1 gap-2">
        {isSelectingEndDate && (
          <End.TextInput
            onChangeText={(value) => {
              onSelectEndDate(
                typeof endDate === "string" ? value : new Date(value)
              );
            }}
            type="date"
            value={typeof endDate === "string" ? endDate : formatDate(endDate)}
            label="종료일"
            placeholder="1999.04.19"
            resetShown={false}
          />
        )}
        <SE.Component
          data={["현재까지", "직접 선택"]}
          onSelectOption={(option) => {
            setEnd(option);

            if (option === "직접 선택") {
              setIsSelectingEndDate(true);
              End.focus();
              return;
            } else {
              onSelectEndDate(option);
            }

            setIsSelectingEndDate(false);
          }}
          value={end}
        />
      </div>
    </div>
  );
}

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
};
