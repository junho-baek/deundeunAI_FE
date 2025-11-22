import { Link, Form, type MetaFunction, type ActionFunctionArgs, redirect, useNavigation } from "react-router";
import * as React from "react";
import { z } from "zod";

import FormButton from "~/common/components/form-button";
import FormErrors from "~/common/components/form-error";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Checkbox } from "~/common/components/ui/checkbox";
import { Input } from "~/common/components/ui/input";
import { Label } from "~/common/components/ui/label";
import { SignUpButtons } from "../components/auth-login-buttons";
import { makeSSRClient } from "~/lib/supa-client";
import { checkUsernameExists } from "../queries";
import type { Route } from "./+types/join-page";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 회원가입",
    },
    {
      name: "description",
      content: "든든AI 계정을 생성하고 AI 수익 파트너 여정을 시작하세요.",
    },
  ];
};

const formSchema = z.object({
  name: z.string().min(3, "이름은 최소 3자 이상이어야 합니다."),
  email: z.string().email("유효하지 않은 이메일 주소입니다."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  confirmPassword: z.string().min(8, "비밀번호 확인은 최소 8자 이상이어야 합니다."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
    };
  }

  // Supabase 인증으로 회원가입
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        // username은 나중에 프로필 설정에서 추가할 수 있도록 함
      },
    },
  });

  if (signUpError) {
    return {
      signUpError: signUpError.message,
    };
  }

  return redirect("/", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  const [step, setStep] = React.useState(0);
  const steps = ["name", "email", "password", "confirmPassword"] as const;
  const [formValues, setFormValues] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const startX = React.useRef<number | null>(null);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setStep((s) => Math.max(s - 1, 0));
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };
  const update = (key: keyof typeof formValues, value: string) =>
    setFormValues((v) => ({ ...v, [key]: value }));
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-2xl font-semibold" role="heading">
            회원가입
          </CardTitle>
          <CardDescription className="text-base">
            계정을 만들기 위해 정보를 입력해 주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form className="flex w-full flex-col gap-5" method="post">
            <div
              ref={containerRef}
              className="overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300"
                style={{
                  transform: `translateX(-${(step * 100) / steps.length}%)`,
                  width: `${steps.length * 100}%`,
                }}
              >
                {/* slide 1 */}
                <div
                  className="w-full px-1 shrink-0"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <div className="flex flex-col items-start space-y-2">
                    <Label
                      htmlFor="name"
                      className="flex flex-col items-start gap-1"
                    >
                      이름
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder="이름"
                      value={formValues.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                    {false ? (
                      <FormErrors errors={["이름은 필수 항목입니다"]} />
                    ) : null}
                  </div>
                </div>
                {/* slide 2 */}
                <div
                  className="w-full px-1 shrink-0"
                  style={{ width: `${100 / steps.length}%` }}
                >
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
                      value={formValues.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    {actionData && "formErrors" in actionData && actionData.formErrors?.email && (
                      <FormErrors errors={actionData.formErrors.email} />
                    )}
                  </div>
                </div>
                {/* slide 3 */}
                <div
                  className="w-full px-1 shrink-0"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <div className="flex flex-col items-start space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex flex-col items-start gap-1"
                    >
                      비밀번호
                      <small className="text-muted-foreground">
                        최소 8자 이상이어야 합니다.
                      </small>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      required
                      type="password"
                      placeholder="비밀번호 입력"
                      value={formValues.password}
                      onChange={(e) => update("password", e.target.value)}
                    />
                    {actionData && "formErrors" in actionData && actionData.formErrors?.password && (
                      <FormErrors errors={actionData.formErrors.password} />
                    )}
                  </div>
                </div>
                {/* slide 4 */}
                <div
                  className="w-full px-1 shrink-0"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <div className="flex flex-col items-start space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex flex-col items-start gap-1"
                    >
                      비밀번호 확인
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      type="password"
                      placeholder="비밀번호 확인"
                      value={formValues.confirmPassword}
                      onChange={(e) =>
                        update("confirmPassword", e.target.value)
                      }
                    />
                    {actionData && "formErrors" in actionData && actionData.formErrors?.confirmPassword && (
                      <FormErrors errors={actionData.formErrors.confirmPassword} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* progress dots */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={
                    "h-1.5 w-1.5 rounded-full transition-colors " +
                    (i === step ? "bg-foreground" : "bg-muted-foreground/30")
                  }
                />
              ))}
            </div>

            {/* controls */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={goPrev}
                className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
                disabled={step === 0}
              >
                이전
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="ml-auto px-3 py-2 rounded-md border text-sm"
                >
                  다음
                </button>
              ) : (
                <FormButton label="계정 생성" className="ml-auto" />
              )}
            </div>
            {false ? (
              <Alert className="bg-green-600/20 text-green-700 dark:bg-green-950/20 dark:text-green-600">
                <AlertTitle>계정이 생성되었습니다!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-600">
                  로그인하기 전에 이메일을 인증해 주세요. 이 탭을 닫아도 됩니다.
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="flex items-center gap-2">
              <Checkbox id="marketing" name="marketing" />
              <Label htmlFor="marketing" className="text-muted-foreground">
                마케팅 이메일 수신 동의
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" name="terms" />
              <Label htmlFor="terms" className="text-muted-foreground">
                <span>
                  다음에 동의합니다{" "}
                  <Link
                    to="/legal/terms-of-service"
                    className="text-muted-foreground text-underline hover:text-foreground underline transition-colors"
                  >
                    이용약관
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/legal/privacy-policy"
                    className="text-muted-foreground hover:text-foreground text-underline underline transition-colors"
                  >
                    개인정보 처리방침
                  </Link>
                </span>
              </Label>
            </div>
          </Form>
          <SignUpButtons />
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center text-sm">
        <p className="text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/auth/login"
            className="text-muted-foreground hover:text-foreground text-underline underline transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
