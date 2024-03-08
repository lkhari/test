import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthError, autoSignIn, confirmSignUp } from "aws-amplify/auth";
import { ErrorMessage, Form, TextField } from "mui-forms";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const ConfirmEmail = () => {
  const { email, redirect } = Route.useSearch();
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  const mutate = useMutation({
    mutationFn: async (data: { email: string; confirmationCode: string }) => {
      const { nextStep } = await confirmSignUp({
        username: data.email || email || "",
        confirmationCode: data.confirmationCode,
        options: {
          forceAliasCreation: true,
        },
      });
      if (nextStep.signUpStep === "DONE") {
        navigate({ to: redirect || "/" });
      }
      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        const { isSignedIn, nextStep } = await autoSignIn();
        navigate({ to: redirect || "/" });
      }
    },
    onError: (err) => {
      if (err instanceof AuthError) {
        form.setError("root", {
          type: "manual",
          message: t([err.name, "500"], "error"),
        });
        return;
      }
      form.setError("root", {
        type: "manual",
        message: t(["500", "500"]),
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email().toLowerCase().optional(),
        confirmationCode: z.string().min(1, "REQUIRED"),
      }),
    ),
    defaultValues: {
      email: email || "",
      confirmationCode: "",
    },
  });
  return (
    <Form
      formContext={form}
      onSuccess={(data) => {
        mutate.mutate(data);
      }}
    >
      {!email && (
        <TextField
          required
          label={t("Email")}
          name="email"
          autoComplete="email"
          inputProps={{ style: { textTransform: "lowercase" } }}
        />
      )}
      <TextField label={t("ConfirmationCode")} required name="confirmationCode" />
      <ErrorMessage />
      <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
        {t("CreateAccount")}
      </Button>
      <Grid container>
        <Grid xs={12} item>
          <Button
            fullWidth
            component={Link}
            to={"/auth"}
            mask={{ to: "/auth" }}
            search={{ email: form.watch("email"), redirect }}
          >
            {t("Back", { ns: "common" })}
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export const Route = createFileRoute("/_unauthorized/auth/signUp/confirmEmail")({
  component: ConfirmEmail,
  validateSearch: (item) => {
    return z
      .object({
        redirect: z.string().optional(),
        confirmationCode: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(item);
  },
});
