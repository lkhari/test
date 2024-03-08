// import { zodResolver } from "@hookform/resolvers/zod";
// import { Box, Button, Grid, Typography } from "@mui/material";
// import { TextField } from "mui-forms";
// import { FC } from "react";
// import { FormProvider, useForm, useFormContext } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import { ErrorMessage } from "src/shared/ErrorMessage";
// import { z } from "zod";
// import { VerificationCode } from "../components/VerificationCode";
// import { AuthService } from "../data/authService";
// import { AuthViewsMapWithProps, useAuthStore } from "../data/state";

// const password = z
//   .string()
//   .min(8, "Password must contain at least 8 characters")
//   .max(99, "Password must not exceed 99 characters")
//   .regex(
//     // eslint-disable-next-line no-useless-escape
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^\$\*\.\[\]\{\}\(\)\?\-\"!@#%&\/\\,><':;|_~\`\+\=])[a-zA-Z0-9\^\$\*\.\[\]\{\}\(\)\?\-\"!@#%&\/\\,><':;|_~\`\+\=]{6,99}$/,
//     "Password must contain 8 or more characters including one uppercase, one lowercase, one number, and one special case character",
//   );

// export const zodSchema = z
//   .object({
//     code: z.object({
//       char1: z.string().length(1),
//       char2: z.string().length(1),
//       char3: z.string().length(1),
//       char4: z.string().length(1),
//       char5: z.string().length(1),
//       char6: z.string().length(1),
//     }),
//     password,
//     confirmPassword: password,
//   })
//   .refine((obj) => obj.password === obj.confirmPassword, {
//     message: "Confirm password must match password",
//     path: ["confirmPassword"],
//   });

// function Errors() {
//   const { formState } = useFormContext<z.infer<typeof zodSchema>>();
//   return <ErrorMessage error={formState.errors?.root?.message} />;
// }

// export const ResetPassword: FC<AuthViewsMapWithProps["resetPassword"]["props"]> = ({ user }) => {
//   const auth = useAuthStore();

//   const { t } = useTranslation("auth");
//   const form = useForm({
//     mode: "onSubmit",
//     resolver: zodResolver(zodSchema),
//     defaultValues: {
//       code: { char1: "", char2: "", char3: "", char4: "", char5: "", char6: "" },
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const handlePasswordChange = () => {
//     const confirmPasswordState = form.getFieldState("confirmPassword");
//     if (confirmPasswordState.isDirty) {
//       form.trigger("confirmPassword");
//     }
//   };

//   return (
//     <FormProvider {...form}>
//       <form
//         onSubmit={form.handleSubmit(async ({ code, password }) => {
//           const [cognito, error] = await AuthService.confirmPassword(
//             user,
//             Object.values(code).join(""),
//             password,
//           );
//           if (cognito) {
//             auth.setView("login", {
//               email: cognito.getUsername(),
//               message: "Password reset successful.",
//             });
//             return;
//           }
//           form.setError("root", {
//             type: "manual",
//             message: t([error.name as "500", "500"]),
//           });
//         })}
//       >
//         <Box>
//           <Typography variant="body2">{t("EnterCodeBelow")}</Typography>
//         </Box>
//         <Box mt={1}>
//           <VerificationCode
//           // onChange={handleChange}
//           />
//         </Box>
//         <TextField
//           control={form.control}
//           label={t("Password")}
//           name="password"
//           type="password"
//           required
//           onChange={handlePasswordChange}
//         />
//         <TextField
//           control={form.control}
//           label={t("ConfirmPassword")}
//           name="confirmPassword"
//           type="password"
//           // onChange={handleChange}
//           required
//         />
//         <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
//           {t("RequestRecoveryCode")}
//         </Button>
//         <Errors />
//         <Grid container>
//           <Grid xs={12} item>
//             <Button
//               fullWidth
//               onClick={() => {
//                 auth.setView("login");
//               }}
//             >
//               {t("Back", { ns: "common" })}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </FormProvider>
//   );
// };
