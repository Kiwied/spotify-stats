export const openLinkInNewTab = (linkUrl: string) => {
  const newTab = window.open(linkUrl, "_blank", "noreferrer");
  newTab?.focus();
};
