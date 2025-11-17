import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 쇼츠 서비스",
    },
    {
      name: "description",
      content: "AI가 생성하는 쇼츠 제작 워크플로우와 서비스 소개를 확인하세요.",
    },
  ];
};

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search;
  const hash = url.hash;
  return redirect(`/service/shorts/create${search}${hash}`);
}

export function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search;
  const hash = url.hash;
  return redirect(`/service/shorts/create${search}${hash}`);
}

export default function ShortsLandingPage() {
  return null;
}
