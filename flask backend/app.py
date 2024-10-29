from flask import Flask,request, jsonify
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import cv2
import numpy as np
from time import time
import cloudinary
import cloudinary.uploader
from pymongo import MongoClient
from flask_cors import CORS
import os
from datetime import datetime, timezone
from bson import ObjectId
import json
from flask_socketio import SocketIO
from flask_socketio import emit
from bson import json_util
from PredictingEmotion import PredictingEmotion
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from utils import CustomJSONEncoder, upload_to_cloudinary, detect_user_image

app = Flask(__name__)
CORS(app)

socketio = SocketIO(app, cors_allowed_origins=os.getenv('FRONTEND_URL'))

app.json_encoder = CustomJSONEncoder

#defining emotion predictor class
emotion_predictor = PredictingEmotion()

# Define API endpoint
@app.route('/emotion_detect', methods=['GET'])
def emotion_detect():
    # Detect emotions
    results = emotion_predictor.detect_emotions()
    print(results)
    # Return JSON response
    if results:
        response = {"emotions": results}
    else:
        response = {"emotions": ["happy"]}  # Default to happy if no emotions detected
    print(response)
    return jsonify(response)

#starting the code of detecting user face and emotion while chatting
# Configure MongoDB client
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['socialmedia']
collection_conversations = db['conversations']
collection_messages = db['messages']

#define function to take image from user and send to chat
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'))

# defining message class and save method
class Message:
    def __init__(self, sender_id, receiver_id, message='', images=None, emotion_image=None, emotion_prediction=None):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.message = message
        self.images = images if images else []
        self.emotion_image = emotion_image
        self.emotion_prediction = emotion_prediction
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "senderId": self.sender_id,
            "receiverId": self.receiver_id,
            "message": self.message,
            "images": self.images,
            "emotionImage": self.emotion_image,
            "emotionPrediction": self.emotion_prediction,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at
        }

    def save(self):
        message_data = self.to_dict()
        result = collection_messages.insert_one(message_data)
        return result.inserted_id

# Define a dictionary to store user IDs and their corresponding socket IDs
user_socket_map = {}
@socketio.on('connect')
def handle_connect():
    # part of the handshake.
    user_id = request.args.get('userId')
    print('Hello From python socket')
    if user_id:
        # Store the user's socket ID in the mapping
        print("Id has been mapped")
        user_socket_map[user_id] = request.sid
        
@socketio.on('disconnect')
def handle_disconnect():
    # Get the user ID of the disconnected client
    disconnected_user_id = request.args.get('userId')
    # Remove the entry from the mapping
    if disconnected_user_id in user_socket_map:
        del user_socket_map[disconnected_user_id]
             
#defining API for sending the emotion and image to databse and cloudinary
@app.route('/send_emotion_message/<receiver_id>', methods=['POST'])
def send_message(receiver_id):
    try:
        senderId = request.json.get('senderId')
        # take images and Upload images to Cloudinary
        cloudinary_response = detect_user_image()
        
        results = emotion_predictor.detect_emotions_from_image('temp_image.jpg')
        print(results)
        if results:
            emotion_predicted = results[0]
        else:
            # Handle the case where no emotions were detected
            emotion_predicted = "sad"
        # Delete temporary image file
        os.remove('temp_image.jpg')

        # Prepare message data
        message = Message(
            sender_id=senderId,
            receiver_id=receiver_id,
            emotion_image={
                'public_id': cloudinary_response['public_id'],
                'url': cloudinary_response['url']
            },
            emotion_prediction=emotion_predicted  # Temporary value
        )
        
        # Insert message into MongoDB
        new_message_id = message.save()

        # Find or create conversation
        conversation_query = {'participants': {"$all": [ObjectId(senderId), ObjectId(receiver_id)]}}
        conversation = collection_conversations.find_one(conversation_query)

        if not conversation:
            print("No conversation found. Creating a new one.")
            conversation_data = {
                'participants': [ObjectId(senderId), ObjectId(receiver_id)],
                'messages': [new_message_id]
            }
            conversation = collection_conversations.insert_one(conversation_data)
        else:
            print("Conversation found. Updating existing conversation.")
            # Add message to existing conversation
            collection_conversations.update_one(
                {'_id': conversation['_id']},
                {'$push': {'messages': new_message_id}}
            )


        new_message_result = collection_messages.find_one({'_id': new_message_id})
        
        # Convert ObjectId to string for JSON serialization
        new_message_result['_id'] = str(new_message_result['_id'])

        # Convert entire new message data to JSON
        new_message_json = json.dumps(new_message_result, cls=CustomJSONEncoder)
        
        new_message_json_for_emitting =  json.loads(json_util.dumps(new_message_result, cls=CustomJSONEncoder))
        
        
        # socketio.emit('newMessage', new_message_json_for_emitting, room=receiver_id)
        receiver_socket_id = user_socket_map.get(receiver_id)
        print("Socket ID ", receiver_socket_id)
        if receiver_socket_id:
        # Emit the message to the receiver's socket
            socketio.emit('newMessageFromFlask', new_message_json_for_emitting, room=receiver_socket_id)

        return jsonify({
            'success': True,
            'newMessage': new_message_json  # Return the ID of the new message
        })

    except Exception as e:
        print("Error in send_message controller:", e)
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

#just for testing purpose
# def testing_prediction():
    # camera = cv2.VideoCapture(0)
    # _, frame = camera.read()
    # # Save image locally
    # cv2.imwrite('happy_boy.jpg', frame)
    # results = emotion_predictor.detect_emotions_from_image('surprise_boy.jpg')
    # print(results)
    # # Delete temporary image file
    # os.remove('temp_image.jpg')
# testing_prediction()

if __name__ == '__main__':
    # Use the port provided by Render or default to 8000 for local testing
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
