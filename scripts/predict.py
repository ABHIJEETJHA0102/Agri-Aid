import base64
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.xception import preprocess_input
import tensorflow as tf
import sys
import matplotlib.image as mpimg
import warnings
warnings.filterwarnings("ignore")
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Set TensorFlow logging level to suppress INFO messages

# Import TensorFlow and other necessary modules
import tensorflow as tf
from tensorflow.keras.models import load_model
tf.get_logger().setLevel('ERROR')  # Set TensorFlow logger to only display ERROR messages
# Load the model weights
# model = load_model('weights.h5')

# Your prediction code here

# Load the image
def main2():
    # sys.stdout.write("called")
    # Resize the image to the expected input size
    arr=arr = ['Apple__Apple_scab', 'Apple_Black_rot', 'Apple_Cedar_apple_rust', 'Apple_healthy', 'Blueberry_healthy', 'Cherry(including_sour)__healthy', 'Cherry(including_sour)__Powdery_mildew', 'Corn(maize)__Cercospora_leaf_spot Gray_leaf_spot', 'Corn(maize)__Common_rust', 'Corn_(maize)__healthy', 'Corn(maize)__Northern_Leaf_Blight', 'Grape_Black_rot', 'Grape_Esca(Black_Measles)', 'Grape__healthy', 'Grape_Leaf_blight(Isariopsis_Leaf_Spot)', 'Orange__Haunglongbing(Citrus_greening)', 'Peach__Bacterial_spot', 'Peach_healthy', 'Pepper,_bell_Bacterial_spot', 'Pepper,_bell_healthy', 'Potato_Early_blight', 'Potato_healthy', 'Potato_Late_blight', 'Raspberry_healthy', 'Soybean_healthy', 'Squash_Powdery_mildew', 'Strawberry_healthy', 'Strawberry_Leaf_scorch', 'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_healthy', 'Tomato_Late_blight', 'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot', 'Tomato_Spider_mites Two-spotted_spider_mite', 'Tomato_Target_Spot', 'Tomato_Tomato_mosaic_virus', 'Tomato__Tomato_Yellow_Leaf_Curl_Virus']
    # image_path = "./scripts/image.jpg"
    # img = image.load_img(image_path, target_size=(224, 224))
    # img_array = image.img_to_array(img)
    # img_array = np.expand_dims(img_array, axis=0)
    # Get the base64 image data from the command line arguments
    image_data = sys.argv[1]

    # Decode the base64 string to bytes
    try:
        image_bytes = base64.b64decode(image_data)
    except Exception as e:
        print(f"Error decoding base64 string: {e}")
        return

    # Convert bytes to a NumPy array
    img_array = np.frombuffer(image_bytes, dtype=np.uint8)

    # Load the image using Keras
    img = image.array_to_img(img_array)
    img = img.resize((224, 224))  # Resize to target size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    print("Image successfully processed.")

    # Preprocess the input
    img_array_copy = img_array.copy()  # Create a copy of the array
    img_array_copy = preprocess_input(img_array_copy)

    # Load the model and make predictions
    base_model = tf.keras.applications.xception.Xception(weights='imagenet', include_top=False, input_shape=(224, 224, 3), pooling='max')

    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(38, activation='softmax')
    ])

    # Load the saved weights
    model.load_weights("./scripts/weights.h5")
    # sys.stdout.write("hi")
    # Make predictions on the image
    predictions = model.predict(img_array_copy)
    predicted_class_index = np.argmax(predictions[0])
    sys.stdout.write("  ")
    sys.stdout.write(str(arr[predicted_class_index]))
    sys.stdout.flush()
    return str(arr[predicted_class_index-1])

main2()
# You can now work with the predictions as needed

# print(type(predictions))
# sys.stdout.write(predictions.tolist())
# predicted_class_index = np.argmax(predictions[0])
# sys.stdout.write(str(predicted_class_index))
# sys.stdout.flush()
exit()