import { LockIcon, MailIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/common/components/ui/button";

import { AppleLogo } from "./logos/apple";
import { GithubLogo } from "./logos/github";
import { GoogleLogo } from "./logos/google";
import { KakaoLogo } from "./logos/kakao";

function AuthLoginButton({
  logo,
  label,
  href,
}: {
  logo: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Button
      variant="outline"
      className="inline-flex items-center justify-center gap-2"
      asChild
    >
      <Link to={href}>
        <span>{logo}</span>
        <span>{label}로 수익 컨텐츠 제작하기</span>
      </Link>
    </Button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <span className="bg-input h-px w-full"></span>
      <span className="text-muted-foreground text-xs">OR</span>
      <span className="bg-input h-px w-full"></span>
    </div>
  );
}

function _SignInButtons() {
  return (
    <>
      <AuthLoginButton
        logo={<LockIcon className="size-4 scale-110 dark:text-white" />}
        label="OTP"
        href="/auth/otp/start"
      />
      <AuthLoginButton
        logo={<MailIcon className="size-4 scale-110 dark:text-white" />}
        label="Magic Link"
        href="/auth/magic-link"
      />
    </>
  );
}

function SocialLoginButtons() {
  return (
    <>
      <AuthLoginButton
        logo={<GoogleLogo className="size-4" />}
        label="Google"
        href="/auth/social/google/start"
      />
      <AuthLoginButton
        logo={<GithubLogo className="size-4 scale-125 dark:text-white" />}
        label="Github"
        href="/auth/social/github/start"
      />
      <AuthLoginButton
        logo={<AppleLogo className="size-4 scale-150 dark:text-white" />}
        label="Apple"
        href="/auth/social/apple/start"
      />
      <AuthLoginButton
        logo={<KakaoLogo className="size-4 scale-125 dark:text-yellow-300" />}
        label="Kakao"
        href="/auth/social/kakao/start"
      />
    </>
  );
}

export function SignInButtons() {
  return (
    <>
      <Divider />
      <SocialLoginButtons />
      <_SignInButtons />
    </>
  );
}

export function SignUpButtons() {
  return (
    <>
      <Divider />
      <SocialLoginButtons />
    </>
  );
}
