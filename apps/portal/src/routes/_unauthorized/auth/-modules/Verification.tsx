// import { zodResolver } from "@hookform/resolvers/zod";
// import { Box, Button, Grid, Typography } from "@mui/material";
// import { FC } from "react";
// import { FormProvider, useForm, useFormContext } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { z } from "zod";
// import { ErrorMessage } from "../../../shared/ErrorMessage";
// import useRenders from "../../../shared/useRenders";
// import { VerificationCode } from "../components/VerificationCode";
// import { AuthService } from "../data/authService";
// import { AuthViewsMapWithProps, useAuthStore } from "../data/state";

// const schema = z.object({
//   code: z.object({
//     char1: z.string().length(1),
//     char2: z.string().length(1),
//     char3: z.string().length(1),
//     char4: z.string().length(1),
//     char5: z.string().length(1),
//     char6: z.string().length(1),
//   }),
// });

// function Errors() {
//   const { formState } = useFormContext<z.infer<typeof schema>>();
//   return <ErrorMessage error={formState.errors?.root?.message} />;
// }

// export const Verification: FC<AuthViewsMapWithProps["verification"]["props"]> = ({ email }) => {
//   const auth = useAuthStore();
//   const { t } = useTranslation(["auth", "common"]);
//   const renderCount = useRenders();

//   const form = useForm({
//     mode: "onSubmit",
//     resolver: zodResolver(schema),
//     defaultValues: { code: { char1: "", char2: "", char3: "", char4: "", char5: "", char6: "" } },
//   });

//   return (
//     <Box>
//       <Typography variant="body2">{t("EnterCodeBelow")}</Typography>
//       <FormProvider {...form}>
//         <form
//           onSubmit={form.handleSubmit(async ({ code }) => {
//             const [cognitoUser, error] = await AuthService.confirmSignUp(
//               email,
//               Object.values(code).join(""),
//             );
//             if (cognitoUser) {
//               const user = await AuthService.convertCognitoUser(cognitoUser, auth.setUser);
//               auth.setUser(user);
//               return;
//             }
//             form.setError("root", {
//               type: "manual",
//               message: t([error.name as "500", "500"]),
//             });
//           })}
//         >
//           <VerificationCode />
//           <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
//             {t("common:submit")}
//           </Button>
//           <Errors />
//         </form>
//         {renderCount}
//         <Grid container>
//           <Grid xs={12} item>
//             <Typography
//               sx={{ textAlign: "center" }}
//               onClick={() => {
//                 auth.setView("login");
//               }}
//             >
//               {t("common:Back")}
//             </Typography>
//           </Grid>
//         </Grid>
//       </FormProvider>
//     </Box>
//   );
// };
