import processor from "./processor";

var parser = {};

parser.parse = code => {
    processor.reset()
    const lineWiseSplit = [];
    var tags = new Map();
    //const tags=[];
  
    code.split("\n").forEach(line => {
      var lineArr = line.trim().split(/[ ,\t]+/)
      lineWiseSplit.push(lineArr);
    });
    for(let i=0; i<lineWiseSplit.length; i++)
    {
        if(lineWiseSplit[i][0].includes(":"))
        {
            tags.set(lineWiseSplit[i][0], i)
        }
    }
    var index = 268500992
    for(let i=0; i<lineWiseSplit.length; i++)
    {
        
        if(lineWiseSplit[i][0].includes(":") && lineWiseSplit[i].includes(".word"))
        {
            let line = lineWiseSplit[i]
            line.splice(0,1)
            for(let j=1; j<line.length; j++, index=index+4)
            {
                let value = parseInt(line[j])
                processor.setMemory(index, value)
            }
        }
        else if(lineWiseSplit[i][0].includes(".word"))//only for storing integers
        {
            //tags.set(lineWiseSplit[i][0], i)
            for(let j=1; j<lineWiseSplit[i].length; j++, index=index+4)
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