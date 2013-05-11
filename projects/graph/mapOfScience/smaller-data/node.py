import random

colors = [
    "Blue",
    "OliveGreen",
    "Canary",
    "Peach",
    "Dandelion",
    "Mahogany",
    "Lavender",
    "SkyBlue",
    "MulBerry",
    "BrickRed",
    "Yellow",
    "Emerald",
    "Red"
    ]
    

class Node(dict):

    def __init__(self, ID, name, x, y, xfact, yfact, color=None, isLabel=False):
        self["id"] = ID
        self["name"] = name
        self["x"] = x
        self["y"] = y
        self["xfact"] = xfact
        self["yfact"] = yfact
        self["color"] = color if color is not None else RandomColor()
        self["group"] = 1 if isLabel else 0


def RandomColor():
    return random.choice(colors)
