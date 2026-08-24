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

  // getUTC* to match the UTC-formatted full date above; frontmatter dates are
  // UTC midnight, so local getters put viewers west of UTC a day out.
  const currentDate = new Date();
  const yearsAgo = currentDate.getUTCFullYear() - date.getUTCFullYear();
  const monthsAgo = currentDate.getUTCMonth() - date.getUTCMonth();
  const daysAgo = currentDate.getUTCDate() - date.getUTCDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  return `${fullDate} (${formattedDate})`;
}
