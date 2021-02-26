import processor from "./processor";

var parser = {
  /* instruction: [],
  pointer: new Map(),
  dataAddr: new Map(),
  ptrArray: [],
  memPtr: 0 */
};

parser.parse = code => {
    processor.reset()
    const lineWiseSplit = [];
    var tags = new Map();
    //const tags=[];
  
    code.split("\n").forEach(line => {
      var lineArr = line.trim().split(/[ ,]+/)
      lineWiseSplit.push(lineArr);
      /* if(!(lineArr.length === 1 && lineArr[0] === "")) 
      {
          lineWiseSplit.push(lineArr);
      } */
    });
    for(let i =0; i<lineWiseSplit.length; i++)
    {
        if(lineWiseSplit[i][0].includes(":"))
        {
            tags.set(lineWiseSplit[i][0], i)
        }
    }
    for(let i=0; i<lineWiseSplit.length; i++)
    {
        if(lineWiseSplit[i][0].includes(".word"))//only for storing integers
        {
            //tags.set(lineWiseSplit[i][0], i)
            for(let j=1, index = 268500992; j<lineWiseSplit[i].length; j++, index=index+4)
            {
                let value = parseInt(lineWiseSplit[i][j])
                processor.setMemory(index, value)
            }
        }
        else if(lineWiseSplit[i][0].includes(".ascii"))//will deal with this later
        {
            //tags.set(lineWiseSplit[i][0], i)
        }
        else if(lineWiseSplit[i][0].includes(".asciiz"))
        {
            //tags.set(lineWiseSplit[i][0], i)
        }
    }

    // console.log(lineWiseSplit)
    // console.log(tags)
    return [lineWiseSplit, tags]
};
export default parser