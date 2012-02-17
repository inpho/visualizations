/*
var taxonomy = [
  {"ID": 0,
   "children": [1, 2],
   "label": "zero"},

  {"ID": 1,
   "children": [3, 4],
   "label": "one"},

  {"ID": 2,
   "children": [5],
   "label": "two"},

  {"ID": 3,
   "children": [],
   "label": "three"},

  {"ID": 4,
   "children": [],
   "label": "four"},

  {"ID": 5,
   "children": [],
   "label": "five"}];
*/


/**
 * buildTaxonomy takes a json object with an id and a property "children" whose value is a
 * list of ids corresponding to json objects inside the taxonomy and builds
 * a tree of nested json ob
 */
function buildTree(rootNode) {
  var newRoot = {};
  newRoot[rootNode["label"]] = treeRecur(rootNode);
  return newRoot;
}

function treeRecur(rootNode){

  var newNode = {};
  var properties = {};

  var childArray = rootNode["children"];
  for (var i = 0; i < childArray.length; i++){
    var childID = childArray[i];
    var child = fetch(childID, taxonomy);
    var childLabel = child["label"];
    properties[childLabel] = treeRecur(child);
  }

  return properties;
}

/**
 * fetch takes an id and a list of nodes as an array and
 * returns the associated object whose "ID" === id.
 */
function fetch(id, nodeArray) {
  for (var i = 0; i < nodeArray.length; i++) {
    var node = nodeArray[i];
    if (node["ID"] === id) {
      return node;
    }
  }
}
/*
function checkIfSet(array){
  for(int i = 0; i < array.length; i++){
    var cursor = array[i];
    for(int j = 0; j < array.length; j++){
      var 
    }
  }
}
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

// gets an array of all kids of the taxonomy
function kids(){
  var allkids = new Array(0);
  for(var i = 0; i < taxonomy.length; i++) {
    // for each idea, add its kids to the kids pool
    var idea = taxonomy[i];
    allkids = allkids.concat(idea["children"]);
  }
  return allkids;
}


function orphans(){
  var orphanIDs = new Array(0);
  for(var i = 0; i < taxonomy.length; i++) {
    var idea = taxonomy[i];
    var ideaID = idea["ID"];
    var kidsArray = kids();
    if(!member(ideaID, kidsArray)){
      // otherwise, citizen of orphania
      orphanIDs.push(ideaID);
    }
  }
  return orphanIDs;
}

function prettyPrettyPrint(root){
  function helper(root, level){
    var str = "";
    for (node in root) {
      str += "\n";
      for(var i = 0; i < level; i++){
        str += "..";
      }
      str += node + ": {";
      str += helper(root[node], level+1);
      for(var i = 0; i < level; i++){
        if(i == 0){
          str += "\n";
        }
        str += "..";
      }
      str += "}";
    }
    return str;
  }
  return helper(root, 0);
}

function prettyPrint(root){
  function helper(root, level){
    
    var str = "{";
    for (node in root) {
      str += "\"" + node + "\": ";
      str +=  helper(root[node], level+1);
      str += "}, ";
    }
    return str;
  }
  return helper(root, 0);
}


rootIdea = {"ID": 0, "label": "TAXONOMY_ROOT", "children": orphans()};




function printArray(arr){
  var s = "";
  for(var i = 0; i < arr.length; i++){
    s += fetch(arr[i], taxonomy)["label"] + "<br />";
  }
  return s;
}

tree = buildTree(rootIdea);
document.write("<pre>" + prettyPrint(tree) + "</pre>");
