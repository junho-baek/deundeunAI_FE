/**
 * 프로젝트 단계 상태 폴링 훅
 * 
 * 프로젝트 ID를 기반으로 단계별 상태를 주기적으로 조회하고,
 * UI의 loading/done 상태와 동기화합니다.
 */

import * as React from "react";
import { useFetcher } from "react-router";
import { getProjectSteps } from "../queries";

export type ProjectStepKey = "brief" | "script" | "narration" | "images" | "videos" | "final" | "distribution";
export type ProjectStepStatus = "pending" | "in_progress" | "blocked" | "completed";

export type ProjectStep = {
  id: number;
  project_id: number;
  step_id: string;
  key: ProjectStepKey;
  status: ProjectStepStatus;
  order: number;
  started_at: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type StepStatusMap = Record<ProjectStepKey, ProjectStepStatus>;

/**
 * 프로젝트 단계 상태를 폴링하는 훅
 * @param projectId - 프로젝트의 UUID (project_id 필드)
 * @param options - 폴링 옵션
 * @returns 단계 상태 맵과 로딩 상태
 */
export function useProjectStepStatus(
  projectId: string | undefined,
  options: {
    enabled?: boolean;
    interval?: number; // 폴링 간격 (ms), 기본값 3000
    onStatusChange?: (steps: StepStatusMap) => void;
  } = {}
) {
  const { enabled = true, interval = 3000, onStatusChange } = options;
  const [stepStatusMap, setStepStatusMap] = React.useState<StepStatusMap>({
    brief: "pending",
    script: "pending",
    narration: "pending",
    images: "pending",
    videos: "pending",
    final: "pending",
    distribution: "pending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const fetcher = useFetcher();

  // 프로젝트 단계 상태 조회
  const fetchSteps = React.useCallback(async () => {
    if (!projectId || projectId === "create" || !enabled) {
      return;
    }

    setIsLoading(true);
    try {
      const steps = await getProjectSteps(projectId);
      
      // 단계별 상태 맵 생성
      const newStatusMap: StepStatusMap = {
        brief: "pending",
        script: "pending",
        narration: "pending",
        images: "pending",
        videos: "pending",
        final: "pending",
        distribution: "pending",
      };

      steps.forEach((step) => {
        if (step.key in newStatusMap) {
          newStatusMap[step.key as ProjectStepKey] = step.status as ProjectStepStatus;
        }
      });

      setStepStatusMap(newStatusMap);
      onStatusChange?.(newStatusMap);
    } catch (error) {
      console.error("프로젝트 단계 상태 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, enabled, onStatusChange]);

  // 초기 로드 및 주기적 폴링
  React.useEffect(() => {
    if (!projectId || projectId === "create" || !enabled) {
      return;
    }

    // 즉시 한 번 조회
    fetchSteps();

    // 주기적으로 폴링
    const pollInterval = setInterval(() => {
      fetchSteps();
    }, interval);

    return () => {
      clearInterval(pollInterval);
    };
  }, [projectId, enabled, interval, fetchSteps]);

  // 단계별 loading/done 상태 계산
  const getStepLoading = React.useCallback(
    (stepKey: ProjectStepKey): boolean => {
      return stepStatusMap[stepKey] === "in_progress";
    },
    [stepStatusMap]
  );

  const getStepDone = React.useCallback(
    (stepKey: ProjectStepKey): boolean => {
      return stepStatusMap[stepKey] === "completed";
    },
    [stepStatusMap]
  );

  // 단계 상태 업데이트 함수 (action 호출)
  const updateStepStatus = React.useCallback(
    (
      stepKey: ProjectStepKey,
      status: ProjectStepStatus,
      metadata?: Record<string, unknown>
    ) => {
      if (!projectId || projectId === "create") {
        return;
      }

      const formData = new FormData();
      formData.append("stepKey", stepKey);
      formData.append("status", status);
      if (metadata) {
        formData.append("metadata", JSON.stringify(metadata));
      }

      // action을 통해 상태 업데이트
      fetcher.submit(formData, {
        method: "post",
        action: `/my/dashboard/project/${projectId}/status`,
      });
    },
    [projectId, fetcher]
  );

  return {
    stepStatusMap,
    isLoading,
    getStepLoading,
    getStepDone,
    updateStepStatus,
    refetch: fetchSteps,
  };
}

