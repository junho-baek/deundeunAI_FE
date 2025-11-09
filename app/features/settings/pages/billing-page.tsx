import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 결제 설정",
    },
    {
      name: "description",
      content: "구독 플랜, 결제 수단, 청구 내역을 관리하세요.",
    },
  ];
};

export default function SettingsBillingPage() {
  return (
    <section>
      <h1>결제 설정</h1>
    </section>
  );
}


