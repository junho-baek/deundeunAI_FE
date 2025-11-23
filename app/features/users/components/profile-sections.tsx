import { CheckCircle2, Mail, MapPin, Pencil } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/common/components/ui/avatar";
import { Separator } from "~/common/components/ui/separator";
import { Typography } from "~/common/components/typography";
import ProjectCard, {
  type ProjectCardProps,
} from "~/features/projects/components/project-card";

export type ProfileSummaryCardProps = {
  cardTitle: string;
  cardDescription: string;
  name: string;
  role: string;
  company: string;
  email: string;
  timezone: string;
  joinedAt: string;
  bio: string;
  avatarUrl?: string;
  avatarFallback: string;
  editLabel?: string;
  resetPasswordLabel?: string;
  className?: string;
};

export function ProfileSummaryCard({
  cardTitle,
  cardDescription,
  name,
  role,
  company,
  email,
  timezone,
  joinedAt,
  bio,
  avatarUrl,
  avatarFallback,
  editLabel = "프로필 편집",
  resetPasswordLabel = "비밀번호 재설정",
  className,
}: ProfileSummaryCardProps) {
  return (
    <Card className={`h-fit ${className ?? ""}`}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-16 border-2 border-primary/30">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`${name} 아바타`} />
            ) : null}
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{name}</p>
          </div>
        </div>

        <p className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          {bio}
        </p>

        <dl className="grid gap-4 text-sm">
          <div className="grid gap-1">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" aria-hidden="true" />
              이메일
            </dt>
            <dd className="font-medium text-foreground">{email}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              타임존
            </dt>
            <dd className="font-medium text-foreground">{timezone}</dd>
          </div>
          <div className="grid gap-1">
            <dt className="text-muted-foreground">가입일</dt>
            <dd className="font-medium text-foreground">{joinedAt}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button className="gap-2" size="sm" asChild>
          <Link to="/my/dashboard/settings/profile/edit">
            <Pencil className="size-4" aria-hidden="true" />
            {editLabel}
          </Link>
        </Button>
        <Button size="sm" variant="outline">
          {resetPasswordLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export type ProfilePlanActivityStat = {
  label: string;
  value: string;
  helper: string;
};

export type ProfilePlanActivityCardProps = {
  cardTitle: string;
  cardDescription: string;
  stats: readonly ProfilePlanActivityStat[];
  planLabel: string;
  planDescription: string;
  nextBillingPrefix: string;
  nextBillingDate: string;
  nextBillingSuffix: string;
  billingLinkHref?: string;
  billingLinkLabel?: string;
  automationLabel?: string;
  className?: string;
};

export function ProfilePlanActivityCard({
  cardTitle,
  cardDescription,
  stats,
  planLabel,
  planDescription,
  nextBillingPrefix,
  nextBillingDate,
  nextBillingSuffix,
  billingLinkHref = "/my/dashboard/settings/billing",
  billingLinkLabel = "플랜 세부 정보 보기",
  automationLabel = "AI 자동화 설정",
  className,
}: ProfilePlanActivityCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border bg-muted/30 px-4 py-3"
            >
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-emerald-600">{stat.helper}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <CheckCircle2
              className="mt-0.5 size-4 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-foreground">{planLabel}</p>
              <p>{planDescription}</p>
            </div>
          </div>
          <p>
            {nextBillingPrefix}{" "}
            <span className="font-medium text-foreground">
              {nextBillingDate}
            </span>
            {nextBillingSuffix}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Button size="sm" variant="outline" asChild>
          <Link to={billingLinkHref}>{billingLinkLabel}</Link>
        </Button>
        <Button size="sm" variant="ghost">
          {automationLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export type WorkspacePreferenceItem = {
  title: string;
  description: string;
  ctaLabel: string;
};

export type WorkspacePreferencesCardProps = {
  cardTitle: string;
  cardDescription: string;
  items: readonly WorkspacePreferenceItem[];
  className?: string;
};

export function WorkspacePreferencesCard({
  cardTitle,
  cardDescription,
  items,
  className,
}: WorkspacePreferencesCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item.title}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <Button size="sm" variant="ghost">
                {item.ctaLabel}
              </Button>
            </div>
            {index < items.length - 1 ? <Separator className="my-4" /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export type ProfileProjectsSectionProps = {
  heading: string;
  description: string;
  projects: ReadonlyArray<ProjectCardProps>;
  createProjectHref: string;
  createProjectTitle: string;
  createProjectDescription: string;
  createProjectCta: string;
  className?: string;
};

export function ProfileProjectsSection({
  heading,
  description,
  projects,
  createProjectHref,
  createProjectTitle,
  createProjectDescription,
  createProjectCta,
  className,
}: ProfileProjectsSectionProps) {
  return (
    <section className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Typography
          as="h2"
          variant="h3"
          className="text-2xl font-semibold leading-tight text-foreground"
        >
          {heading}
        </Typography>
        <Typography variant="muted" className="max-w-2xl text-sm md:text-base">
          {description}
        </Typography>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,220px))] justify-start gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={`${project.id}-${index}`} {...project} />
        ))}
        <ProjectCard
          key="create-project"
          id="create"
          to={createProjectHref}
          title={createProjectTitle}
          description={createProjectDescription}
          isCreate
          ctaText={createProjectCta}
        />
      </div>
    </section>
  );
}
