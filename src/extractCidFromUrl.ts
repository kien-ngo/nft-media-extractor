export default function extractCidFromUrl(url: string) {
  if (url.startsWith("ipfs://")) {
    url = url.replace("ipfs://", "");
    return url;
  } else {
    if (url.startsWith("http://")) {
      url = url.replace("http://", "");
    } else if (url.startsWith("https://")) {
      url = url.replace("https://", "");
    }
    if (url.includes("/ipfs/")) {
      url = url.split("/ipfs/")[1];
    }
  }
  return url;
}
