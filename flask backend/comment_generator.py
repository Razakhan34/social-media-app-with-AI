# comment_generator.py

import os
from caption_generator import generate_caption, generate_caption_with_LLM_BARD
from PredictingEmotion import PredictingEmotion
import cv2
from deepface import DeepFace
from time import time

import asyncio
# Initialize the emotion predictor
emotion_predictor = PredictingEmotion()
# funtion to detect emotion from user expression
def detect_emotion_of_current_user():
#   user_emotion = "Happy"
#   results = emotion_predictor.detect_emotions()
#   print("emotion is")
#   print(results)
#   # Return JSON response
#   if results and len(results) > 0:
#       response = {"emotions": results}
#   else:
#       response = {"emotions": ["happy"]}  # Default to happy if no emotions detected
#   user_emotion = response["emotions"][-1]
#   print(user_emotion)
#   return user_emotion
    user_emotion = "happy"
    cap = cv2.VideoCapture(0)
    start_time = time()
    results = []

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame.")
            break

        # Convert the frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Load OpenCV's pre-trained Haar Cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            # Crop the detected face
            face = frame[y:y+h, x:x+w]

            try:
                # Analyze the emotion using DeepFace
                analysis = DeepFace.analyze(face, actions=['emotion'], enforce_detection=False)
                dominant_emotion = analysis[0]['dominant_emotion'].lower()
                results.append(dominant_emotion)
            except Exception as e:
                print(f"Error analyzing face: {e}")

        # Check if 5 seconds have passed
        if time() - start_time >= 5:
            break

    cap.release()
    
    print("emotion is")
    print(results)
    
    # Return JSON response
    if results and len(results) > 0:
        response = {"emotions": results}
    else:
        response = {"emotions": ["happy"]}  # Default to happy if no emotions detected
    
    user_emotion = response["emotions"][-1]
    print(user_emotion)
    return user_emotion



def generate_comment(image_path):
    """
    Generate a social media comment based on the user's image.
    1. Detect the user's emotion from the image.
    2. Analyze the image using the BLIP model to extract a caption.
    3. Depending on the detected emotion, create a prompt for the Bard LLM.
    4. Generate and return the comment.
    """
   
    # Step 1: Detect the user's emotion from the image
    user_emotion = detect_emotion_of_current_user()
        
     # Step 2: Analyze the image to generate a descriptive caption
    caption = generate_caption(image_path)
    if not caption:
        caption = "an interesting image"
    print(caption)
    
    # # Step 3: Formulate a custom prompt based on the emotion
    # # ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
    if user_emotion in ["happy", "surprise"]:
        prompt = (
            f"Write a positive, upbeat, and appreciation comment on the following description: "
            f"'{caption}'. Keep it fun and uplifting."
        )
    elif user_emotion in ["sad", "fear", "disgust","neutral"]:
        prompt = (
          f"Write a strongly negative comment on the following description: '{caption}'. "
          "Express disapproval and strong negative emotion. For example, if the image shows a public kiss, you might say, "
          "'This picture is really making me angry—public displays like this are unacceptable.'"
        )
    else:
        prompt = (
            f"Write an engaging and thoughtful comment on the following description: '{caption}'."
        )
    # # Step 4: Use the Bard LLM function to generate the comment
    comment = generate_caption_with_LLM_BARD(prompt)
    comment = comment.strip('\'"')
    return comment

if __name__ == "__main__":
    print("Test generate_comment():", generate_comment())