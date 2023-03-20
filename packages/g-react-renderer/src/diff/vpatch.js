const patch = {};
patch.REMOVE = 0;
patch.REPLACE = 1;  // node replace
patch.TEXT = 2;  // text replace
patch.PROPS = 3;
patch.INSERT = 4;
patch.REORDER = 5;

export default patch;