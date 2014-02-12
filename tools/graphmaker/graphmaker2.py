#!/usr/bin/env python

import csv
import json

def main():
    onEdges = False
    nodes = []
    links = []
    with open("data.txt") as f:
        reader = csv.reader(f, delimiter=",", quotechar="\"")
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
                    links.append(Link(params))
                else:                    
                    nodes.append(Node(params))

    data = dict()
    data["nodes"] = nodes
    data["links"] = links

    result = json.dumps(data)
    outFile = open(raw_input("Save to what filename?: "), 'w')
    outFile.write(result)
    

def Node(nodeParams):
    node = dict()
    node["id"] = nodeParams[0]
    node["name"] = nodeParams[1]
    node["x"] = float(nodeParams[2])
    node["y"] = float(nodeParams[3])
    node["xfact"] = float(nodeParams[5])
    node["yfact"] = float(nodeParams[7])
    node["color"] = nodeParams[9]
    node["group"] = int(nodeParams[12])
    return node

def Link(linkParams):
    link = dict()
    link["source"] = int(linkParams[0]) - 1
    link["target"] = int(linkParams[1]) - 1
    link["value"] = 1
    link["weight"] = int(float(linkParams[2])*100)
    link["color"] = linkParams[4]
    return link
    
    
if __name__ == "__main__":
    main()
