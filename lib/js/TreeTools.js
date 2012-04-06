var TreeTools = new function(){

  /**
   * arrayToTree : Node[] --> Tree<Node>
   * tree takes an array of node objects with an id
   * and a property "children" whose value is a list of ids
   * corresponding to other nodes within the array and builds
   * a tree of nested nodes where the ids in the children arrays
   * are replaced with the children themselves.
   */
  this.arrayToTree = function(nodeArray) {
    function treeRecur(rootNode){
      var newNode = {};
      var children = new Array(0);

      // Retain data from the arrayNode to the treeNode.
      newNode["name"] = rootNode["label"];
      newNode["ID"]   = rootNode["ID"];
      newNode["idea"] = rootNode["idea"];
      newNode["url"]  = rootNode["url"];

      // Determine the children of this node (but also recur).
      var rootChildren = rootNode["children"];
      for (var i = 0; i < rootChildren.length; i++){
        var childID = rootChildren[i];
        var child = getNodeByID(childID, nodeArray);
        var childLabel = child["label"];
        children.push( treeRecur(child) );
      }

      // Don't bother adding an empty array.
      if(children.length > 0){
        newNode["children"] = children;
      }

      return newNode;
    }
    
    // Special case for OUR (InPhO) taxonomy.
    var rootNode = {"ID": 0, "label": "Philosophy", "url":"/taxonomy", "children": TreeTools.findOrphans(nodeArray)};
    return  treeRecur(rootNode);
  }


  /**
   * getNodeByID : int, Node[] --> Node
   * getNodeByID takes an id and a list of nodes as an array and
   * returns the associated object whose "ID" === id.
   */
  var getNodeByID = function(id, nodeArray) {
    for (var i = 0; i < nodeArray.length; i++) {
      var node = nodeArray[i];
      if (node["ID"] === id) {
        return node;
      }
    }
  }


  /**
   * member : <T>, <T>[] --> boolean
   * member returns true if the given value occurs
   * as a member of the array and false otherwise.
   */
  var member = function(obj, array){
    for(var i = 0; i < array.length; i++){
      var cursor = array[i];
      if (obj == cursor){
        return true;
      }
    }
    return false;
  }


  /**
   * findChildrenIDs : Node[] --> int[]
   * findChildrenIDs takes a flat taxonomy as an array of nodes
   * and returns an array containing all of the IDS of nodes
   * listed as children by some other node.
   */
  this.findChildrenIDs = function(nodeArray){
    var allkids = new Array(0);
    for(var i = 0; i < nodeArray.length; i++) {
      // for each ideaNode, add its kids to the kids pool
      var idea = nodeArray[i];
      allkids = allkids.concat(idea["children"]);
    }
    return allkids;
  }


  /**
   * findOrphans : Node[] --> Node[]
   * findOrphans takes an array of nodes and returns
   * a new array of nodes containing nodes which have
   * no parents.
   */
  this.findOrphans = function(nodeArray){
    var orphanIDs = new Array(0);
    for(var i = 0; i < nodeArray.length; i++) {
      var idea = nodeArray[i];
      var ideaID = idea["ID"];
      var kidsArray = this.findChildrenIDs(nodeArray);

      if(!member(ideaID, kidsArray)){
        orphanIDs.push(ideaID);
      }
    }
    return orphanIDs;
  };

};


document.write(JSON.stringify(TreeTools.arrayToTree(taxonomy)));
