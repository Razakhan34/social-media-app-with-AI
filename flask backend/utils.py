import cv2
import cloudinary
import cloudinary.uploader
import os
import json
from bson import ObjectId
from datetime import datetime, timezone
from bson import json_util


# Custom JSON Encoder class to handle datetime serialization
class CustomJSONEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        return super().default(obj)
      
def upload_to_cloudinary(image_path):
    try:
        # Upload image to Cloudinary
        upload_result = cloudinary.uploader.upload(image_path, folder="social/chat/emotion")
        
        # Extract public ID and URL from upload result
        public_id = upload_result['public_id']
        url = upload_result['secure_url']
        
        return {
            'public_id': public_id,
            'url': url
        }
    except Exception as e:
        print("Error uploading image to Cloudinary:", e)
        return None
      
def detect_user_image():
    camera = cv2.VideoCapture(0)
    _, frame = camera.read()
    # Save image locally
    cv2.imwrite('temp_image.jpg', frame)

    # Upload image to Cloudinary
    cloudinary_response = upload_to_cloudinary('temp_image.jpg')
    
    return cloudinary_response