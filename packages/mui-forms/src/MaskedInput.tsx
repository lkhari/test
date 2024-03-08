import {
  FormControl,
  Input as MUIInput,
  OutlinedInput,
  FilledInput,
  InputProps as MUIInputProps,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { CSSProperties, forwardRef } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldError,
  FieldValues,
  Path,
} from "react-hook-form";
import { IMaskInput } from "react-imask";

type MaskAndDefinitions = {
  mask: string;
  definitions: { [key: string]: RegExp };
};

interface InputProps {
  maskAndDefinitions: MaskAndDefinitions;
  style?: CSSProperties;
}

interface CustomProps extends InputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(props, ref) {
  const { onChange, maskAndDefinitions, ...other } = props;

  return (
    <IMaskInput
      {...other}
      {...maskAndDefinitions}
      inputRef={ref as any}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

type InputElementProps<T extends FieldValues> = Omit<MUIInputProps, "name" | "onChange"> & {
  validation?: ControllerProps["rules"];
  name: Path<T>;
  parseError?: (error: FieldError) => string;
  control: Control<T>;
  variant?: "filled" | "outlined" | "standard";
  onChange?: (value: string) => void;
  inputProps: InputProps;
  label?: string;
  error?: boolean;
  hiddenLabel?: boolean;
  uppercaseValue?: boolean;
};

export default function MaskedInput<TFieldValues extends FieldValues>({
  validation = {},
  parseError,
  type,
  required,
  name,
  control,
  variant = "standard",
  inputProps,
  label,
  error,
  fullWidth,
  hiddenLabel,
  size,
  margin,
  uppercaseValue,
  ...rest
}: InputElementProps<TFieldValues>): JSX.Element {
  if (required && !validation.required) {
    validation.required = "This field is required";
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={validation}
      render={({ field: { value, onChange, onBlur, ref }, fieldState }) => {
        const props: Omit<MUIInputProps, "inputProps"> & {
          inputProps: InputProps;
        } = {
          ...rest,
          name,
          id: name,
          value,
          onChange: (event) => {
            const newValue = uppercaseValue ? event.target.value.toUpperCase() : event.target.value;
            onChange(newValue);
            rest.onChange && rest.onChange(newValue);
          },
          onBlur,
          required,
          error: !!fieldState.error || error,
          fullWidth: true,
          inputRef: ref,
          inputComponent: TextMaskCustom as any,
          inputProps,
          "aria-describedby": `${name}-helper-text`,
        };

        return (
          <FormControl
            size={size}
            margin={margin}
            variant={variant}
            fullWidth={fullWidth}
            required={required}
            hiddenLabel={label === undefined || hiddenLabel}
          >
            {label && <InputLabel htmlFor={name}>{label}</InputLabel>}
            {variant === "outlined" ? (
              <OutlinedInput {...props} />
            ) : variant === "filled" ? (
              <FilledInput {...props} />
            ) : (
              <MUIInput {...props} />
            )}
            {!!fieldState.error && (
              <FormHelperText id={`${name}-helper-text`} error sx={{ mt: 1 }}>
                {fieldState.error.message || "Invalid input"}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
}
