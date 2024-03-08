/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthError, resendSignUpCode, signIn } from "aws-amplify/auth";
import { Form, TextField } from "mui-forms";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "src/shared/ErrorMessage";
import { z } from "zod";

const zodSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string(),
});

type FieldType = z.infer<typeof zodSchema>;

function Errors() {
  const { formState } = useFormContext();
  return <ErrorMessage error={formState.errors?.root?.message} />;
}

function ForgotPasswordButton() {
  const { t } = useTranslation("auth");
  const { watch } = useFormContext<FieldType>();
  return (
    <Button
      fullWidth
      component={Link}
      to={"/auth/reset-password"}
      search={{ email: watch("email") }}
      mask={{ to: "/auth" }}
      params={{}}
    >
      {t("ForgotPassword")}
    </Button>
  );
}
function SignUpButton() {
  const { t } = useTranslation("auth");
  const { watch } = useFormContext<FieldType>();
  const { redirect } = Route.useSearch();
  return (
    <Button
      fullWidth
      component={Link}
      to={"/auth/signUp"}
      startTransition
      search={{ email: watch("email"), redirect }}
      mask={{ to: "/auth" }}
    >
      {t("CreateAccount")}
    </Button>
  );
}

// todo if error on root show in error field (FIND AND REPLACE)
const Login = () => {
  const { t } = useTranslation("auth");
  const { email, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("hi");
      const user = await signIn({ username: email, password, options: { clientMetadata: {} } });
      if (user.isSignedIn) {
        return navigate({ to: redirect || "/" });
      }
      if (user.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        resendSignUpCode({ username: email });
        return navigate({
          to: "/auth/signUp/confirmEmail",
          search: { email, redirect },
          mask: { to: "/auth" },
        });
      }
      if (user.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        // todo
      }
      if (user.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
        return navigate({
          to: "/auth/mfa",
          search: { email, redirect },
          mask: { to: "/auth" },
        });
      }
      console.log(user);
    },
    onError: (err) => {
      console.log(err);
      if (err instanceof AuthError) {
        if (err.name === "NotAuthorizedException") {
          form.setError("root", {
            type: "manual",
            message: t("NotAuthorizedException", "Incorrect details"),
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
    resolver: zodResolver(zodSchema),
    defaultValues: {
      email: email || "",
      password: "",
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
      <TextField
        label={t("Password")}
        required
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <Button sx={{ mt: 1 }} fullWidth variant="contained" type="submit">
        {t("SignIn")}
      </Button>
      <Errors />
      <Grid container>
        <Grid xs={5} item>
          <ForgotPasswordButton />
        </Grid>
        <Grid
          sx={{
            textAlign: "center",
            justifyContent: "center",
            alignContent: "center",
            display: "grid",
          }}
          xs={2}
          item
        >
          •
        </Grid>
        <Grid xs={5} item>
          <SignUpButton />
        </Grid>
      </Grid>
    </Form>
  );
};

export const Route = createFileRoute("/_unauthorized/auth/")({
  component: Login,
  validateSearch: (item) =>
    z
      .object({
        redirect: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(item),
});
