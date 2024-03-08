import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthError, resetPassword } from "aws-amplify/auth";
import { Form, TextField } from "mui-forms";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const ResetPassword = () => {
  const { email, redirect } = Route.useSearch();
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { nextStep } = await resetPassword({
        username: email,
        options: { clientMetadata: {} },
      });
      if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        return navigate({
          to: "/auth/reset-password/code",
          search: { email, redirect },
          mask: { to: "/auth" },
        });
      }
    },
    onError: (err) => {
      if (err instanceof AuthError) {
        if (err.name === "NotAuthorizedException") {
          form.setError("root", {
            type: "manual",
            message: t("TODO UNAUTH MESSAGe", "Incorrect details"),
          });
        }
        return;
      }
      form.setError("root", {
        type: "manual",
        message: t(["500", "500"]),
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(z.object({ email: z.string().trim().email().toLowerCase() })),
    defaultValues: {
      email: email || "",
    },
  });
  return (
    <Form
      formContext={form}
      onSuccess={(data) => {
        mutate.mutate(data);
      }}
    >
      <TextField
        required
        label={t("Email")}
        name="email"
        autoComplete="email"
        inputProps={{ style: { textTransform: "lowercase" } }}
      />
      <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
        {t("RequestRecoveryCode")}
      </Button>
      <Button
        fullWidth
        component={Link}
        mask={{ to: "/auth" }}
        to={"/auth"}
        search={{ email: form.watch("email"), redirect }}
      >
        {t("Back", { ns: "common" })}
      </Button>
    </Form>
  );
};

export const Route = createFileRoute("/_unauthorized/auth/reset-password/")({
  component: ResetPassword,
  validateSearch: (item) => {
    return z
      .object({
        redirect: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(item);
  },
});
