import base64

for file_i in range(1, 17):
	file_name = str(file_i)
	f = open(f'{file_name}.png', 'rb').read()
	f = base64.b64encode(f)

	fout = open(f'{file_name}.blob', 'wb')
	fout.write(f)
