// import { zodResolver } from "@hookform/resolvers/zod";
// import { Box, Button, Typography } from "@mui/material";
// import { TextField } from "mui-forms";
// import { FC } from "react";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import * as z from "zod";
// import { AuthService } from "../data/authService";
// import { AuthViewsMapWithProps, useAuthStore } from "../data/state";

// export const zodSchema = z.object({
//   code: z.string().min(6, "Authentication code must be at least 6 digits long"),
// });

// const Challenge: FC<AuthViewsMapWithProps["challenge"]["props"]> = ({ user }) => {
//   const { t } = useTranslation("auth");
//   const auth = useAuthStore();

//   const { control, handleSubmit } = useForm({
//     mode: "onSubmit",
//     resolver: zodResolver(zodSchema),
//     defaultValues: { code: "" },
//   });

//   return (
//     <Box>
//       <Typography variant="body2">{t("EnterAuthenticatorCodeBelow")}</Typography>
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
//     </Box>
//   );
// };

// export default Challenge;
