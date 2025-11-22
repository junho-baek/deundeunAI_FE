/**
 * 크레딧 잔액 표시 컴포넌트 (Optimistic UI)
 * useFetcher와 useState를 사용하여 즉각적인 UI 피드백 제공
 */

import { useState, useEffect } from "react";
import { useFetcher, Link } from "react-router";
import { Coins, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export interface CreditBalanceProps {
  currentBalance: number;
  className?: string;
  showRechargeButton?: boolean;
  compact?: boolean;
}

export function CreditBalance({
  currentBalance,
  className,
  showRechargeButton = false,
  compact = false,
}: CreditBalanceProps) {
  const fetcher = useFetcher();

  // Optimistic UI: 서버 응답 전에 UI 업데이트
  const [optimisticBalance, setOptimisticBalance] = useState(currentBalance);

  // currentBalance이 변경되면 optimisticBalance도 업데이트
  useEffect(() => {
    setOptimisticBalance(currentBalance);
  }, [currentBalance]);

  // fetcher의 data에서 크레딧 변경사항 감지
  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as { balance?: number; success?: boolean };
      if (data.success && typeof data.balance === "number") {
        setOptimisticBalance(data.balance);
      }
    }
  }, [fetcher.data]);

  // 크레딧 부족 여부 확인
  const isLowBalance = optimisticBalance < 1000;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Coins className="size-4 text-primary" />
        <span className="text-sm font-medium">
          {optimisticBalance.toLocaleString()}
        </span>
        {fetcher.state === "submitting" && (
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isLowBalance && "border-warning/50 bg-warning/5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full p-2",
              isLowBalance ? "bg-warning/10" : "bg-primary/10"
            )}
          >
            <Coins
              className={cn(
                "size-5",
                isLowBalance ? "text-warning" : "text-primary"
              )}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">크레딧 잔액</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {optimisticBalance.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">크레딧</span>
              {fetcher.state === "submitting" && (
                <Loader2 className="size-3 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        {showRechargeButton && (
          <Button asChild variant="outline" size="sm">
            <Link to="/pricing">충전하기</Link>
          </Button>
        )}
      </div>
      {isLowBalance && (
        <div className="mt-3 rounded-md bg-warning/10 p-2 text-xs text-warning">
          크레딧이 부족합니다. 충전이 필요합니다.
        </div>
      )}
    </div>
  );
}

/**
 * 크레딧 차감을 Optimistic하게 처리하는 헬퍼 함수
 */
export function useCreditDeduction(
  currentBalance: number,
  onDeduct: (amount: number) => Promise<void>
) {
  const [optimisticBalance, setOptimisticBalance] = useState(currentBalance);

  // currentBalance이 변경되면 optimisticBalance도 업데이트
  useEffect(() => {
    setOptimisticBalance(currentBalance);
  }, [currentBalance]);

  const handleDeduct = async (amount: number) => {
    // Optimistic 업데이트
    setOptimisticBalance((prev) => Math.max(0, prev - amount));

    try {
      // 실제 차감
      await onDeduct(amount);
    } catch (error) {
      // 실패 시 롤백 (원래 값으로 복원)
      setOptimisticBalance(currentBalance);
      console.error("크레딧 차감 실패:", error);
      throw error;
    }
  };

  return {
    optimisticBalance,
    handleDeduct,
  };
}

