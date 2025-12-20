export const parseHTML = (
  str: string,
): { isHTML: boolean; title: string | null } => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  const isHTML = Array.from(doc.body.childNodes).some(
    (node) => node.nodeType === 1,
  );
  const title = doc.querySelector("title")?.textContent ?? null;

  return { isHTML, title };
};
