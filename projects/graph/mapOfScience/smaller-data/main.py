#!/usr/bin/env python

import json, node, link, random

if __name__ == "__main__":
    nodes = []
    links = []

    for i in range(50):
        x = random.randint(100, 500)
        y = random.randint(100, 350)
        xfact = random.uniform(5, 20)
        yfact = random.uniform(5, 20)
        nodes.append(node.Node(i, str(i), x, y, xfact, yfact))

    for i in range(len(nodes) * 2):
        s = random.randint(0, len(nodes)-1)
        t = random.randint(0, len(nodes)-1)
        if s == t:
            continue

        w = random.randint(40, 100)

        links.append(link.Link(nodes[s], nodes[t], w))

    data = {"nodes": nodes,
            "links": links}

    filename = raw_input("Save to what filename? ")
    
    with open(filename, 'w') as fout:
        fout.write(json.dumps(data))

             
