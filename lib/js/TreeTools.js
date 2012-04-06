var TreeTools = new function(){

  /**
   * buildTaxonomy : array --> tree
   * buildTaxonomy takes a json object with an id and a property "children" whose value is a
   * list of ids corresponding to json objects inside the taxonomy and builds
   * a tree of nested json ob
   */
  this.buildTree = function(nodeArray) {
    function treeRecur(rootNode){
      var newNode = {};
      var children = new Array(0);

      newNode["name"] = rootNode["label"];
      newNode["ID"] = rootNode["ID"];
      newNode["idea"] = rootNode["idea"];
      newNode["url"] = rootNode["url"];

      var rootChildren = rootNode["children"];
      for (var i = 0; i < rootChildren.length; i++){
        var childID = rootChildren[i];
        var child = getNodeByID(childID, taxonomy);
        var childLabel = child["label"];
        children.push( treeRecur(child) );
      }

      if(children.length > 0){
        newNode["children"] = children;
      }

      return newNode;
    }

    var rootNode = {"ID": 0, "label": "Philosophy", "children": TreeTools.findOrphans(nodeArray)};
    return  treeRecur(rootNode);
  }


  /**
   * getNodeByID takes an id and a list of nodes as an array and
   * returns the associated object whose "ID" === id.
   */
  function getNodeByID(id, nodeArray) {
    for (var i = 0; i < nodeArray.length; i++) {
      var node = nodeArray[i];
      if (node["ID"] === id) {
        return node;
      }
    }
  }

  /**
   * member : obj, array --> boolean
   *
   */
  // checks membership of an ID in an array
  function member(id, array){
    for(var i = 0; i < array.length; i++){
      var cursor = array[i];
      //alert(cursor);
      if (id == cursor){
        return true;
      }
    }
    return false;
  }


  /**
   *
   */
  function kids(){
    var allkids = new Array(0);
    for(var i = 0; i < taxonomy.length; i++) {
      // for each idea, add its kids to the kids pool
      var idea = taxonomy[i];
      allkids = allkids.concat(idea["children"]);
    }
    return allkids;
  }



  /**
   * findOrphans: nodeArray --> nodeArray
   * findOrphans takes an array of nodes and returns
   * a new array of nodes containing nodes which have
   * no parents.
   */
  this.findOrphans = function(nodeArray){
    var orphanIDs = new Array(0);
    for(var i = 0; i < nodeArray.length; i++) {
      var idea = nodeArray[i];
      var ideaID = idea["ID"];
      var kidsArray = kids();

      if(!member(ideaID, kidsArray)){
        orphanIDs.push(ideaID);
      }
    }
    return orphanIDs;
  };

};


document.write(JSON.stringify(TreeTools.buildTree(taxonomy)));
