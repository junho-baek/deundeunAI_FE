import { useSearchParams } from "react-router";
import { Button } from "~/common/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectPaginationProps = {
  totalPages: number;
  currentPage?: number;
};

export default function ProjectPagination({
  totalPages,
  currentPage,
}: ProjectPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = currentPage ?? Number(searchParams.get("page") ?? 1);

  const onClick = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams, { preventScrollReset: true });
  };

  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 계산 (최대 5개)
  const getPageNumbers = () => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 끝에서 시작점 조정
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onClick(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
        이전
      </Button>

      {pageNumbers[0] > 1 && (
        <>
          <Button variant="outline" size="sm" onClick={() => onClick(1)}>
            1
          </Button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
        </>
      )}

      <div className="flex items-center gap-1">
        {pageNumbers.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            onClick={() => onClick(p)}
            aria-label={`${p}페이지로 이동`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Button>
        ))}
      </div>

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClick(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onClick(page + 1)}
        disabled={page === totalPages}
        aria-label="다음 페이지"
      >
        다음
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
