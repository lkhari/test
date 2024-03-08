import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthError, confirmResetPassword } from "aws-amplify/auth";
import { Form, TextField } from "mui-forms";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
// import { MuiOtpInput } from "mui-one-time-password-input";

const ResetPassword = () => {
  const { email, redirect } = Route.useSearch();
  const { t } = useTranslation(["auth", "common"]);
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async ({
      newPassword,
      confirmationCode,
    }: {
      confirmationCode: string;
      newPassword: string;
    }) => {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
      navigate({ to: "/auth", search: { redirect, email }, mask: { to: "/auth" } });
    },
    onError: (err) => {
      if (err instanceof AuthError) {
        console.log(err.name === "CodeMismatchException");
        console.log(err.name);
        if (err.name === "CodeMismatchException") {
          form.setError("confirmationCode", {
            type: "manual",
            message: t(["NotAuthorizedException", "500"]),
          });
          return;
        }
        form.setError("root", {
          type: "manual",
          message: t(["500", "500"]),
        });
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          newPassword: z.string().min(1, "REQUIRED"),
          confirmPassword: z.string().min(1, "REQUIRED"),
          confirmationCode: z.string().min(1, "REQUIRED"),
        })
        .superRefine(({ newPassword, confirmPassword }, ctx) => {
          if (newPassword !== confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["confirmPassword"],
              message: t("PASSWORD_MUST_MATCH"),
            });
          }
        }),
    ),
    defaultValues: {
      confirmationCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  return (
    <Form formContext={form} onSuccess={(data) => mutate.mutate(data)}>
      <Box>
        <Typography variant="body2">{t("EnterCodeBelow")}</Typography>
      </Box>
      <TextField label={t("Code")} required name="confirmationCode" />
      <TextField
        label={t("Password")}
        required
        name="newPassword"
        type="password"
        autoComplete="new-password"
      />
      <TextField required label={t("ConfirmPassword")} name="confirmPassword" type="password" />
      <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
        {t("submit", { ns: "common" })}
      </Button>
      <Button fullWidth component={Link} to={"/auth"} search={{ email }}>
        {t("Back", { ns: "common" })}
      </Button>
    </Form>
  );
};

export const Route = createFileRoute("/_unauthorized/auth/reset-password/code")({
  component: ResetPassword,
  validateSearch: (item) => {
    return z
      .object({
        redirect: z.string().optional(),
        email: z.string(),
      })
      .parse(item);
  },
});
