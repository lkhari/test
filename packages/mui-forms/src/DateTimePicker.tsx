import {
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerSlotsComponentsProps,
} from "@mui/x-date-pickers/DateTimePicker";
import {
  Control,
  FieldError,
  FieldPath,
  PathValue,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { TextFieldProps, useForkRef } from "@mui/material";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { useFormError } from "./FormErrorProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { forwardRef, ReactNode, Ref, RefAttributes } from "react";
import { useLocalizationContext, validateDateTime } from "@mui/x-date-pickers/internals";
import useTransform from "./useTransform";
import { DateTimeValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";

export type DateTimePickerElementProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
> = Omit<DateTimePickerProps<TValue>, "value" | "slotProps"> & {
  name: TName;
  required?: boolean;
  isDate?: boolean;
  parseError?: (error: FieldError) => ReactNode;
  validation?: UseControllerProps<TFieldValues, TName>["rules"];
  control?: Control<TFieldValues>;
  inputProps?: TextFieldProps;
  helperText?: TextFieldProps["helperText"];
  textReadOnly?: boolean;
  slotProps?: Omit<DateTimePickerSlotsComponentsProps<TValue>, "textField">;
  transform?: {
    input?: (value: PathValue<TFieldValues, TName>) => TValue | null;
    output?: (
      value: TValue | null,
      context: PickerChangeHandlerContext<DateTimeValidationError>,
    ) => PathValue<TFieldValues, TName>;
  };
};

type DateTimePickerElementComponent = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: DateTimePickerElementProps<TFieldValues, TName, TValue> & RefAttributes<HTMLDivElement>,
) => JSX.Element;

const DateTimePickerElement = forwardRef(function DateTimePickerElement<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: DateTimePickerElementProps<TFieldValues, TName, TValue>,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const {
    parseError,
    name,
    required,
    validation = {},
    inputProps,
    control,
    textReadOnly,
    slotProps,
    inputRef,
    transform,
    ...rest
  } = props;

  const adapter = useLocalizationContext();

  const errorMsgFn = useFormError();
  const customErrorFn = parseError || errorMsgFn;
  const rules = {
    ...validation,
    ...(required &&
      !validation.required && {
        required: "This field is required",
      }),
    validate: {
      internal: (value: TValue | null) => {
        const inputTimezone =
          value == null || !adapter.utils.isValid(value) ? null : adapter.utils.getTimezone(value);

        const internalError = validateDateTime({
          props: {
            shouldDisableDate: rest.shouldDisableDate,
            shouldDisableMonth: rest.shouldDisableMonth,
            shouldDisableYear: rest.shouldDisableYear,
            disablePast: Boolean(rest.disablePast),
            disableFuture: Boolean(rest.disableFuture),
            minDate: rest.minDate,
            maxDate: rest.maxDate,
            timezone: rest.timezone ?? inputTimezone ?? "default",
            disableIgnoringDatePartForTimeValidation: rest.disableIgnoringDatePartForTimeValidation,
            maxTime: rest.maxTime,
            minTime: rest.minTime,
            minutesStep: rest.minutesStep,
            shouldDisableTime: rest.shouldDisableTime,
          },
          value,
          adapter,
        });

        return internalError == null || internalError;
      },
      ...validation.validate,
    },
  };

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    rules,
    control,
    disabled: rest.disabled,
    defaultValue: null as PathValue<TFieldValues, TName>,
  });

  const { value, onChange } = useTransform<TFieldValues, TName, TValue | null>({
    value: field.value,
    onChange: field.onChange,
    transform: {
      input:
        typeof transform?.input === "function"
          ? transform.input
          : (newValue) => {
              return newValue && newValue === "string"
                ? (new Date(newValue) as TValue) // need to see if this works for all localization adaptors
                : newValue;
            },
      output:
        typeof transform?.output === "function"
          ? transform.output
          : (newValue: TValue | null) => newValue as PathValue<TFieldValues, TName>,
    },
  });

  const handleInputRef = useForkRef(field.ref, inputRef);

  return (
    <DateTimePicker
      sx={{ width: 300 }}
      {...rest}
      {...field}
      value={value}
      ref={ref}
      inputRef={handleInputRef}
      viewRenderers={{
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
        seconds: renderTimeViewClock,
      }}
      onClose={(...args) => {
        field.onBlur();
        if (rest.onClose) {
          rest.onClose(...args);
        }
      }}
      onChange={(newValue, context) => {
        onChange(newValue, context);
        if (typeof rest.onChange === "function") {
          rest.onChange(newValue, context);
        }
      }}
      slotProps={{
        ...slotProps,
        textField: {
          size: "small",
          ...inputProps,
          required,
          error: !!error,
          helperText: error
            ? typeof customErrorFn === "function"
              ? customErrorFn(error)
              : error.message
            : inputProps?.helperText || rest.helperText,
          inputProps: {
            readOnly: textReadOnly,
            ...inputProps?.inputProps,
          },
        },
      }}
    />
  );
});
DateTimePickerElement.displayName = "DateTimePickerElement";
export default DateTimePickerElement as DateTimePickerElementComponent;
