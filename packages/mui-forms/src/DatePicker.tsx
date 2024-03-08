import {
  DatePicker,
  DatePickerProps,
  DatePickerSlotsComponentsProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  Control,
  FieldError,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { TextFieldProps, useForkRef } from "@mui/material";
import { useFormError } from "./FormErrorProvider";
import { forwardRef, ReactNode, Ref, RefAttributes } from "react";
import { DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";
import { useLocalizationContext, validateDate } from "@mui/x-date-pickers/internals";
import useTransform from "./useTransform";

export type DatePickerElementProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
> = Omit<DatePickerProps<TValue>, "value" | "slotProps"> & {
  name: TName;
  required?: boolean;
  isDate?: boolean;
  parseError?: (error: FieldError | DateValidationError) => ReactNode;
  validation?: UseControllerProps<TFieldValues, TName>["rules"];
  control?: Control<TFieldValues>;
  inputProps?: TextFieldProps;
  helperText?: TextFieldProps["helperText"];
  textReadOnly?: boolean;
  slotProps?: Omit<DatePickerSlotsComponentsProps<TValue>, "textField">;
  transform?: {
    input?: (value: PathValue<TFieldValues, TName>) => TValue | null;
    output?: (
      value: TValue | null,
      context: PickerChangeHandlerContext<DateValidationError>,
    ) => PathValue<TFieldValues, TName>;
  };
};

type DatePickerElementComponent = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: DatePickerElementProps<TFieldValues, TName, TValue> & RefAttributes<HTMLDivElement>,
) => JSX.Element;

const DatePickerElement = forwardRef(function DatePickerElement<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: DatePickerElementProps<TFieldValues, TName, TValue>,
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

        const internalError = validateDate({
          props: {
            shouldDisableDate: rest.shouldDisableDate,
            shouldDisableMonth: rest.shouldDisableMonth,
            shouldDisableYear: rest.shouldDisableYear,
            disablePast: Boolean(rest.disablePast),
            disableFuture: Boolean(rest.disableFuture),
            minDate: rest.minDate,
            maxDate: rest.maxDate,
            timezone: rest.timezone ?? inputTimezone ?? "default",
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
    control,
    rules,
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
      output: typeof transform?.output === "function" ? transform.output : (newValue) => newValue,
    },
  });

  const handleInputRef = useForkRef(field.ref, inputRef);

  const errorMessage = error
    ? typeof customErrorFn === "function"
      ? customErrorFn(error)
      : error.message
    : null;

  return (
    <DatePicker
      {...rest}
      {...field}
      value={value}
      ref={ref}
      inputRef={handleInputRef}
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
          onBlur: (event) => {
            field.onBlur();
            if (typeof inputProps?.onBlur === "function") {
              inputProps.onBlur(event);
            }
          },
          error: !!errorMessage,
          helperText: errorMessage ? errorMessage : inputProps?.helperText || rest.helperText,
          inputProps: {
            readOnly: !!textReadOnly,
            ...inputProps?.inputProps,
          },
        },
      }}
    />
  );
});
DatePickerElement.displayName = "DatePickerElement";
export default DatePickerElement as DatePickerElementComponent;
