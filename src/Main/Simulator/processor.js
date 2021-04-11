var processor = {
    memory: new Array(1024).fill(0),
    registers: new Map(
        [
            ["r0", 0],
            ["at", 0],
            ["v0", 0],
            ["v1", 0],
            ["a0", 0],
            ["a1", 0],
            ["a2", 0],
            ["a3", 0],
            ["t0", 0],
            ["t1", 0],
            ["t2", 0],
            ["t3", 0],
            ["t4", 0],
            ["t5", 0],
            ["t6", 0],
            ["t7", 0],
            ["s0", 0],
            ["s1", 0],
            ["s2", 0],
            ["s3", 0],
            ["s4", 0],
            ["s5", 0],
            ["s6", 0],
            ["s7", 0],
            ["t8", 0],
            ["t9", 0],
            ["k0", 0],
            ["k1", 0],
            ["gp", 0],
            ["sp", 0],
            ["s8", 0],
            ["ra", 0]
        ]
    ), 
    L1: new Array(8).fill(0), //3D array[set][block][offset]
    L2: new Array(32).fill(0), //3D array[set][block][offset]
    L1Tags: new Array(4).fill(0), //2D array[set][block]
    L2Tags: new Array(8).fill(0), //2D array[set][block]
    L1Priority: new Array(4).fill(0), //2D array[set][block]
    L2Priority: new Array(8).fill(0), //2D array[set][block]
    L1Size: 32,
    L1BlockSize: 8,
    L1Associativity: 2,
    L2Size: 128,
    L2BlockSize: 8,
    L2Associativity: 2,
}
processor.updateCacheSettings = (l1_size, l1_block, l1_asso, l2_size, l2_block, l2_asso) => {
    processor.L1Size = l1_size
    processor.L1BlockSize = l1_block
    processor.L1Associativity = l1_asso
    processor.L2Size = l2_size
    processor.L2BlockSize = l2_block
    processor.L2Associativity = l2_asso
}

processor.initializeCache = () => {
    //testing arrays
    /* let arr = [[[1,2], [3,4]],[[4,5], [6,7]]]
    console.log(arr)
    arr[0][0][0] = 5
    console.log(arr) */

    //initializing data array for L1
    let l1_block_size = processor.L1BlockSize/4 //no of words in a block
    let l1_blocks = processor.L1Associativity   //no of blocks in a set
    let l1_sets = processor.L1Size/(processor.L1Associativity*processor.L1BlockSize) //total number of sets in the cache
    let l1_block = new Array(l1_block_size).fill(0)
    //console.log("l1_block", l1_block)
    let l1_set = new Array()
    for(let i=0; i<l1_blocks; i++)
    {
        l1_set.push(l1_block)
        
    }
    //console.log("l1_set", l1_set)
    let l1 = new Array()
    for(let i=0; i<l1_sets; i++)
    {
        l1.push(l1_set)
    }
    processor.L1 = l1;
    //console.log("*", processor.L1)

    //initializing tags and priority for L1
    let l1_temp = new Array(l1_blocks).fill(-1) //no of blocks in a set, one entry for each block
    let l1_tags = new Array()
    let l1_priority = new Array()
    for(let i=0; i<l1_sets; i++)
    {
        l1_tags.push(l1_temp)
        l1_priority.push(l1_temp)
    }
    processor.L1Tags = l1_tags
    processor.L1Priority = l1_priority
    //console.log("L1 Tags", processor.L1Tags)
    //console.log("L1 Priority", processor.L1Priority)

    //initializing data array for L2
    let l2_block_size = processor.L2BlockSize/4 //no of words in a block
    let l2_blocks = processor.L2Associativity   //no of blocks in a set
    let l2_sets = processor.L2Size/(processor.L2Associativity*processor.L2BlockSize) //total number of sets in the cache
    let l2_block = new Array(l2_block_size).fill(0)
    //console.log("l1_block", l1_block)
    let l2_set = new Array()
    for(let i=0; i<l2_blocks; i++)
    {
        l2_set.push(l2_block)
        
    }
    //console.log("l1_set", l1_set)
    let l2 = new Array()
    for(let i=0; i<l2_sets; i++)
    {
        l2.push(l2_set)
    }
    processor.L2 = l2;
    //console.log("*", processor.L2)

    //initializing tags and priority for L2
    let l2_temp = new Array(l2_blocks).fill(-1) //no of blocks in a set, one entry for each block
    let l2_tags = new Array()
    let l2_priority = new Array()
    for(let i=0; i<l2_sets; i++)
    {
        l2_tags.push(l2_temp)
        l2_priority.push(l2_temp)
    }
    processor.L2Tags = l2_tags
    processor.L2Priority = l2_priority
    //console.log("L2 Tags", processor.L2Tags)
    //console.log("L2 Priority", processor.L2Priority)
}
processor.updateCache = (wordAddress) =>
{
    //most recently used will have priority value 0, least recently used will have priority value [no of blocks in a set-1]
    let index = (wordAddress-268500992)/4
    let data = processor.memory[index]
    //******************************************************* */
    //search L1, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L1
    let l1_block_size = processor.L1BlockSize/4 //no of words in a block
    let l1_blocks = processor.L1Associativity   //no of blocks in a set
    let l1_sets = processor.L1Size/(processor.L1Associativity*processor.L1BlockSize) //total number of sets in the cache
    let l1set_index = index%l1_sets  //this is the set number which this address belongs to
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1_flag = 0
    console.log("set index ", l1set_index)
    console.log("block index ", l1block_index)
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(processor.L1Tags[l1set_index][i] == l1block_index)
        {
            //search successful, found in this set
            l1_flag=1
            if(processor.L1Priority[l1set_index][i] != 0)
            {
                for(let j=0; j<l1_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    processor.L1Priority[l1set_index][j]++
                }
                processor.L1Priority[l1set_index][i]=0
            }
            else
            {
                //no need to update priorities because it is already the most recently used
            }
        }
    }
    if(!l1_flag)//if the search was unsuccessful, need to write/overwrite
    {
        console.log("not found in l1")
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(processor.L1Priority[l1set_index][i] == -1 || processor.L1Priority[l1set_index][i] >= l1_blocks-1)
            {
                processor.L1Priority[l1set_index][i] = 0
                processor.L1Tags[l1set_index][i] = l1block_index
                for(let j=0; j<l1_block_size; j++)//parsing through the block
                {
                    let t = l1block_index*l1_block_size
                    processor.L1[l1set_index][l1block_index][j] = processor.memory[t+j]
                }
                console.log("*")
                break
            }    
            console.log("check")        
        }
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(processor.L1Priority[l1set_index][i] != -1 && processor.L1Priority[l1set_index][i] != 0)
                processor.L1Priority[l1set_index][i]++
        }
    }
    console.log("L1 data", processor.L1)
    console.log("L1 Tags", processor.L1Tags)
    console.log("L1 Priority", processor.L1Priority)
    //************************************************************************************* */
    //search L2, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L2
} 

processor.setInitialMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    processor.memory[index]=value
}
processor.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    processor.memory[index]=value
    processor.updateCache(wordAddress) 

}
processor.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    processor.updateCache(wordAddress) 
    return processor.memory[index]
} 

processor.setRegister = (reg, num) => {
    if(reg==='r0' || reg==='zero')
        processor.registers.set('r0', 0)
    else
        processor.registers.set(reg, num)
}

processor.getRegister = (reg) => {
    if(reg === "zero" || reg==='r0'){
        return 0;
    }
    return processor.registers.get(reg)
}

processor.reset = () => {    
    processor.memory = new Array(1024).fill(0) 
    processor.pc = 0
    processor.registers = new Map(
        [
            ["r0", 0],
            ["at", 0],
            ["v0", 0],
            ["v1", 0],
            ["a0", 0],
            ["a1", 0],
            ["a2", 0],
            ["a3", 0],
            ["t0", 0],
            ["t1", 0],
            ["t2", 0],
            ["t3", 0],
            ["t4", 0],
            ["t5", 0],
            ["t6", 0],
            ["t7", 0],
            ["s0", 0],
            ["s1", 0],
            ["s2", 0],
            ["s3", 0],
            ["s4", 0],
            ["s5", 0],
            ["s6", 0],
            ["s7", 0],
            ["t8", 0],
            ["t9", 0],
            ["k0", 0],
            ["k1", 0],
            ["gp", 0],
            ["sp", 0],
            ["s8", 0],
            ["ra", 0]
        ]
    )
    processor.initializeCache()
}

export default processor 

/*
* three arrays -> all arrays sizes=cache size/block size ; data, tag, priority = [0,associativity-1]
* example: cache size=32, block size=8, k=2
*/ 