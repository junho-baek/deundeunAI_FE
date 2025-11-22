/**
 * UUID 유틸리티 함수
 * 유저 이름과 날짜 정보를 기반으로 UUID를 생성합니다
 */

import { v5 as uuidv5 } from "uuid";

/**
 * UUID v5 네임스페이스 (프로젝트 전용)
 * 이 네임스페이스를 사용하여 결정론적 UUID를 생성합니다
 */
const UUID_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // DNS 네임스페이스

/**
 * 유저 이름과 날짜 정보를 기반으로 UUID 생성
 * @param userName - 유저 이름 (또는 유저 ID)
 * @param date - 날짜 정보 (Date 객체 또는 ISO 문자열)
 * @param additionalData - 추가 데이터 (선택사항, 메시지 내용 등)
 * @returns 생성된 UUID 문자열
 */
export function generateUUIDFromUserAndDate(
  userName: string,
  date: Date | string,
  additionalData?: string
): string {
  // 날짜를 ISO 문자열로 변환
  const dateString =
    date instanceof Date ? date.toISOString() : date;

  // 유저 이름과 날짜를 조합한 고유 문자열 생성
  const baseString = `${userName}:${dateString}`;
  
  // 추가 데이터가 있으면 포함
  const inputString = additionalData
    ? `${baseString}:${additionalData}`
    : baseString;

  // UUID v5 생성 (SHA-1 해시 기반, 결정론적)
  return uuidv5(inputString, UUID_NAMESPACE);
}

/**
 * 현재 유저 정보를 가져오는 헬퍼 함수
 * TODO: 실제 인증 시스템이 구현되면 여기서 유저 정보를 가져옵니다
 * @returns 유저 이름 또는 기본값
 */
export function getCurrentUserName(): string {
  // TODO: 실제 인증 시스템에서 유저 이름 가져오기
  // 예: const user = await getCurrentUser();
  //     return user?.name || user?.email || "anonymous";
  
  // 임시로 브라우저 로컬 스토리지나 세션에서 가져오거나 기본값 사용
  if (typeof window !== "undefined") {
    const storedName = localStorage.getItem("userName");
    if (storedName) return storedName;
  }
  
  return "anonymous";
}

/**
 * 프로젝트 ID 생성 (유저 이름 + 현재 날짜 + 메시지 해시)
 * @param userName - 유저 이름
 * @param message - 메시지 내용 (선택사항)
 * @returns 생성된 프로젝트 UUID
 */
export function generateProjectUUID(
  userName: string,
  message?: string
): string {
  const now = new Date();
  
  // 메시지가 있으면 간단한 해시를 추가하여 고유성 보장
  const messageHash = message
    ? message.slice(0, 50).replace(/\s+/g, "-")
    : undefined;
  
  return generateUUIDFromUserAndDate(userName, now, messageHash);
}

