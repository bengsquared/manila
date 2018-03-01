from __future__ import print_function
from pyglass import pyglass
import sys
import zerorpc

class PreviewApi(object):
    def getPreview(self, path):
        """based on the path, return the path to the Quick Look file"""
        try:
            imgpath = pyglass.preview(path)
            if imgpath[0]:
                return imgpath[0]
            else:
                return ""
        except Exception as e:
            return ""
    
    def test(self):
        return "okay!"
        
    def echo(self, text):
        """echo any text"""
        return text

def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)

def main():
    addr = 'tcp://0.0.0.0:' + parse_port()
    s = zerorpc.Server(PreviewApi())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()
    
addr = 'tcp://0.0.0.0:' + parse_port()
s = zerorpc.Server(PreviewApi())
s.bind(addr)
s.run()

if __name__ == '__main__':
    main()
    
    