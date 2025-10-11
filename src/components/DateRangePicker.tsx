import { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  placeholderText?: string;
}

interface CustomInputProps {
  onClick?: () => void;
  displayText?: string;
  hasValue?: boolean;
  placeholderText?: string;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ onClick, displayText, hasValue, placeholderText }, ref) => {
    return (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        className={[
          "block w-full",
          "flex items-center gap-3",
          "px-4 h-12",
          "rounded-lg border-2 border-gray-200 bg-white",
          "text-gray-900 hover:border-blue-500 focus:border-blue-500 focus:outline-none",
          "transition-all group",
        ].join(" ")}
        aria-label={placeholderText}
      >
        <Calendar className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />

        <span
          className={[
            "min-w-0 flex-1 truncate font-medium text-sm text-left",
            hasValue ? "text-gray-900" : "text-gray-400",
          ].join(" ")}
        >
          {hasValue ? (displayText || "") : (placeholderText || "")}
        </span>

        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }
);
CustomInput.displayName = 'CustomInput';

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholderText = 'Select Date Range',
}: DateRangePickerProps) {
  const monthName = (m: number) => {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m];
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return '';
    if (startDate && !endDate) {
      return `${startDate.getDate()} ${monthName(startDate.getMonth())} ${startDate.getFullYear()}`;
    }
    if (startDate && endDate) {
      const sDay = startDate.getDate();
      const sMonth = monthName(startDate.getMonth());
      const sYear = startDate.getFullYear();
      const eDay = endDate.getDate();
      const eMonth = monthName(endDate.getMonth());
      const eYear = endDate.getFullYear();

      if (startDate.getMonth() === endDate.getMonth() && sYear === eYear) {
        return `${sDay} - ${eDay} ${sMonth} ${sYear}`;
      }
      return `${sDay} ${sMonth} ${sYear} - ${eDay} ${eMonth} ${eYear}`;
    }
    return '';
  };

  const hasValue = !!(startDate || endDate);

  const minDate = new Date('2025-08-06');
  const maxDate = new Date();

  return (
    <div className="relative w-full">
      <ReactDatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        wrapperClassName="block w-full"
        customInput={
          <CustomInput
            displayText={formatDateRange()}
            hasValue={hasValue}
            placeholderText={placeholderText}
          />
        }
        minDate={minDate}
        maxDate={maxDate}
        monthsShown={1}
        dateFormat="yyyy-MM-dd"
        calendarClassName="custom-datepicker"
        className="w-full"
        popperPlacement="bottom-start"
        showPopperArrow={false}
      />
    </div>
  );
}
