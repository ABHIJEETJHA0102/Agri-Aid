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
    image_path = 'image.jpg'
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

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
    model.load_weights("weights.h5")
    # sys.stdout.write("hi")
    # Make predictions on the image
    predictions = model.predict(img_array_copy)
    predicted_class_index = np.argmax(predictions[0])
    sys.stdout.write("  ")
    sys.stdout.write(str(predicted_class_index))
    sys.stdout.flush()
    return str(predicted_class_index)

main2()
# You can now work with the predictions as needed

# print(type(predictions))
# sys.stdout.write(predictions.tolist())
# predicted_class_index = np.argmax(predictions[0])
# sys.stdout.write(str(predicted_class_index))
# sys.stdout.flush()
exit()