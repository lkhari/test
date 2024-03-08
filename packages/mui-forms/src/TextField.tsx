import { TextField, TextFieldProps, useForkRef } from "@mui/material";
import {
  Control,
  FieldError,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import { useFormError } from "./FormErrorProvider";
import { ChangeEvent, forwardRef, ReactNode, Ref, RefAttributes } from "react";
import useTransform from "./useTransform";

export type TextFieldElementProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
> = Omit<TextFieldProps, "name"> & {
  validation?: UseControllerProps<TFieldValues, TName>["rules"];
  name: TName;
  parseError?: (error: FieldError) => ReactNode;
  control?: Control<TFieldValues>;
  /**
   * You override the MUI's TextField component by passing a reference of the component you want to use.
   *
   * This is especially useful when you want to use a customized version of TextField.
   */
  component?: typeof TextField;
  transform?: {
    input?: (value: PathValue<TFieldValues, TName>) => TValue;
    output?: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => PathValue<TFieldValues, TName>;
  };
};

type TextFieldElementComponent = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: TextFieldElementProps<TFieldValues, TName, TValue> & RefAttributes<HTMLDivElement>,
) => JSX.Element;

const TextFieldElement = forwardRef(function TextFieldElement<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TValue = unknown,
>(
  props: TextFieldElementProps<TFieldValues, TName, TValue>,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const {
    validation = {},
    parseError,
    type,
    required,
    name,
    control,
    component: TextFieldComponent = TextField,
    inputRef,
    transform,
    ...rest
  } = props;

  const errorMsgFn = useFormError();
  const customErrorFn = parseError || errorMsgFn;

  const rules = {
    ...validation,
    ...(required && !validation.required && { required: "This field is required" }),
    ...(type === "email" &&
      !validation.pattern && {
        pattern: {
          value:
            // eslint-disable-next-line no-useless-escape
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "Please enter a valid email address",
        },
      }),
  };
  const { trigger } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    disabled: rest.disabled,
    rules,
  });

  const { value, onChange } = useTransform<TFieldValues, TName, TValue>({
    value: field.value,
    onChange: field.onChange,
    transform: {
      input:
        typeof transform?.input === "function"
          ? transform.input
          : (value) => {
              return value || ("" as TValue);
            },
      output:
        typeof transform?.output === "function"
          ? transform.output
          : (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const value = event.target.value;
              return (type === "number" && value ? +value : value) as PathValue<
                TFieldValues,
                TName
              >;
            },
    },
  });

  const handleInputRef = useForkRef(field.ref, inputRef);

  return (
    <TextFieldComponent
      {...rest}
      margin="dense"
      size="small"
      name={field.name}
      value={value}
      sx={{ width: 300, ...(rest.sx || {}) }}
      onChange={(event) => {
        onChange(event);
        if (typeof rest.onChange === "function") {
          rest.onChange(event);
        }
      }}
      onBlur={field.onBlur}
      required={required}
      type={type}
      error={!!error}
      helperText={
        error
          ? typeof customErrorFn === "function"
            ? customErrorFn(error)
            : error.message
          : rest.helperText
      }
      ref={ref}
      inputRef={handleInputRef}
    />
  );
});
TextFieldElement.displayName = "TextFieldElement";

export default TextFieldElement as TextFieldElementComponent;
