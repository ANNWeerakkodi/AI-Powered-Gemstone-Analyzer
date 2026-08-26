import json
import tensorflow as tf

MODEL_PATH = 'mlmodel/model.keras'
model = tf.keras.models.load_model(MODEL_PATH)

print("Output shape:", model.output_shape)

# Try to find class indices in metadata or config
if hasattr(model, 'class_indices'):
    print("Class indices found:", model.class_indices)
else:
    print("No class_indices attribute.")
    
# check the last layer
last_layer = model.layers[-1]
print("Last layer config:", last_layer.get_config())
