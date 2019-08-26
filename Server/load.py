import numpy as np
from keras.backend.tensorflow_backend import set_session
from keras.models import load_model
from keras import optimizers
from scipy.misc import imread, imresize,imshow
import tensorflow as tf


def init():
	#Enable GPU
	config = tf.ConfigProto()
	config.gpu_options.allow_growth = True  # dynamically grow the memory used on the GPU
	config.log_device_placement = True

	sess = tf.Session(config=config)
	set_session(sess)  # set this TensorFlow session as the default session for Keras
	#sess.run(init_op)
	loaded_model = load_model('Models/inception_model_keras.h5')
	loaded_model.load_weights('Weights/inception_model_weights.h5')
	print("Loaded Model from disk")

	#compile and evaluate loaded model
	loaded_model.compile(loss='binary_crossentropy',optimizer=optimizers.RMSprop(lr=2e-5),metrics=['acc'])

	#X_test = np.load('test_input.npy')
	#prediction = loaded_model.predict(X_test)
	#print('prediction:', prediction)
	#print('accuracy:', accuracy)
	graph = tf.get_default_graph()

	return loaded_model,graph
