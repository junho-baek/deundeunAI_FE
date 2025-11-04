import { Link, Form } from "react-router";

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

export default function JoinPage() {
  const actionData: unknown = undefined;
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
            <div className="flex flex-col items-start space-y-2">
              <Label htmlFor="name" className="flex flex-col items-start gap-1">
                이름
              </Label>
              <Input
                id="name"
                name="name"
                required
                type="text"
                placeholder="이름"
              />
              {false ? (
                <FormErrors errors={["이름은 필수 항목입니다"]} />
              ) : null}
            </div>
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
              {false ? (
                <FormErrors errors={["유효하지 않은 이메일 주소입니다"]} />
              ) : null}
            </div>
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
              />
              {false ? (
                <FormErrors
                  errors={["비밀번호는 최소 8자 이상이어야 합니다"]}
                />
              ) : null}
            </div>
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
              />
              {false ? (
                <FormErrors errors={["비밀번호가 일치하지 않습니다"]} />
              ) : null}
            </div>
            <FormButton label="계정 생성" className="w-full" />
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
            to="/login"
            className="text-muted-foreground hover:text-foreground text-underline underline transition-colors"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
