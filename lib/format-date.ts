// Frontmatter dates are UTC midnight: local getters put viewers west of UTC
// out by a day, and across new year by a full year.
const utcDay = (d: Date) =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

const daysInMonthBefore = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

function relativeLabel(date: Date, now = new Date()): string {
  // A future publishedAt is an authoring mistake, not elapsed time to render.
  if (utcDay(date) >= utcDay(now)) {
    return "Today";
  }

  // Borrow across boundaries: naive component subtraction called 2025-12-31
  // "1y ago" when it was days old.
  let years = now.getUTCFullYear() - date.getUTCFullYear();
  let months = now.getUTCMonth() - date.getUTCMonth();
  let days = now.getUTCDate() - date.getUTCDate();

  if (days < 0) {
    months -= 1;
    days += daysInMonthBefore(now.getUTCFullYear(), now.getUTCMonth());
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    return `${years}y ago`;
  }
  if (months > 0) {
    return `${months}mo ago`;
  }
  return `${days}d ago`;
}

export function formatDate(date: Date, includeRelative = false): string {
  const fullDate = date.toLocaleString("en-us", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${relativeLabel(date)})`;
}
