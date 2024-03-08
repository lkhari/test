import { createContext, PropsWithChildren, useContext } from "react";
import { FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type FormErrorProviderProps = {
  onError: (error: FieldError) => string | undefined;
};

const FormErrorProviderContext = createContext<FormErrorProviderProps>({
  onError: (error) => error?.message,
});

export default function FormErrorProvider({
  onError,
  children,
}: PropsWithChildren<FormErrorProviderProps>) {
  return (
    <FormErrorProviderContext.Provider value={{ onError }}>
      {children}
    </FormErrorProviderContext.Provider>
  );
}

export const useFormError = () => {
  const { t } = useTranslation("errors");
  const errorCtx = useContext<FormErrorProviderProps>(FormErrorProviderContext);
  if (errorCtx?.onError !== undefined) {
    return (err: FieldError) => {
      const errorMessage = errorCtx.onError(err);
      return errorMessage && t(errorMessage as "DATES_EARLY");
    };
  }
  return errorCtx?.onError;
};
