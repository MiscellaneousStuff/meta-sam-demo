const getFile = async (data: URL) => {
    const response = await fetch(data);
    const blob = await response.blob();
    return new File([blob], "image.jpeg");
  };
  
  export default getFile;
  