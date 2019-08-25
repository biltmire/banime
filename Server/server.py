
from flask import Flask, render_template,request
import cv2
import numpy as np

import keras.models
import re
import base64
import sys

import os

sys.path.append(os.path.abspath("./Models"))

from load import *
app = Flask(__name__)

global model, graph
model, graph = init()

#decoding an image from base64 into raw representation
def convertImage(imgData1):
	#Regex search for beginning of base64 encoded image
	imgstr = re.search(b'base64,(.*)',imgData1).group(1)
	print(type(imgstr))
	with open('output.png','wb') as output:
		output.write(base64.b64decode(imgstr))


#Render the test page
@app.route('/')
def index():
	return render_template("test.html")

@app.route('/predict/',methods=['GET','POST'])
def predict():
	imgData = request.get_data()
	convertImage(imgData)
	x = cv2.imread('output.png',cv2.IMREAD_COLOR)
	#x = np.invert(x)
	x = cv2.resize(x,(256,256), interpolation=cv2.INTER_CUBIC)
	#print(x.shape)
	#convert to a 4D tensor to feed into our model
	#batch, channels, rows, cols
	x = x.reshape(1,256,256,3)
	#Normalize pixel values
	x = np.array((x - np.min(x)) / (np.max(x) - np.min(x)))
	#print(x.shape)
	#in our computation graph

	with graph.as_default():
		#perform the prediction
		out = model.predict(x)
		print(out)
		result = {1: 'Not Anime', 0: 'Anime'}
		print(result[int(out.round()[0])])
		#convert the response to a string
		response = result[int(out.round()[0])]
		return response



if __name__ == "__main__":
	#decide what port to run the app in
	port = int(os.environ.get('PORT', 5000))
	#run the app locally on the givn port
	app.run(host='0.0.0.0', port=port)
	#optional if we want to run in debugging mode
	#app.run(debug=True)
