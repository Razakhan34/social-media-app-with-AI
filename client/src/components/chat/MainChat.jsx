import { useEffect, useState } from "react";
import SendMessage from "./SendMessage";
import CurrentUserHeader from "./CurrentUserHeader";
import Messages from "./Messages";
import useConversation from "../../zhustand/useConversation";
import NoChatSelected from "./NoChatSelected";
import ImageUploadPreview from "./ImageUploadPreview";

const MainChat = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [emotionPermissionAllowed, setEmotionPermissonAllowed] =
    useState(false);

  const emotionPermissionHandler = (isAllow) => {
    setEmotionPermissonAllowed(isAllow);
  };

  const uploadChatImageHandler = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    files.forEach((currFile) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((prev) => [...prev, reader.result]);
          setImagesPreview((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(currFile);
    });
  };

  const removeImageHandler = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setImagesPreview((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const cleanChatImageHandler = () => {
    setImages([]);
    setImagesPreview([]);
  };

  useEffect(() => {
    // Cleanup function (unmounts)
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  return (
    <div className="chat-messages-container">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <CurrentUserHeader selectedUserInfo={selectedConversation} />
          <Messages onEmotionPermission={emotionPermissionHandler} />
          {imagesPreview.length > 0 && (
            <ImageUploadPreview
              imagesPreview={imagesPreview}
              onRemoveImage={removeImageHandler}
            />
          )}
          <SendMessage
            images={images}
            onCleanChatImageHandler={cleanChatImageHandler}
            onUploadChatImage={uploadChatImageHandler}
            emotionPermissionAllowed={emotionPermissionAllowed}
          />
        </>
      )}
    </div>
  );
};

export default MainChat;
