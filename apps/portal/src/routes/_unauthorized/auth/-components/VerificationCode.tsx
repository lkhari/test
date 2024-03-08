import { Box, FormControl, FormHelperText, InputLabel, useTheme } from "@mui/material";
import { MaskedInput } from "mui-forms";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const VerificationCode: FC<{
  onChange?: () => void;
}> = ({ onChange }) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const { setFocus, setValue, control } = useFormContext();
  const styles = {
    content: {
      display: "flex",
      flexGrow: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    introPara: {
      marginBottom: theme.spacing(2),
    },
    codeControl: { mt: 2 },
    codeInputs: { pt: 2, display: "flex", justifyContent: "space-between" },
    codeInputWrapper: { width: 40 },
    errorMessage: { mt: 1 },
    button: {
      marginTop: theme.spacing(3),
    },
    textLinks: {
      marginTop: theme.spacing(4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  };

  return (
    <Controller
      name="code"
      control={control}
      rules={{ required: "This field is required" }}
      render={({ fieldState: { error } }) => (
        <FormControl fullWidth required error={!!error} sx={styles.codeControl}>
          <InputLabel shrink={true}>{t("Code")}</InputLabel>
          <Box sx={styles.codeInputs}>
            {[1, 2, 3, 4, 5, 6].map((inputNumber) => (
              <Box key={`char${inputNumber}`} sx={styles.codeInputWrapper}>
                <MaskedInput
                  control={control}
                  name={`code.char${inputNumber}`}
                  margin="dense"
                  size="small"
                  variant="filled"
                  error={!!error}
                  required
                  placeholder="0"
                  inputProps={{
                    maskAndDefinitions: {
                      definitions: {
                        "#": /[0-9]/,
                      },
                      mask: "#",
                    },
                    style: { textAlign: "center" },
                  }}
                  onChange={(value) => {
                    onChange && onChange();
                    if (value === "") {
                      return;
                    }
                    if (inputNumber < 6) {
                      setFocus(`code.char${inputNumber + 1}`);
                    }
                  }}
                  onPaste={(event) => {
                    event.preventDefault();

                    const pastedText = event.clipboardData.getData("text");
                    if (pastedText.length === 6 && Number.isInteger(Number(pastedText))) {
                      setValue("code.char1", pastedText.charAt(0));
                      setValue("code.char2", pastedText.charAt(1));
                      setValue("code.char3", pastedText.charAt(2));
                      setValue("code.char4", pastedText.charAt(3));
                      setValue("code.char5", pastedText.charAt(4));
                      setValue("code.char6", pastedText.charAt(5));
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
          {error && (
            <FormHelperText error sx={styles.errorMessage}>
              Invalid code
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
