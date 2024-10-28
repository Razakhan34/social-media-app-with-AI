import cv2
import numpy as np
from time import time
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import tensorflow
from tensorflow.keras.preprocessing.image import ImageDataGenerator

class PredictingEmotion:
  # Load the emotion detection model
  classifier = load_model('./model_optimal_with_resnet_block.h5')
  # classifier = load_model('./model_optimal_with_resnet_block.h5')
  class_labels = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
  def __init__(self):
    # Data augmentation for more robust training
    self.datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest')
    
  def detect_emotions(self):
    cap = cv2.VideoCapture(0)
    start_time = time()
    results = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert image to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Detect faces in the image
        face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + '/haarcascade_frontalface_default.xml')
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

            if np.sum([roi_gray]) != 0:
                roi = roi_gray.astype('float') / 255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)
                
                # Augment the image data
                augmented_images = self.datagen.flow(roi, batch_size=1)
                for aug_image in augmented_images:
                  # Make prediction
                  preds = self.classifier.predict(aug_image)[0]
                  dominant_emotion = self.class_labels[preds.argmax()]
                  results.append(dominant_emotion)
                  break  # Only predict on the original and augmented image

                # Make prediction
                # preds = self.classifier.predict(roi)[0]
                # dominant_emotion = self.class_labels[preds.argmax()]
                # results.append(dominant_emotion)

        # Check if 5 seconds have passed
        if time() - start_time >= 5:
            break

    cap.release()
    return results
  
  def detect_emotions_from_image(self,image_path):
    frame = cv2.imread(image_path)

    # Convert image to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the image
    face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + '/haarcascade_frontalface_default.xml')
    faces = face_classifier.detectMultiScale(gray, 1.3, 5)

    results = []

    for (x, y, w, h) in faces:
      roi_gray = gray[y:y+h, x:x+w]
      roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

      if np.sum([roi_gray]) != 0:
          roi = roi_gray.astype('float') / 255.0
          roi = img_to_array(roi)
          roi = np.expand_dims(roi, axis=0)
          
          # Augment the image data
          augmented_images = self.datagen.flow(roi, batch_size=1)
          for aug_image in augmented_images:
              # Make prediction
              preds = self.classifier.predict(aug_image)[0]
              print("Prediction",preds)
              dominant_emotion = self.class_labels[preds.argmax()]
              results.append(dominant_emotion)
              break  # Only predict on the original and augmented image

          # # Make prediction
          # preds = self.classifier.predict(roi)[0]
          # print("Prediction",preds)
          # dominant_emotion = self.class_labels[preds.argmax()]
          # results.append(dominant_emotion)
    return results