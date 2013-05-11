#!/usr/bin/env python

import csv
import json
import sys

def findAttr(inFile, attr):
    """
    String inFile
      The name of the file to parse data from
      
    String attr
      The attribute of the decompressed data to find
      the variety of attributes for.
    """
    varia = []
    with open(inFile) as f:
        data = json.loads(f.read())
        nodes = data["nodes"]
        links = data["links"]

        for node in nodes:
            varia.append(node[attr])
        print {attr:varia}

        if len(varia) > 0:
            if isinstance(varia[0], float) or isinstance(varia[0], int):
                maxi = varia[0]
                mini = varia[0]
                for e in varia:
                    mini = e if e < mini else mini
                    maxi = e if e > maxi else maxi

                print "Min: %.02f, Max: %.02f" % (mini, maxi)

        
    
if __name__ == "__main__":
    """
    Takes a D3.js Force Style data json.
    """
    inFileName = sys.argv[1]
    attr = sys.argv[2]
    findAttr(inFileName, attr)
