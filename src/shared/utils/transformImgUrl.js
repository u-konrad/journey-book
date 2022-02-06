
  const transformImgUrl = (url, width) => {
    if (!url) return "";
    if (url.includes("cloudinary")) {
      return url.replace("/upload", `/upload/w_${width}`);
    }
    if (url.includes("unsplash")) {
      return url.replace("w=1080", `w=${width}`);
    }
  };

  export default transformImgUrl;