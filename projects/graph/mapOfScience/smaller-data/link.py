
class Link(dict):
    def __init__(self, sourceNode, targetNode, weight, value=1, color=None):
        self["source"] = sourceNode["id"]
        self["target"] = targetNode["id"]
        self["value"]  = value
        self["weight"] = weight
        self["color"]  = color if color is not None else sourceNode["color"] if sourceNode["color"] == targetNode["color"] else "Gray40"
