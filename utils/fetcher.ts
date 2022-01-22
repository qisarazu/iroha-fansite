export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (200 <= res.status && res.status < 300) return data;
  throw data;
};
