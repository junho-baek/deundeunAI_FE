import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search;
  const hash = url.hash;
  return redirect(`/resources/about${search}${hash}`);
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 리소스",
    },
    {
      name: "description",
      content:
        "든든AI 고객을 위한 가이드, 블로그, 뉴스레터 등 다양한 자료를 살펴보세요.",
    },
  ];
};

export default function ResourcesIndexPage() {
  return null;
}
