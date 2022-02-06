const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
    }).format(date);
  };

  export default formatDate;
