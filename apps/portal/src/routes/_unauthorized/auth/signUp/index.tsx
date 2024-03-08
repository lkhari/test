import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Grid } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AuthError, autoSignIn, signUp } from "aws-amplify/auth";
import { ErrorMessage, Form, TextField } from "mui-forms";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import PasswordElement from "../-components/Password";

const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
const containsLowercase = (ch: string) => /[a-z]/.test(ch);
const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

const SignUp = () => {
  const { email, redirect } = Route.useSearch();
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const mutate = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          autoSignIn: true,
          userAttributes: {
            name: name,
            email: email,
          },
        },
      });
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        navigate({
          to: "/auth/signUp/confirmEmail",
          search: { email, redirect },
          mask: { to: "/auth" },
        });
        return;
      }
      if (nextStep.signUpStep === "DONE") {
        autoSignIn();
        navigate({ to: redirect || "/" });
        return;
      }
      if (nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN") {
        navigate({ to: redirect || "/" });
      }
    },
    onError: (err) => {
      if (err instanceof AuthError) {
        form.setError("root", {
          type: "manual",
          message: t(err.name, "500"),
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
      z
        .object({
          name: z.string().min(1, "REQUIRED"),
          email: z.string().trim().email().toLowerCase(),
          password: z.string().refine(
            (password) => {
              if (!containsUppercase(password)) {
                return false;
              }
              if (!containsLowercase(password)) {
                return false;
              }
              if (!containsSpecialChar(password)) {
                return false;
              }
              return 8 <= password.length;
            },
            { message: t("PasswordRequirements") },
          ),
          confirmPassword: z.string(),
        })
        .superRefine(({ password, confirmPassword }, ctx) => {
          if (password !== confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["confirmPassword"],
              message: t("PasswordMustMatch"),
            });
          }
        }),
    ),
    mode: "onTouched",

    defaultValues: {
      name: "",
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });
  return (
    <Form
      formContext={form}
      onSuccess={(data) => {
        mutate.mutate(data);
      }}
    >
      <TextField required label={t("FullName")} name="name" autoComplete="name" />
      <TextField
        required
        label={t("Email")}
        name="email"
        autoComplete="email"
        inputProps={{ style: { textTransform: "lowercase" } }}
      />
      <PasswordElement
        label={t("Password")}
        required
        name="password"
        type="password"
        autoComplete="new-password"
      />
      <PasswordElement
        required
        label={t("ConfirmPassword")}
        name="confirmPassword"
        type="password"
      />
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

export const Route = createFileRoute("/_unauthorized/auth/signUp/")({
  component: SignUp,
  validateSearch: (item) => {
    return z
      .object({
        redirect: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(item);
  },
});
