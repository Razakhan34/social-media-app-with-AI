/* eslint-disable react/prop-types */
const ImageUploadPreview = ({ imagesPreview }) => {
  return (
    <div className="image-upload-preview-container">
      {imagesPreview.map((image, index) => (
        <div className="image-preview-box" key={index + 1}>
          <i className="fas fa-times-circle"></i>
          <img src={image} alt="User Upload" />
        </div>
      ))}
    </div>
  );
};

export default ImageUploadPreview;
