export const formatDateTime = (input: string) =>
  new Date(input).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
