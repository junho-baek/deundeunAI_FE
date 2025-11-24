/**
 * Form 리셋을 위한 커스텀 훅
 * 
 * Action이 성공적으로 완료된 후 Form을 자동으로 리셋합니다.
 * 
 * @example
 * ```tsx
 * const formRef = useFormReset(actionData);
 * 
 * return (
 *   <Form ref={formRef} method="post">
 *     // 입력 필드
 *   </Form>
 * );
 * ```
 */

import { useEffect, useRef } from "react";

/**
 * Action이 성공적으로 완료된 후 Form을 리셋하는 훅
 * @param actionData - Action 함수에서 반환된 데이터
 * @param successKey - 성공을 나타내는 키 (기본값: "ok")
 * @returns Form ref
 */
export function useFormReset<T extends Record<string, unknown>>(
  actionData: T | undefined,
  successKey: keyof T = "ok" as keyof T
) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData && actionData[successKey]) {
      formRef.current?.reset();
    }
  }, [actionData, successKey]);

  return formRef;
}
