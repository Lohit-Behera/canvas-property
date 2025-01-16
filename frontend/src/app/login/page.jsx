"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/password-input";
import { toast } from "sonner";
import {
  fetchLogin,
  fetchGoogleAuth,
  fetchFacebookAuth,
} from "@/lib/features/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatchWithToast } from "@/hooks/dispatch";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Facebook, LogIn } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
function Login() {
  const router = useRouter();

  const userInfo = useSelector((state) => state.user.userInfo);

  useLayoutEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useDispatchWithToast(fetchLogin, {
    loadingMessage: "Logging in...",
    getSuccessMessage: (data) => data.message || "Logged in successfully",
    getErrorMessage: (error) =>
      error.message || error || "Something went wrong while logging in",
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
  });

  function onSubmit(values) {
    login(values);
  }

  const loginWithGoogle = useDispatchWithToast(fetchGoogleAuth, {
    loadingMessage: "Logging in...",
    getSuccessMessage: (data) => data.message || "Logged in successfully",
    getErrorMessage: (error) =>
      error.message || error || "Something went wrong while logging in",
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
  });

  const responseGoogle = (authResponse) => {
    try {
      if (authResponse.code === undefined) {
        toast.error("Failed to Sign Up with Google. Please try again later.");
        return;
      }
      loginWithGoogle(authResponse.code);
    } catch (error) {
      toast.error("Failed to Sign Up with Google. Please try again later.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const facebookLogin = useDispatchWithToast(fetchFacebookAuth, {
    loadingMessage: "Logging in...",
    getSuccessMessage: (data) => data.message || "Logged in successfully",
    getErrorMessage: (error) =>
      error.message || error || "Something went wrong while logging in",
    onSuccess: () => {
      form.reset();
      router.push("/");
    },
  });

  const handleFacebookLogin = (res) => {
    console.log("Login Success!", res);
    facebookLogin(res.accessToken);
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size="sm" type="submit">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>
        </Form>
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={googleLogin}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="google"
            className="mr-2 h-4 w-4 fill-zinc-950 dark:fill-zinc-50"
          >
            <path d="m12 10.282h11.328c.116.6.184 1.291.187 1.997v.003c.001.066.002.144.002.222 0 2.131-.527 4.139-1.457 5.901l.033-.069c-.941 1.762-2.324 3.18-4.004 4.137l-.051.027c-1.675.945-3.677 1.502-5.809 1.502-.081 0-.162-.001-.242-.002h.012c-.013 0-.029 0-.044 0-1.672 0-3.263-.348-4.704-.975l.076.03c-2.902-1.219-5.164-3.482-6.354-6.306l-.029-.077c-.598-1.379-.945-2.985-.945-4.672s.348-3.293.975-4.75l-.03.078c1.219-2.902 3.482-5.164 6.306-6.354l.077-.029c1.364-.597 2.953-.944 4.624-.944h.051-.003c.059-.001.129-.002.199-.002 3.045 0 5.811 1.197 7.853 3.147l-.004-.004-3.266 3.141c-1.188-1.152-2.81-1.863-4.598-1.863-.065 0-.129.001-.194.003h.009c-.014 0-.03 0-.047 0-1.358 0-2.629.378-3.711 1.034l.032-.018c-2.246 1.358-3.725 3.788-3.725 6.562s1.479 5.204 3.691 6.543l.034.019c1.051.638 2.321 1.016 3.679 1.016h.05-.003.083c.864 0 1.695-.137 2.474-.392l-.056.016c.716-.222 1.339-.542 1.893-.95l-.017.012c.486-.373.907-.794 1.268-1.264l.012-.016c.312-.393.582-.841.79-1.321l.015-.039c.149-.35.271-.759.346-1.184l.005-.035h-6.811z"></path>
          </svg>
          Login with Google
        </Button>
        <FacebookLogin
          appId={process.env.NEXT_PUBLIC_FB_APP_ID}
          onSuccess={(response) => {
            handleFacebookLogin(response);
          }}
          onFail={(error) => {
            toast.error(error.status);
          }}
          onProfileSuccess={(response) => {
            console.log("Get Profile Success!", response);
          }}
          render={({ onClick, logout }) => (
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={onClick}
            >
              <Facebook
                strokeWidth={0.75}
                className="mr-2 h-4 w-4 fill-foreground"
              />
              Login with Facebook
            </Button>
          )}
        />
      </CardContent>
    </Card>
  );
}

export default Login;
