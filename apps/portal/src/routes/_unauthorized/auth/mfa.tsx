import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthError, confirmSignIn } from "aws-amplify/auth";
import { Form, TextField } from "mui-forms";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "src/shared/ErrorMessage";
import { z } from "zod";

const zodSchema = z.object({
  challengeResponse: z.string(),
});

function Errors() {
  const { formState } = useFormContext();
  return <ErrorMessage error={formState.errors?.root?.message} />;
}

const Mfa = () => {
  const { t } = useTranslation("auth");
  const { redirect } = Route.useSearch();
  const navigate = useNavigate({});
  const mutate = useMutation({
    mutationFn: async ({ challengeResponse }: { challengeResponse: string }) => {
      const user = await confirmSignIn({
        challengeResponse,
      });
      if (user.isSignedIn && user.nextStep.signInStep === "DONE") {
        return navigate({ to: redirect || "/" });
      }
    },
    onError: (err) => {
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
      challengeResponse: "",
    },
  });
  return (
    <Form
      formContext={form}
      onSuccess={(data) => {
        mutate.mutate(data);
      }}
    >
      <TextField label={t("Code")} name="challengeResponse" required margin="dense" size="small" />
      <Button sx={{ mt: 1 }} fullWidth variant="contained" type="submit">
        {t("SignIn")}
      </Button>
      <Errors />
    </Form>
  );
};

export const Route = createFileRoute("/_unauthorized/auth/mfa")({
  component: Mfa,
  validateSearch: (item) =>
    z
      .object({
        redirect: z.string().optional(),
        email: z.string().optional(),
      })
      .parse(item),
});
