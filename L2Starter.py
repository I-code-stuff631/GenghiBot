import multiprocessing
import os
import time

def func1():
	os.system('node GenghiBotMC.js')


if __name__ == '__main__':
	while True:
		p = multiprocessing.Process(target=func1, name="Foo")
		p.start()
		time.sleep(300)
		p.terminate()
		p.join()
		time.sleep(5)

