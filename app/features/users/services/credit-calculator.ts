/**
 * 크레딧 계산 로직
 * 워크플로우 단계별 크레딧 비용을 정의하고 계산합니다.
 */

export const CREDIT_COSTS = {
  brief: 10,        // 기획서 생성
  script: 50,       // 대본 생성 (AI 처리 비용 높음)
  narration: 30,    // 내레이션 생성
  images: 20,       // 이미지 생성 (개당)
  videos: 100,      // 영상 생성 (비용 높음)
  final: 5,         // 최종 편집
  distribution: 0,  // 배포 (무료)
} as const;

export type ProjectStepKey = keyof typeof CREDIT_COSTS;

/**
 * 프로젝트 단계 실행에 필요한 크레딧 계산
 * @param stepKey - 단계 키
 * @param metadata - 추가 메타데이터 (이미지 개수, 영상 길이 등)
 * @returns 필요한 크레딧 양
 */
export function calculateStepCredits(
  stepKey: ProjectStepKey,
  metadata?: Record<string, unknown>
): number {
  const baseCost = CREDIT_COSTS[stepKey];

  // 메타데이터에 따라 추가 비용 계산
  if (stepKey === "images" && metadata?.imageCount) {
    const imageCount = metadata.imageCount as number;
    return baseCost * imageCount;
  }

  if (stepKey === "videos" && metadata?.videoLength) {
    const videoLength = metadata.videoLength as number; // 초 단위
    const lengthMultiplier = Math.ceil(videoLength / 60); // 1분당
    return baseCost * lengthMultiplier;
  }

  return baseCost;
}

/**
 * 크레딧 부족 여부 확인
 * @param currentBalance - 현재 크레딧 잔액
 * @param requiredCredits - 필요한 크레딧 양
 * @returns 크레딧이 충분한지 여부
 */
export function hasEnoughCredits(
  currentBalance: number,
  requiredCredits: number
): boolean {
  return currentBalance >= requiredCredits;
}

