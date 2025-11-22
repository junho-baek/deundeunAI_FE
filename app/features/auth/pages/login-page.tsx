import { Link, Form, type MetaFunction, type ActionFunctionArgs, redirect, useNavigation } from "react-router";
import { z } from "zod";

import FormButton from "~/common/components/form-button";
import FormErrors from "~/common/components/form-error";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { SignInButtons } from "../components/auth-login-buttons";
import { makeSSRClient } from "~/lib/supa-client";
import type { Route } from "./+types/login-page";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 로그인",
    },
    {
      name: "description",
      content:
        "든든AI 계정으로 로그인하고 콘텐츠 자동화 워크플로우를 이어가세요.",
    },
  ];
};

const formSchema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력해주세요.",
      invalid_type_error: "이메일 형식이 올바르지 않습니다.",
    })
    .email("유효하지 않은 이메일 주소입니다."),
  password: z
    .string({
      required_error: "비밀번호를 입력해주세요.",
    })
    .min(8, {
      message: "비밀번호는 최소 8자 이상이어야 합니다.",
    }),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }

  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }

  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-semibold">로그인</CardTitle>
          <CardDescription className="text-base">
            정보를 입력해 주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form className="flex w-full flex-col gap-5" method="post">
            <div className="flex flex-col items-start space-y-2">
              <Label
                htmlFor="email"
                className="flex flex-col items-start gap-1"
              >
                이메일
              </Label>
              <Input
                id="email"
                name="email"
                required
                type="email"
                placeholder="예: user@example.com"
              />
              {actionData && "formErrors" in actionData && actionData.formErrors?.email && (
                <FormErrors errors={actionData.formErrors.email} />
              )}
            </div>
            <div className="flex flex-col items-start space-y-2">
              <div className="flex w-full items-center justify-between">
                <Label
                  htmlFor="password"
                  className="flex flex-col items-start gap-1"
                >
                  비밀번호
                </Label>
                <Link
                  to="/auth/forgot-password/reset"
                  className="text-muted-foreground text-underline hover:text-foreground self-end text-sm underline transition-colors"
                  tabIndex={-1}
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                required
                type="password"
                placeholder="비밀번호 입력"
              />
              {actionData && "formErrors" in actionData && actionData.formErrors?.password && (
                <FormErrors errors={actionData.formErrors.password} />
              )}
            </div>
            {actionData && "loginError" in actionData && actionData.loginError && (
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertTitle>로그인 실패</AlertTitle>
                <AlertDescription>{actionData.loginError}</AlertDescription>
              </Alert>
            )}
            <FormButton label="로그인" className="w-full" disabled={isSubmitting} />
            {false ? (
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertTitle>이메일 미인증</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-2">
                  로그인하기 전에 이메일을 인증해 주세요.
                  <Button
                    variant="outline"
                    className="text-foreground flex items-center justify-between gap-2"
                  >
                    인증 이메일 다시 보내기
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}
          </Form>
          <SignInButtons />
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center text-sm">
        <p className="text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link
            to="/auth/join"
            className="text-muted-foreground hover:text-foreground text-underline underline transition-colors"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
