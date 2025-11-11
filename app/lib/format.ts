const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function formatDateLabel(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return dateFormatter
    .format(date)
    .replace(/\./g, ".")
    .replace(/\s/g, "");
}

export function formatCurrency(value: number | null | undefined) {
  if (value == null) return "";
  return currencyFormatter.format(value);
}

export function formatCount(value: number | null | undefined) {
  if (value == null) return "";
  const abs = Math.abs(value);
  if (abs >= 1000000) {
    return `${Math.round(abs / 1000000)}M`;
  }
  if (abs >= 1000) {
    return `${Math.round(abs / 1000)}K`;
  }
  return value.toLocaleString("ko-KR");
}

export function formatPercent(value: number | null | undefined, fraction = 1) {
  if (value == null) return "";
  return `${(value * 100).toFixed(fraction)}%`;
}

export function formatTimezoneLabel(timezone: string | null | undefined) {
  if (!timezone) return "Asia/Seoul (GMT+09:00)";
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timezone,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    const offset =
      parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
    return `${timezone} (${offset})`;
  } catch {
    return timezone;
  }
}

export function formatBudgetLabel(value: number | null | undefined) {
  if (value == null) return "";
  if (value >= 4_000_000) return "High";
  if (value >= 3_000_000) return "Mid";
  return "Low";
}

export function formatCardExpiry(
  month: number | null | undefined,
  year: number | null | undefined
) {
  if (!month || !year) return "";
  const mm = month.toString().padStart(2, "0");
  const yy = year.toString().slice(-2);
  return `${mm}/${yy}`;
}

export function formatKoreanNumber(value: number | null | undefined) {
  if (value == null) return "";
  return value.toLocaleString("ko-KR");
}

export function makeSummaryLabel({
  prefix,
  brand,
  last4,
}: {
  prefix: string;
  brand?: string | null;
  last4?: string | null;
}) {
  const pieces = [prefix];
  if (brand) {
    pieces.push(`${brand}`);
  }
  if (last4) {
    pieces.push(`•••• ${last4}`);
  }
  return pieces.join(" ");
}

