export function formatDate(timestamp) {
  const date = new Date(parseInt(timestamp)); // parse the timestamp to ensure it's an integer representing milliseconds
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
