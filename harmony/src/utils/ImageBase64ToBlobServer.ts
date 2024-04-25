
export default function ImageBase64ToBlob(dataurl: string | null) {
  if (!dataurl || !dataurl.length) return null;
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/);
  if (!mime || arr.length < 2) return null;

  var bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blobObj = new Blob([u8arr], {
    type: mime[1],
  });
  if (blobObj) {
    let url = window.URL.createObjectURL(blobObj);
    return url;
  }
  return null;
}
