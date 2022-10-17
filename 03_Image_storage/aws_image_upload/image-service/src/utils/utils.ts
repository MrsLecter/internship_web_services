export const getUrlString = (images) => {
  const BASE_URL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`;
  let urls = "";
  let name: string;
  for (let i = 0; i < images.Items.length; i++) {
    name = images.Items[i].imageName.S;
    urls += `${name}: ${BASE_URL + name}`;
  }
  return urls;
};
