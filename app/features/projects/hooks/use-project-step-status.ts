/**
 * 프로젝트 단계 상태 폴링 훅
 *
 * 프로젝트 ID를 기반으로 단계별 상태를 주기적으로 조회하고,
 * UI의 loading/done 상태와 동기화합니다.
 */

import * as React from "react";
import { useFetcher } from "react-router";
import { browserClient } from "~/lib/supa-client";

export type ProjectStepKey =
  | "brief"
  | "script"
  | "narration"
  | "images"
  | "videos"
  | "final"
  | "distribution";
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

type UseProjectStepStatusOptions = {
  enabled?: boolean;
  interval?: number;
  onStatusChange?: (steps: StepStatusMap) => void;
  projectSerialId?: number | null;
  initialSteps?: Array<{ key: string; status: string }>;
};

const defaultStepMap: StepStatusMap = {
  brief: "pending",
  script: "pending",
  narration: "pending",
  images: "pending",
  videos: "pending",
  final: "pending",
  distribution: "pending",
};

function buildStatusMap(
  seed?: Array<{ key: string; status: string }>
): StepStatusMap {
  const next: StepStatusMap = { ...defaultStepMap };
  if (seed) {
    seed.forEach((step) => {
      const key = step.key as ProjectStepKey;
      if (key in next) {
        next[key] = step.status as ProjectStepStatus;
      }
    });
  }
  return next;
}

export function useProjectStepStatus(
  projectId: string | undefined,
  options: UseProjectStepStatusOptions = {}
) {
  const {
    enabled = true,
    interval = 3000,
    onStatusChange,
    projectSerialId,
    initialSteps,
  } = options;

  const [stepStatusMap, setStepStatusMap] = React.useState<StepStatusMap>(() =>
    buildStatusMap(initialSteps)
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const fetcher = useFetcher();

  const initialSignatureRef = React.useRef<string>("");
  React.useEffect(() => {
    if (!initialSteps) {
      return;
    }
    const signature = initialSteps
      .map((step) => `${step.key}:${step.status}`)
      .join("|");
    if (signature === initialSignatureRef.current) {
      return;
    }
    initialSignatureRef.current = signature;
    setStepStatusMap((prev) => {
      const next = { ...prev };
      initialSteps.forEach((step) => {
        const key = step.key as ProjectStepKey;
        if (key in next) {
          next[key] = step.status as ProjectStepStatus;
        }
      });
      return next;
    });
  }, [initialSteps]);

  const projectSerialIdRef = React.useRef<number | null>(
    projectSerialId ?? null
  );

  React.useEffect(() => {
    if (typeof projectSerialId === "number") {
      projectSerialIdRef.current = projectSerialId;
    }
  }, [projectSerialId]);

  const fetchSteps = React.useCallback(async () => {
    if (!enabled || !projectId || projectId === "create") {
      return;
    }

    setIsLoading(true);
    try {
      let resolvedProjectRowId = projectSerialIdRef.current;

      if (!resolvedProjectRowId) {
        const { data: projectRow, error: projectError } = await browserClient
          .from("projects")
          .select("id")
          .eq("project_id", projectId)
          .maybeSingle();

        if (projectError) {
          throw projectError;
        }

        resolvedProjectRowId = projectRow?.id ?? null;
        projectSerialIdRef.current = resolvedProjectRowId;
      }

      if (!resolvedProjectRowId) {
        throw new Error("프로젝트 정보를 찾을 수 없습니다.");
      }

      const { data: steps, error: stepsError } = await browserClient
        .from("project_steps")
        .select("*")
        .eq("project_id", resolvedProjectRowId)
        .order("order", { ascending: true });

      if (stepsError) {
        throw stepsError;
      }

      const map = buildStatusMap(steps ?? undefined);
      setStepStatusMap(map);
      onStatusChange?.(map);
    } catch (error) {
      console.error("프로젝트 단계 상태 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, onStatusChange, projectId]);

  React.useEffect(() => {
    if (!projectId || projectId === "create" || !enabled) {
      return;
    }

    fetchSteps();
    const pollInterval = setInterval(fetchSteps, interval);
    return () => {
      clearInterval(pollInterval);
    };
  }, [projectId, enabled, interval, fetchSteps]);

  const getStepLoading = React.useCallback(
    (stepKey: ProjectStepKey): boolean =>
      stepStatusMap[stepKey] === "in_progress",
    [stepStatusMap]
  );

  const getStepDone = React.useCallback(
    (stepKey: ProjectStepKey): boolean =>
      stepStatusMap[stepKey] === "completed",
    [stepStatusMap]
  );

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
