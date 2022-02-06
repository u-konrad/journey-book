const truncateText = (text, maxChars='400') => {
    if (!text) return "";
    if (text.length <= maxChars) {
      return text;
    } else {
      const endIndex = text.lastIndexOf(" ", maxChars - 1);
      return text.substr(0, endIndex) + "...";
    }
  };

  export default truncateText;