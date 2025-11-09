import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.search;
  const hash = url.hash;
  return redirect(`/usecases/senior${search}${hash}`);
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 활용 사례",
    },
    {
      name: "description",
      content: "시니어와 다양한 업종에서 든든AI를 어떻게 활용하는지 살펴보세요.",
    },
  ];
};

export default function UsecasesIndexPage() {
  return null;
}
