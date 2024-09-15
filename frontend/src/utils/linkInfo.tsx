export const linkInfo = ({ link }: { link: any }) => {
  const reg = new RegExp("\\/([^\\/?]+)\\?");
  const name = link?.match(reg)[1];
  const exp = name?.substring(name.indexOf("."));
  return { name, exp };
};
