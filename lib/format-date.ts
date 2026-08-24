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

  const currentDate = new Date();
  const yearsAgo = currentDate.getFullYear() - date.getFullYear();
  const monthsAgo = currentDate.getMonth() - date.getMonth();
  const daysAgo = currentDate.getDate() - date.getDate();

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
