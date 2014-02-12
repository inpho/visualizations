#!/usr/bin/env python

# Works on data.txt

import csv
from json import dumps

def main():
    onEdges = False
    nodes = []
    links = []
    colors = {}
    with open("data.txt") as f:
        reader = csv.reader(f, delimiter=" ", quotechar="\"")
        for line in reader:
            params = []
            for word in line:
                params.append(word)
                
            if params[0] == "*vertices":
                continue
            elif params[0] == "*edges":
                onEdges = True
                continue
            else:
                if (onEdges):
                    continue
                else:
                    color = params[9]
                    colors[color] = color

    for key, value in colors.items():
        print key
        
    
if __name__ == "__main__":
    main()
