/**
 * 프로젝트 워크스페이스 데모용 Mock 데이터
 * 실제 서비스처럼 보이도록 설계된 샘플 데이터
 */

// 실제 이미지 URL (Unsplash - 다양한 주제)
export const MOCK_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&auto=format&q=80", // 비즈니스/금융
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop&auto=format&q=80", // 비즈니스/회의
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop&auto=format&q=80", // 기술/노트북
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop&auto=format&q=80", // 비즈니스/계획
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=600&fit=crop&auto=format&q=80", // 비즈니스/성장
  "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=600&fit=crop&auto=format&q=80", // 비즈니스/성공
];

// 실제 비디오 URL (샘플 비디오)
export const MOCK_VIDEO_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

// 실제 오디오 URL (샘플 오디오)
export const MOCK_AUDIO_URLS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];

// 프로젝트 제목 샘플
export const MOCK_PROJECT_TITLES = [
  "월 100만원 부업, 집에서 시작하는 부동산 투자",
  "이 한 가지 습관이 내 인생을 바꿨다",
  "직장인도 가능한 부업, 3개월 만에 수익화 성공",
  "20대가 알아야 할 돈 버는 진짜 방법",
  "이것만 알면 당신도 부자, 절약의 달인이 되는 법",
  "월 50만원 부업, 시간 투자 대비 최고 수익률",
];

// 프로젝트 설명 샘플
export const MOCK_PROJECT_DESCRIPTIONS = [
  "부동산 투자 초보자를 위한 실전 가이드. 작은 자본으로 시작하는 방법부터 수익 실현까지 단계별로 설명합니다.",
  "하루 10분으로 시작하는 습관 만들기. 작은 변화가 가져온 큰 결과를 공유합니다.",
  "직장인도 가능한 부업 아이템 소개. 저녁 시간 활용으로 부수입 만들기 성공 사례.",
  "20대가 놓치기 쉬운 재테크 팁. 지금 시작하면 10년 후 달라지는 금융 습관.",
  "절약의 달인이 되는 실전 노하우. 불필요한 지출 줄이고 저축률 높이는 방법.",
  "시간 대비 최고 수익률 부업 추천. 하루 2시간 투자로 월 50만원 벌기.",
];

// 기획서 샘플 (키워드에 따라 동적으로 생성 가능)
export function generateMockBrief(keyword?: string): string {
  const title = keyword || "수익형 콘텐츠";
  
  // 키워드에 따라 다른 기획서 생성
  const briefs: Record<string, string> = {
    부업: `# ${title} 기획서

**목표**: 수익형 쇼츠 제작 및 수익화

## 콘셉트
- 강렬한 훅으로 시작 (첫 3초가 핵심)
- 정보 전달형 전개 (실용적 가치 제공)
- 마지막에 명확한 CTA (구독/좋아요 유도)

## 타깃
- 20-30대 직장인
- 부업/투자에 관심 있는 사람들
- 경제적 자유를 꿈꾸는 사람들

## 포맷
- 비율: 9:16 (세로형 쇼츠)
- 길이: 00:30-00:60
- 스타일: 정보 전달형, 빠른 템포

## 핵심 메시지
1. **훅 (0-3초)**: "직장인도 가능한 부업, 3개월 만에 수익화 성공"
2. **본문 (3-25초)**: 구체적인 부업 방법과 사례 제시
3. **CTA (25-30초)**: "더 많은 부업 팁은 구독으로"

## 콘텐츠 구조
- 0-5초: 강렬한 훅 ("이것만 알면 당신도 부자")
- 5-15초: 첫 번째 방법 소개 (온라인 강의 판매)
- 15-25초: 두 번째 방법 소개 (전문 분야 콘텐츠화)
- 25-30초: CTA 및 구독 유도

## 예상 성과
- 조회수: 10만+ 목표
- 구독자 전환율: 3-5%
- 수익화: 광고 수익 + 제휴 마케팅`,

    투자: `# ${title} 기획서

**목표**: 수익형 쇼츠 제작 및 수익화

## 콘셉트
- 강렬한 훅으로 시작 (첫 3초가 핵심)
- 정보 전달형 전개 (실용적 가치 제공)
- 마지막에 명확한 CTA (구독/좋아요 유도)

## 타깃
- 20-30대 직장인
- 투자에 관심 있는 사람들
- 경제적 자유를 꿈꾸는 사람들

## 포맷
- 비율: 9:16 (세로형 쇼츠)
- 길이: 00:30-00:60
- 스타일: 정보 전달형, 빠른 템포

## 핵심 메시지
1. **훅 (0-3초)**: "작은 자본으로 시작하는 부동산 투자"
2. **본문 (3-25초)**: 구체적인 투자 방법과 사례 제시
3. **CTA (25-30초)**: "더 많은 투자 팁은 구독으로"

## 콘텐츠 구조
- 0-5초: 강렬한 훅 ("월 100만원 부업, 집에서 시작")
- 5-15초: 첫 번째 투자 방법 소개 (부동산 투자)
- 15-25초: 두 번째 투자 방법 소개 (주식/펀드)
- 25-30초: CTA 및 구독 유도

## 예상 성과
- 조회수: 10만+ 목표
- 구독자 전환율: 3-5%
- 수익화: 광고 수익 + 제휴 마케팅`,
  };

  // 키워드에 맞는 기획서가 있으면 사용, 없으면 기본값
  const matchedKey = Object.keys(briefs).find((k) => title.includes(k));
  if (matchedKey) {
    return briefs[matchedKey];
  }

  // 기본 기획서
  return `# ${title} 기획서

**목표**: 수익형 쇼츠 제작 및 수익화

## 콘셉트
- 강렬한 훅으로 시작 (첫 3초가 핵심)
- 정보 전달형 전개 (실용적 가치 제공)
- 마지막에 명확한 CTA (구독/좋아요 유도)

## 타깃
- 20-30대 직장인
- ${title}에 관심 있는 사람들
- 경제적 자유를 꿈꾸는 사람들

## 포맷
- 비율: 9:16 (세로형 쇼츠)
- 길이: 00:30-00:60
- 스타일: 정보 전달형, 빠른 템포

## 핵심 메시지
1. **훅 (0-3초)**: "이것만 알면 당신도 부자"
2. **본문 (3-25초)**: 구체적인 방법과 사례 제시
3. **CTA (25-30초)**: "더 많은 팁은 구독으로"

## 콘텐츠 구조
- 0-5초: 강렬한 훅 ("${title}로 시작하는 부업")
- 5-15초: 첫 번째 방법 소개
- 15-25초: 두 번째 방법 소개
- 25-30초: CTA 및 구독 유도

## 예상 성과
- 조회수: 10만+ 목표
- 구독자 전환율: 3-5%
- 수익화: 광고 수익 + 제휴 마케팅`;
}

// 스크립트 샘플 (시간별로 나뉜 대본)
export function generateMockScript(keyword?: string): string[] {
  // 키워드에 따라 다른 스크립트 생성
  if (keyword?.includes("부업")) {
    return [
      "00:00-00:05\n\n이것만 알면 당신도 부자. 오늘은 직장인도 가능한 부업, 3개월 만에 수익화 성공한 방법을 알려드릴게요.",
      "00:06-00:12\n\n첫 번째, 시간 투자 대비 최고 수익률을 내는 방법은 바로 온라인 강의 판매예요. 하루 2시간만 투자하면 월 50만원은 충분히 가능합니다.",
      "00:13-00:19\n\n두 번째, 자신의 전문 분야를 콘텐츠로 만들어요. 회사에서 하는 일, 취미, 관심사 뭐든지 가능합니다. 중요한 건 시작하는 거예요.",
      "00:20-00:26\n\n세 번째, 꾸준함이 핵심이에요. 하루에 조금씩이라도 매일 올리면 3개월 후엔 분명히 결과가 보일 거예요.",
      "00:27-00:30\n\n지금 바로 시작하세요. 더 많은 팁은 구독과 좋아요로 부탁드려요. 다음 영상에서 더 자세히 알려드릴게요!",
    ];
  }

  if (keyword?.includes("투자")) {
    return [
      "00:00-00:05\n\n월 100만원 부업, 집에서 시작하는 부동산 투자. 오늘은 작은 자본으로도 가능한 투자 방법을 알려드릴게요.",
      "00:06-00:12\n\n첫 번째, 리츠(REITs) 투자예요. 부동산을 직접 사지 않아도 간접 투자가 가능해요. 월 10만원부터 시작할 수 있습니다.",
      "00:13-00:19\n\n두 번째, 부동산 펀드 투자예요. 전문가가 대신 관리해주니까 초보자도 쉽게 시작할 수 있어요. 연 5-7% 수익률을 기대할 수 있습니다.",
      "00:20-00:26\n\n세 번째, 소액 부동산 투자 플랫폼이에요. 100만원부터 시작해서 여러 부동산에 분산 투자할 수 있어요. 리스크를 줄이면서 수익을 낼 수 있습니다.",
      "00:27-00:30\n\n지금 바로 시작하세요. 더 많은 투자 팁은 구독과 좋아요로 부탁드려요. 다음 영상에서 더 자세히 알려드릴게요!",
    ];
  }

  // 기본 스크립트
  return [
    `00:00-00:05\n\n이것만 알면 당신도 부자. 오늘은 ${keyword || "수익형 콘텐츠"}를 만드는 방법을 알려드릴게요.`,
    "00:06-00:12\n\n첫 번째, 시간 투자 대비 최고 수익률을 내는 방법은 바로 온라인 강의 판매예요. 하루 2시간만 투자하면 월 50만원은 충분히 가능합니다.",
    "00:13-00:19\n\n두 번째, 자신의 전문 분야를 콘텐츠로 만들어요. 회사에서 하는 일, 취미, 관심사 뭐든지 가능합니다. 중요한 건 시작하는 거예요.",
    "00:20-00:26\n\n세 번째, 꾸준함이 핵심이에요. 하루에 조금씩이라도 매일 올리면 3개월 후엔 분명히 결과가 보일 거예요.",
    "00:27-00:30\n\n지금 바로 시작하세요. 더 많은 팁은 구독과 좋아요로 부탁드려요. 다음 영상에서 더 자세히 알려드릴게요!",
  ];
}

// 오디오 세그먼트 샘플
export function generateMockNarrationSegments(): Array<{
  id: number | string;
  label: string;
  src: string;
}> {
  return [
    {
      id: 1,
      label: "00:00–00:10",
      src: MOCK_AUDIO_URLS[0],
    },
    {
      id: 2,
      label: "00:11–00:20",
      src: MOCK_AUDIO_URLS[1],
    },
    {
      id: 3,
      label: "00:21–00:30",
      src: MOCK_AUDIO_URLS[2],
    },
  ];
}

// 프로젝트 제목/설명 생성 (키워드 기반)
export function generateMockProjectTitle(keyword?: string): string {
  if (!keyword) {
    return MOCK_PROJECT_TITLES[
      Math.floor(Math.random() * MOCK_PROJECT_TITLES.length)
    ];
  }
  
  // 키워드 기반으로 제목 생성
  const templates = [
    `${keyword}로 시작하는 부업, 3개월 만에 수익화 성공`,
    `${keyword} 초보자를 위한 실전 가이드`,
    `${keyword}로 월 100만원 벌기, 집에서 시작하는 방법`,
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateMockProjectDescription(keyword?: string): string {
  if (!keyword) {
    return MOCK_PROJECT_DESCRIPTIONS[
      Math.floor(Math.random() * MOCK_PROJECT_DESCRIPTIONS.length)
    ];
  }
  
  return `${keyword}에 대한 실전 가이드. 초보자도 쉽게 따라할 수 있는 단계별 방법부터 수익 실현까지 상세히 설명합니다.`;
}

