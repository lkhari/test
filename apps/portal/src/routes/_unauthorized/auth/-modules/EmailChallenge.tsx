// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button, Typography } from "@mui/material";
// import { TextField } from "mui-forms";
// import { FC, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import * as z from "zod";
// import { AuthService } from "../data/authService";
// import { AuthViewsMapWithProps, useAuthStore } from "../data/state";

// export const zodSchema = z.object({
//   code: z.string().min(6, "Authentication code must be at least 6 digits long"),
// });

// const Challenge: FC<AuthViewsMapWithProps["emailChallenge"]["props"]> = ({ user }) => {
//   const { t } = useTranslation(["auth", "common"]);
//   const auth = useAuthStore();

//   const { control, handleSubmit } = useForm({
//     mode: "onSubmit",
//     resolver: zodResolver(
//       z.object({
//         code: z.string().min(6, "Authentication code must be at least 6 digits long"),
//       }),
//     ),
//     defaultValues: { code: "" },
//   });

//   useEffect(() => {
//     AuthService.answerChallenge(user, "SEND_EMAIL");
//   }, [user]);

//   return (
//     <>
//       <Typography color={(theme) => theme.palette.grey[500]} variant="subtitle1">
//         {t("LetVerifyEmail")}
//       </Typography>
//       <Typography mb={2} color={(theme) => theme.palette.grey[500]} variant="subtitle2">
//         {t("LetVerifyEmail.Description")}
//       </Typography>
//       <form
//         onSubmit={(e) =>
//           handleSubmit(async (event) => {
//             await AuthService.answerChallenge(user, event.code);
//             auth.setUser(await AuthService.convertCognitoUser(user, auth.setUser));
//           })(e)
//         }
//       >
//         <TextField
//           control={control}
//           label={t("Code")}
//           name="code"
//           required
//           margin="dense"
//           size="small"
//         />
//         <Button sx={{ mt: 1 }} type="submit" variant="contained" fullWidth>
//           {t("Verify")}
//         </Button>
//       </form>
//     </>
//   );
// };

// export default Challenge;
