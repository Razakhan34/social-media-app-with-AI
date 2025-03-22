import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import os

# Step 1: Setup device (GPU if available)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# print(f"✅ Using device: {device}")

# Step 2: Load the processor and model from local directory
BASE_DIR = os.getcwd()  # current working directory
MODEL_DIR = os.path.join(BASE_DIR, 'blip_model', 'model')           # path to model folder
PROCESSOR_DIR = os.path.join(BASE_DIR, 'blip_model', 'processor')   # path to processor folder

# Load from the local paths
print("🔄 Loading processor and model...")
processor = BlipProcessor.from_pretrained(PROCESSOR_DIR)
model = BlipForConditionalGeneration.from_pretrained(MODEL_DIR).to(device)
print("✅ Model and processor loaded successfully!")

# Step 3: Define function to generate captions
def generate_caption(image_path):
    try:
        # Load and preprocess image
        print(f"🖼️ Loading image from {image_path}")
        image = Image.open(image_path).convert('RGB')

        # Process image
        inputs = processor(images=image, return_tensors="pt").to(device)

        # Generate caption
        output = model.generate(
            **inputs,
            max_length=50,
            num_beams=5,
            repetition_penalty=1.2,
            no_repeat_ngram_size=2
        )

        # Decode and return the caption
        caption = processor.decode(output[0], skip_special_tokens=True)
        # print(f"✅ Generated caption: {caption}")
        return caption

    except Exception as e:
        print(f"❌ Error generating caption: {e}")
        return None

import google.generativeai as genai # type: ignore

def generate_caption_with_LLM_BARD(input_caption):
  # Configure API key from Google AI Studio
  genai.configure(api_key=os.getenv('google_api_key_for_llm'))
  # for m in genai.list_models():
  #     print(m.name)

  # Initialize Gemini Pro (Text Only)
  model = genai.GenerativeModel(model_name="gemini-1.5-flash")
  
  # Create the prompt for Gemini
  prompt = (
      f"Write a creative and engaging social media caption based on the description: "
      f"'{input_caption}'. The caption should be fun, catchy, and within two lines."
  )

  # Generate content
  response = model.generate_content(prompt)

  # Print the result
  return response.text
