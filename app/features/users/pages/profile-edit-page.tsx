import { useState, useEffect } from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  Form,
  useLoaderData,
  useActionData,
  useFetcher,
  redirect,
} from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId, getProfile } from "~/features/users/queries";
import { updateUser } from "~/features/users/mutations";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/common/components/ui/alert";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import { Textarea } from "~/common/components/ui/textarea";
import { Label } from "~/common/components/ui/label";
import { Typography } from "~/common/components/typography";
import SelectPair from "~/common/components/select-pair";
import { getCreditBalance } from "~/features/users/queries";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로필 편집",
    },
    {
      name: "description",
      content: "프로필 정보를 편집하세요.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client);
  const profile = await getProfile(client, profileId);

  if (!profile) {
    throw new Response("Profile not found", { status: 404 });
  }

  // 크레딧 잔액 조회
  const creditBalance = await getCreditBalance(client, profileId);

  return { profile, creditBalance: creditBalance ?? 0 };
}

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  role: z.string().optional(),
  company: z.string().optional().default(""),
  bio: z.string().optional().default(""),
});

export async function action({ request }: ActionFunctionArgs) {
  const { client } = makeSSRClient(request);
  const profileId = await getLoggedInProfileId(client);

  const formData = await request.formData();

  // 일반 프로필 업데이트 로직 (아바타는 별도 Action 페이지에서 처리)
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!success) {
    return { formErrors: error.flatten().fieldErrors };
  }

  const { name, role, company, bio } = data;

  await updateUser(client, {
    id: profileId,
    name,
    role: role || undefined,
    company: company || undefined,
    bio: bio || undefined,
  });

  // 프로필 편집 성공 후 프로필 페이지로 리다이렉트
  return redirect("/my/dashboard/settings/profile");
}

export default function ProfileEditPage() {
  const { profile } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const avatarFetcher = useFetcher();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url || null
  );

  // 아바타 업로드 성공 시 미리보기 업데이트
  useEffect(() => {
    if (avatarFetcher.data && "ok" in avatarFetcher.data && avatarFetcher.data.ok) {
      if (avatarFetcher.data.avatarUrl) {
        setAvatarPreview(avatarFetcher.data.avatarUrl);
      }
    }
  }, [avatarFetcher.data]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarFallback = (profile.name || "")
    .replace(/\s/g, "")
    .slice(0, 2)
    .toUpperCase() || "DU";

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 md:px-10">
        <div className="flex flex-col gap-8 pb-12">
          <header className="flex flex-col gap-3">
            <Typography
              as="h1"
              variant="h3"
              className="text-balance text-3xl font-semibold leading-tight text-foreground md:text-4xl"
            >
              프로필 편집
            </Typography>
            <Typography
              as="p"
              variant="lead"
              className="max-w-2xl text-base text-muted-foreground md:text-lg"
            >
              프로필 정보를 수정하세요. 변경사항은 즉시 반영됩니다.
            </Typography>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              <Form className="flex flex-col gap-6" method="post">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="flex flex-col gap-1">
                이름
                <span className="text-sm text-muted-foreground">
                  공개 프로필에 표시되는 이름입니다.
                </span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={profile.name || ""}
                placeholder="이름을 입력하세요"
              />
              {actionData?.formErrors?.name ? (
                <Alert variant="destructive">
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors.name.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <SelectPair
                label="역할"
                description="당신의 주요 역할을 선택하세요."
                name="role"
                placeholder="역할 선택"
                defaultValue={profile.role || ""}
                options={[
                  { label: "Creator", value: "Creator" },
                  { label: "Developer", value: "developer" },
                  { label: "Designer", value: "designer" },
                  { label: "Marketer", value: "marketer" },
                  { label: "Founder", value: "founder" },
                  { label: "Product Manager", value: "product-manager" },
                ]}
              />
              {actionData?.formErrors?.role ? (
                <Alert variant="destructive">
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors.role.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="company" className="flex flex-col gap-1">
                조직/회사
                <span className="text-sm text-muted-foreground">
                  소속된 조직이나 회사 이름을 입력하세요.
                </span>
              </Label>
              <Input
                id="company"
                name="company"
                defaultValue={profile.company || ""}
                placeholder="조직/회사 이름을 입력하세요"
              />
              {actionData?.formErrors?.company ? (
                <Alert variant="destructive">
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors.company.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bio" className="flex flex-col gap-1">
                소개
                <span className="text-sm text-muted-foreground">
                  자신을 소개하는 짧은 문구를 작성하세요.
                </span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio || ""}
                placeholder="소개를 입력하세요"
                rows={4}
                className="resize-none"
              />
              {actionData?.formErrors?.bio ? (
                <Alert variant="destructive">
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>
                    {actionData.formErrors.bio.join(", ")}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>

                <div className="flex justify-end gap-3">
                  <Button type="submit">프로필 업데이트</Button>
                </div>
              </Form>
            </div>

            <aside className="lg:sticky lg:top-6 h-fit">
              <avatarFetcher.Form
                className="p-6 rounded-lg border shadow-md flex flex-col gap-4"
                method="post"
                action="/my/dashboard/settings/profile/avatar"
                encType="multipart/form-data"
              >
                <Label className="flex flex-col gap-1">
                  아바타
                  <small className="text-muted-foreground">
                    프로필 사진을 업로드하세요.
                  </small>
                </Label>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="size-24 border-2 border-primary/30">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="아바타 미리보기" />
                    ) : null}
                    <AvatarFallback className="text-lg">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-full"
                    onChange={onChange}
                    name="avatar"
                  />
                  {avatarFetcher.data &&
                  "formErrors" in avatarFetcher.data &&
                  avatarFetcher.data.formErrors &&
                  "avatar" in avatarFetcher.data.formErrors ? (
                    <Alert variant="destructive" className="w-full">
                      <AlertTitle>오류</AlertTitle>
                      <AlertDescription>
                        {avatarFetcher.data.formErrors.avatar?.join(", ")}
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  {avatarFetcher.data && "ok" in avatarFetcher.data && avatarFetcher.data.ok ? (
                    <Alert className="w-full">
                      <AlertTitle>성공</AlertTitle>
                      <AlertDescription>아바타가 성공적으로 업데이트되었습니다.</AlertDescription>
                    </Alert>
                  ) : null}
                  <div className="flex flex-col text-xs text-muted-foreground">
                    <span>권장 크기: 128x128px</span>
                    <span>최대 크기: 2MB</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={avatarFetcher.state === "submitting"}
                >
                  {avatarFetcher.state === "submitting" ? "업로드 중..." : "아바타 업데이트"}
                </Button>
              </avatarFetcher.Form>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

