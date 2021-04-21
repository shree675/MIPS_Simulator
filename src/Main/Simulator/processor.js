import { matrix } from 'mathjs'
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
    L1: [[[0],[0]],[[0],[0]]], //3D array[set][block][offset]
    L2: [[[0],[0]],[[0],[0]]], //3D array[set][block][offset]
    L1Tags: new Array(4).fill(0), //2D array[set][block]
    L2Tags: new Array(8).fill(0), //2D array[set][block]
    L1Priority: new Array(4).fill(0), //2D array[set][block]
    L2Priority: new Array(8).fill(0), //2D array[set][block]
    L1Size: 16,
    L1BlockSize: 4,
    L1Associativity: 1,
    L2Size: 128,
    L2BlockSize: 8,
    L2Associativity: 8,
    L1Latency: 1,
    L2Latency: 2,
    MMLatency: 10,
    isideal: false
}
processor.updateCacheSettings = (l1_size, l1_block, l1_asso, l2_size, l2_block, l2_asso, l1_latency, l2_latency, mm_latency, isideal) => {
    processor.L1Size = l1_size
    processor.L1BlockSize = l1_block
    processor.L1Associativity = l1_asso
    processor.L2Size = l2_size
    processor.L2BlockSize = l2_block
    processor.L2Associativity = l2_asso
    processor.L1Latency = l1_latency
    processor.L2Latency = l2_latency
    processor.MMLatency = mm_latency
    processor.isideal=isideal
}

processor.initializeCache = () => {

    processor.L1=new Array(0);
    processor.L2=new Array(0);

    //initializing data array for L1
    let l1_block_size = processor.L1BlockSize/4 //no of words in a block
    let l1_blocks = processor.L1Associativity   //no of blocks in a set
    let l1_sets = processor.L1Size/(processor.L1Associativity*processor.L1BlockSize) //total number of sets in the cache
    processor.L1 = matrix().resize([l1_sets,l1_blocks,l1_block_size])

    //initializing tags and priority for L1
    processor.L1Tags = matrix().resize([l1_sets,l1_blocks], -1)
    processor.L1Priority = matrix().resize([l1_sets,l1_blocks], -1)

    //initializing data array for L2
    let l2_block_size = processor.L2BlockSize/4 //no of words in a block
    let l2_blocks = processor.L2Associativity   //no of blocks in a set
    let l2_sets = processor.L2Size/(processor.L2Associativity*processor.L2BlockSize) //total number of sets in the cache
    processor.L2 = matrix().resize([l2_sets,l2_blocks,l2_block_size])

    //initializing tags and priority for L2
    processor.L2Tags = matrix().resize([l2_sets,l2_blocks], -1)
    processor.L2Priority = matrix().resize([l2_sets,l2_blocks], -1)
}
processor.updateCache = (wordAddress, store) =>
{
    //most recently used will have priority value 0, least recently used will have priority value [no of blocks in a set-1]
    let index = (wordAddress-268500992)/4
    let data = processor.memory[index]
    //******************************************************* */
    //search L1, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L1
    let l1_block_size = processor.L1BlockSize/4 //no of words in a block
    let l1_blocks = processor.L1Associativity   //no of blocks in a set
    let l1_sets = processor.L1Size/(processor.L1Associativity*processor.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    let l1_flag = 0
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(processor.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            //search successful, found in this set
            l1_flag=1
            let currentP1 = processor.L1Priority.get([l1set_index,i])
            if(processor.L1Priority.get([l1set_index,i]) != 0)
            {
                for(let j=0; j<l1_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(processor.L1Priority.get([l1set_index,j]) != -1 && processor.L1Priority.get([l1set_index,j])<currentP1)
                    {
                        let t = processor.L1Priority.get([l1set_index,j])
                        processor.L1Priority.set([l1set_index,j], t+1)
                    }
                }
                processor.L1Priority.set([l1set_index,i],0)
            }
            else
            {
                //no need to update priorities because it is already the most recently used
            }
            if(store)
            {
                for(let j=0; j<l1_block_size; j++)//parsing through the block and updating L1 data because it is a store
                {
                    let t = l1block_index*l1_block_size
                    processor.L1.set([l1set_index, i, j], processor.memory[t+j])
                    
                }
            }
            else
            {
                return
            }
            break
        }
    }
    if(!l1_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(processor.L1Priority.get([l1set_index,i]) != -1)
            {
                let t = processor.L1Priority.get([l1set_index,i])
                processor.L1Priority.set([l1set_index,i], t+1)
            }                
        }
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(processor.L1Priority.get([l1set_index,i]) == -1 || processor.L1Priority.get([l1set_index,i]) > l1_blocks-1)
            {
                processor.L1Priority.set([l1set_index,i], 0)
                processor.L1Tags.set([l1set_index,i], l1block_index)
                for(let j=0; j<l1_block_size; j++)//parsing through the block
                {
                    let t = l1block_index*l1_block_size
                    processor.L1.set([l1set_index, i, j], processor.memory[t+j])
                }
                break
            }            
        }
    }
    //search L2, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L2
    let l2_block_size = processor.L2BlockSize/4 //no of words in a block
    let l2_blocks = processor.L2Associativity   //no of blocks in a set
    let l2_sets = processor.L2Size/(processor.L2Associativity*processor.L2BlockSize) //total number of sets in the cache
    
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    let l2_flag = 0
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(processor.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            //search successful, found in this set
            l2_flag=1
            let currentP2 = processor.L2Priority.get([l2set_index,i])
            if(processor.L2Priority.get([l2set_index,i]) != 0 && (store || !l1_flag))//only update priority if it is not a L1 hit or if it is a store
            {
                for(let j=0; j<l2_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(processor.L2Priority.get([l2set_index,j]) != -1 && processor.L2Priority.get([l2set_index,j])<currentP2)
                    {
                        let t = processor.L2Priority.get([l2set_index,j])
                        processor.L2Priority.set([l2set_index,j], t+1)
                    }
                }
                processor.L2Priority.set([l2set_index,i],0)
            }
            else
            {
                //no need to update priorities because it is already the most recently used
            }
            if(store)
            {
                for(let j=0; j<l2_block_size; j++)//parsing through the block and updating data because it is a sw
                {
                    let t = l2block_index*l2_block_size
                    processor.L2.set([l2set_index, i, j], processor.memory[t+j])
                }
            }
            break
        }
    }
    if(!l2_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(processor.L2Priority.get([l2set_index,i]) != -1)
            {
                let t = processor.L2Priority.get([l2set_index,i])
                processor.L2Priority.set([l2set_index,i], t+1)
            }                
        }
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(processor.L2Priority.get([l2set_index,i]) == -1 || processor.L2Priority.get([l2set_index,i]) > l2_blocks-1)
            {
                processor.L2Priority.set([l2set_index,i], 0)
                processor.L2Tags.set([l2set_index,i], l2block_index)
                for(let j=0; j<l2_block_size; j++)//parsing through the block
                {
                    let t = l2block_index*l2_block_size
                    processor.L2.set([l2set_index, i, j], processor.memory[t+j])
                }
                break
            }         
        }
    }
    //************************************************************************************* */
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
    processor.updateCache(wordAddress, true) 

}
processor.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    processor.updateCache(wordAddress, false) 
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

