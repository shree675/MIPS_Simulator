import { matrix } from 'mathjs'
import local from './localEXE.js'
//Simulates the entire MIPS code and cache and for each valid instruction, generates a new row in the pipeline diagram without forwarding
const IF = "  IF "
const IDRF = "IDRF "
const EXE = " EXE "
const MEM = " MEM "
const WB = "  WB "
const stall = "STALL"
const empty = "     "
const instructions = ["add", "addu", "sub", "subu", "addi", "addiu", "srl", "sll", "bne", "beq", "ble", "j", "li", "lui", "lw", "sw", "syscall", "jr"]
const memInst = ["lw", "sw"]
const branchInst = ["bne", "beq", "ble", "j"]
const TwoSource = ["add", "addu", "sub", "subu"]
const OneSource = ["addi", "addiu", "srl", "sll", "li"]
const ExeWrite = ["add", "addu", "sub", "subu", "addi", "addiu", "srl", "sll", "li"]

var PWOF = 
{
    pc:0,
    prevPC: 0,
    prevprevPC: 0,
    pipe: null,
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
    L1Size: 16,
    L1BlockSize: 4,
    L1Associativity: 1,
    L2Size: 128,
    L2BlockSize: 8,
    L2Associativity: 8,
    L1Latency: 1,
    L2Latency: 2,
    MMLatency: 10,
    isIdealCase: false,
};
PWOF.updateCacheSettings = (l1_size, l1_block, l1_asso, l2_size, l2_block, l2_asso, l1_latency, l2_latency, mm_latency, idealcase) => {
    PWOF.L1Size = l1_size
    PWOF.L1BlockSize = l1_block
    PWOF.L1Associativity = l1_asso
    PWOF.L2Size = l2_size
    PWOF.L2BlockSize = l2_block
    PWOF.L2Associativity = l2_asso
    PWOF.L1Latency = l1_latency
    PWOF.L2Latency = l2_latency
    PWOF.MMLatency = mm_latency
    PWOF.isIdealCase = idealcase
}
PWOF.initializeCache = () => {
    //initializing data array for L1
    let l1_block_size = PWOF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWOF.L1Associativity   //no of blocks in a set
    let l1_sets = PWOF.L1Size/(PWOF.L1Associativity*PWOF.L1BlockSize) //total number of sets in the cache
    PWOF.L1 = matrix().resize([l1_sets,l1_blocks,l1_block_size])

    //initializing tags and priority for L1
    PWOF.L1Tags = matrix().resize([l1_sets,l1_blocks], -1)
    PWOF.L1Priority = matrix().resize([l1_sets,l1_blocks], -1)

    //initializing data array for L2
    let l2_block_size = PWOF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWOF.L2Associativity   //no of blocks in a set
    let l2_sets = PWOF.L2Size/(PWOF.L2Associativity*PWOF.L2BlockSize) //total number of sets in the cache
    PWOF.L2 = matrix().resize([l2_sets,l2_blocks,l2_block_size])

    //initializing tags and priority for L2
    PWOF.L2Tags = matrix().resize([l2_sets,l2_blocks], -1)
    PWOF.L2Priority = matrix().resize([l2_sets,l2_blocks], -1)
}
PWOF.updateCache = (wordAddress, store) =>
{
    //most recently used will have priority value 0, least recently used will have priority value [no of blocks in a set-1]
    let index = (wordAddress-268500992)/4
    let data = PWOF.memory[index]
    //search L1, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L1
    let l1_block_size = PWOF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWOF.L1Associativity   //no of blocks in a set
    let l1_sets = PWOF.L1Size/(PWOF.L1Associativity*PWOF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    let l1_flag = 0
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWOF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            l1_flag=1
            let currentP1 = PWOF.L1Priority.get([l1set_index,i])
            if(PWOF.L1Priority.get([l1set_index,i]) != 0)
            {
                for(let j=0; j<l1_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWOF.L1Priority.get([l1set_index,j]) != -1 && PWOF.L1Priority.get([l1set_index,j])<currentP1)
                    {
                        let t = PWOF.L1Priority.get([l1set_index,j])
                        PWOF.L1Priority.set([l1set_index,j], t+1)
                    }
                }
                PWOF.L1Priority.set([l1set_index,i],0)
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
                    PWOF.L1.set([l1set_index, i, j], PWOF.memory[t+j])
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
            if(PWOF.L1Priority.get([l1set_index,i]) != -1)
            {
                let t = PWOF.L1Priority.get([l1set_index,i])
                PWOF.L1Priority.set([l1set_index,i], t+1)
            }                
        }
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWOF.L1Priority.get([l1set_index,i]) == -1 || PWOF.L1Priority.get([l1set_index,i]) > l1_blocks-1)
            {
                PWOF.L1Priority.set([l1set_index,i], 0)
                PWOF.L1Tags.set([l1set_index,i], l1block_index)
                for(let j=0; j<l1_block_size; j++)//parsing through the block
                {
                    let t = l1block_index*l1_block_size
                    PWOF.L1.set([l1set_index, i, j], PWOF.memory[t+j])
                }
                break
            }      
        }
    }
    //search L2, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L2
    let l2_block_size = PWOF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWOF.L2Associativity   //no of blocks in a set
    let l2_sets = PWOF.L2Size/(PWOF.L2Associativity*PWOF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    let l2_flag = 0
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWOF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            //search successful, found in this set
            l2_flag=1
            let currentP2 = PWOF.L2Priority.get([l2set_index,i])
            if(PWOF.L2Priority.get([l2set_index,i]) != 0 && (store || !l1_flag))
            {
                for(let j=0; j<l2_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWOF.L2Priority.get([l2set_index,j]) != -1 && PWOF.L2Priority.get([l2set_index,j])<currentP2)
                    {
                        let t = PWOF.L2Priority.get([l2set_index,j])
                        PWOF.L2Priority.set([l2set_index,j], t+1)
                    }
                }
                PWOF.L2Priority.set([l2set_index,i],0)
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
                    PWOF.L2.set([l2set_index, i, j], PWOF.memory[t+j])
                }
            }
            break
        }
    }
    if(!l2_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(PWOF.L2Priority.get([l2set_index,i]) != -1)
            {
                let t = PWOF.L2Priority.get([l2set_index,i])
                PWOF.L2Priority.set([l2set_index,i], t+1)
            }                
        }
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWOF.L2Priority.get([l2set_index,i]) == -1 || PWOF.L2Priority.get([l2set_index,i]) > l2_blocks-1)
            {
                PWOF.L2Priority.set([l2set_index,i], 0)
                PWOF.L2Tags.set([l2set_index,i], l2block_index)
                for(let j=0; j<l2_block_size; j++)//parsing through the block
                {
                    let t = l2block_index*l2_block_size
                    PWOF.L2.set([l2set_index, i, j], PWOF.memory[t+j])
                }
                break
            }       
        }
    }
} 
PWOF.stallTime = (wordAddress) =>
{
    //this function takes an address, check L1, L2 and returns number of stall cycles accordingly
     //if hit in L1, return L1Latency
    //else if hit in L2, return L2Latency +L1Latency
    //else return MMLatency + L1Latency +L2Latency
    let index = (wordAddress-268500992)/4
    let l1_block_size = PWOF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWOF.L1Associativity   //no of blocks in a set
    let l1_sets = PWOF.L1Size/(PWOF.L1Associativity*PWOF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWOF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            return PWOF.L1Latency 
        }
    }
    let l2_block_size = PWOF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWOF.L2Associativity   //no of blocks in a set
    let l2_sets = PWOF.L2Size/(PWOF.L2Associativity*PWOF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWOF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            return PWOF.L2Latency +PWOF.L1Latency
        }
    }
    return PWOF.MMLatency + PWOF.L2Latency +PWOF.L1Latency
}
PWOF.setInitialMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWOF.memory[index]=value
}
PWOF.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWOF.memory[index]=value
    PWOF.updateCache(wordAddress, true) 

}
PWOF.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    PWOF.updateCache(wordAddress, false) 
    return PWOF.memory[index]
} 
PWOF.setRegister = (reg, num) => {
    if(reg==='r0' || reg==='zero')
        PWOF.registers.set('r0', 0)
    else
        PWOF.registers.set(reg, num)
}
PWOF.getRegister = (reg) => {
    if(reg === "zero" || reg==='r0'){
        return 0;
    }
    return PWOF.registers.get(reg)
}
PWOF.reset = () => {    
    PWOF.memory = new Array(1024).fill(0) 
    PWOF.pc = 0
    PWOF.prevPC = 0
    PWOF.prevprevPC = 0
    PWOF.pipe =  null
    PWOF.registers = new Map(
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
    PWOF.initializeCache()
}
PWOF.isInst = (line)=> //checks if this particular line is a valid instruction
{
    if(line=="" || line[0]=="#")
        return false
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of instructions)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWOF.returnMem = (line)=> //returns the address of the word to be accessed if it is a memory instruction like sw or lw
{
    if(line.indexOf("#")>=0)
    line.length = line.indexOf("#")
    for(var i of memInst)
    {
        if(line.includes(i))
        {
            let src = line[2].split("(")
            let offset = parseInt(src[0])
            let src1 = src[1].replace("$", "").replace(")", "")
            let src2 = offset + PWOF.getRegister(src1)
            return src2
        } 
    }
    return -1//returns flag -1 if not a memory instruction
}
PWOF.isBranchInst = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of branchInst)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWOF.isTwoSource = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of TwoSource)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWOF.isOneSource = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of OneSource)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWOF.isExeWrite = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of ExeWrite)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWOF.appendColumn = () =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    PWOF.pipe.resize([row, col+1], empty)
}
PWOF.formatInst = (line)=>
{
    let output = ""
    for(let i of line)
    {
        if(line[0].includes(":"))
        {

        }
        else if(i.includes("#"))
        {
            return output
        }
        else
        {
            output = output+" "+i
        }
    }
    return output
}
PWOF.isDependent = (line1, line2) => //checks if line2 is dependent on line1
{
    if(line1.indexOf("#")>=0)
        line1.length = line1.indexOf("#")
    if(line2.indexOf("#")>=0)
        line2.length = line2.indexOf("#")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction

    if(PWOF.isBranchInst(line2))
    {
        return false
    }
    if(PWOF.isBranchInst(line1)|| line1.includes("sw")|| line1.includes("syscall"))
    {
        return false
    }
    let dest = line1[1]
    if(PWOF.isTwoSource(line2))
    {
        let dep1 = line2[2]
        let dep2 = line2[3]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false
    }
    if(PWOF.isOneSource(line2))
    {
        let dep1 = line2[2]
        if(dest===dep1)
        {
            return true
        }
        return false
    }
    if(line2.includes("lw")|| line2.includes("lui"))
    {
        let dep1 = line2[2].split(/[\(\)]+/)[1]
        if(dest===dep1)
        {
            return true
        }
        return false
    }
    if(line2.includes("sw"))
    {
        let dep1 = line2[1]
        let dep2 = line2[2].split(/[\(\)]+/)[1]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false
    }
    if(line2.includes("syscall"))
    {
        if(dest=="$a0"||dest=="$v0")
        {
            return true
        }
        return false
    }
}
PWOF.isBranchDependent = (line1, line2) =>
{
    //console.log("****")
    if(line1.indexOf("#")>=0)
        line1.length = line1.indexOf("#")
    if(line2.indexOf("#")>=0)
        line2.length = line2.indexOf("#")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction

    if(PWOF.isBranchInst(line1)|| line1.includes("sw")|| line1.includes("syscall"))
    {
        return false
    }
    let dest = line1[1]
    let dep1 = line2[1]
    let dep2 = line2[2]
    if(dest===dep1 || dest===dep2)
    {
        return true
    }
    return false
   
}
PWOF.isBranchMemDependent = (lines, pc) => //Here we check all cases that result in two stall i.e. when the previous instruction is an "lw"
{
    let line1 = lines[PWOF.prevPC]
    let line2 = lines[pc]
    if(line1.indexOf("#")>=0)
        line1.length = line1.indexOf("#")
    if(line2.indexOf("#")>=0)
        line2.length = line2.indexOf("#")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction

    let dep1 = line2[1]
    let dep2 = line2[2]
    //when line two is of Exe-write type
    if(line1.includes("lw"))
    {
        let dest = line1[1]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false  
    }
    return false
} 
PWOF.InstructionFetch = (lines,pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    row=row-1//row refers to index now
    let i = row+1
    if(!PWOF.isBranchInst(lines[PWOF.prevPC]))
    {
        while(PWOF.pipe.get([row-1,i])!=IDRF)
        {
            i++
        }
        PWOF.pipe.set([row,i], IF)
    }
    else
    {
        while(PWOF.pipe.get([row-1,i])!=EXE)
        {
            i++
        }
        PWOF.pipe.set([row,i], IF)   
    }
}
PWOF.RegisterFetch = (lines, pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    row=row-1//row refers to index now
        let i = row+1
        while(PWOF.pipe.get([row,i])!=IF)
        {
            i++
        }
        i++
        let j = row+1
        if(PWOF.isBranchInst(lines[pc]) && PWOF.prevPC!=pc && PWOF.isBranchDependent(lines[PWOF.prevPC], lines[pc]))//dependent on previous
        {        
            while(PWOF.pipe.get([row-1,j])!=WB)
            {
                j++
            }
            while(i<j)
            {
                PWOF.pipe.set([row,i], stall)
                i++
            }
            PWOF.appendColumn()
            PWOF.pipe.set([row,i], IDRF)  
            return
        }
        if(PWOF.isBranchInst(lines[pc]) && PWOF.prevprevPC!=PWOF.prevPC && PWOF.isBranchDependent(lines[PWOF.prevprevPC], lines[pc]))
        {
            //dependent on previous previous
            while(PWOF.pipe.get([row-2,j])!=WB)
            {
                j++
            }
            while(PWOF.pipe.get([row-1,j])==stall)
            {
                j++
            }
            while(i<j)
            {
                PWOF.pipe.set([row,i], stall)
                i++
            }
            if(i>=col)
            {
                PWOF.appendColumn()
            }
            PWOF.pipe.set([row,i], IDRF)  
            return
        }
        //not a branch instruction or non dependent branch instruction
        while(PWOF.pipe.get([row-1,j])!=EXE)
        {
            j++
        }
        if(i>j)
        {
            while(PWOF.pipe.get([row-1,j])!=MEM)
            {
                j++
            }
        }
        if(i>j)
        {
            while(PWOF.pipe.get([row-1,j])!=WB)
            {
                j++
            }
        }
        while(i<j)
        {
            PWOF.pipe.set([row,i], stall)
            i++
        }
        if(i>=col)
        {
            PWOF.appendColumn()
        }
        PWOF.pipe.set([row,i], IDRF)  
        return
}
PWOF.Execute = (lines,pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    row=row-1//row refers to index now
    let i = row+1
    while(PWOF.pipe.get([row,i])!=IDRF)
    {
        i++
    }
    i++
    let j = row+1
    if(PWOF.prevPC!=pc && PWOF.isDependent(lines[PWOF.prevPC], lines[pc]))//dependent on previous
    {       
        while(PWOF.pipe.get([row-1,j])!=WB)
        {
            j++
        }
        j++
        while(i<j)
        {
            PWOF.pipe.set([row,i], stall)
            i++
        }
        PWOF.appendColumn()
        PWOF.pipe.set([row,i], EXE)  
        return

    }
    if(PWOF.prevprevPC!=PWOF.prevPC && PWOF.isDependent(lines[PWOF.prevprevPC], lines[pc]))//if prev prev exists and this inst is dependent on prev prev
    {
        while(PWOF.pipe.get([row-2,j])!=WB)
        {
            j++
        }
        j++
        while(PWOF.pipe.get([row-1,j])==stall)
        {
            j++
        }
        while(i<j)
        {
            PWOF.pipe.set([row,i], stall)
            i++
        }
        if(i>=col)
        {
            PWOF.appendColumn()
        }
        PWOF.pipe.set([row,i], EXE)  
        return
    }
    //not dependent on either
    while(PWOF.pipe.get([row-1,j])!=MEM)
    {
        j++
    }
    if(i>j)
    {
        while(PWOF.pipe.get([row-1,j])!=MEM)
        {
            j++
        }
    }
    while(i<j)
    {
        PWOF.pipe.set([row,i], stall)
        i++
    }
    if(i>=col)
    {
        PWOF.appendColumn()
    }
    PWOF.pipe.set([row,i], EXE)  
    return
}
PWOF.Memory = (lines, pc) =>
{
    let row = PWOF.pipe.size()[0]
    let numOfCycles = 1;
    let address = PWOF.returnMem(lines[pc])
    if(!PWOF.isIdealCase && address!=-1)
    {
        numOfCycles = PWOF.stallTime(address)
    }
    row=row-1//row refers to index now
    let i = row+1
    while(PWOF.pipe.get([row,i])!=EXE)
    {
        i++
    }
    i++
    let j = row+1
    while(PWOF.pipe.get([row-1,j])!=WB)
    {
        j++
    }
    while(i<j)
    {
        PWOF.pipe.set([row,i], stall)
        i++
    }
    if(i>j)
    {
        PWOF.appendColumn()
    }
    for(let k=0; k<numOfCycles; k++)
    {
        let col = PWOF.pipe.size()[1]
        if(i>=col)
        {
            PWOF.appendColumn()
        }
        PWOF.pipe.set([row,i++], MEM)
    }

}
PWOF.WriteBack = (line,pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    row=row-1//row refers to index now
    //find MEM of the current line, if there are any remaining column, fill them with stalls, then append a column and enter WB
    let i = row+1
    while(PWOF.pipe.get([row,i])!=MEM)
    {
        i++
    }
    while(i<col && PWOF.pipe.get([row,i])==MEM)
    {
        i++
    }   
    PWOF.appendColumn()
    PWOF.pipe.set([row,i], WB)
}
PWOF.updateMatrix = (lines, pc)=>
{
    //updating matrix with a line
    let line = lines[pc]
    if(PWOF.pipe==null) //first line
    {
        PWOF.pipe = matrix([[empty, empty, empty, empty, empty, empty]])
        PWOF.pipe.set([0,0], PWOF.formatInst(line))
        PWOF.pipe.set([0,1], IF)
        PWOF.pipe.set([0,2], IDRF)
        PWOF.pipe.set([0,3], EXE)
        PWOF.pipe.set([0,4], MEM)
        PWOF.pipe.set([0,5], WB)
    }
    else
    {
        let row = PWOF.pipe.size()[0]
        let col = PWOF.pipe.size()[1]
        PWOF.pipe.resize([row+1, col], empty)
        PWOF.pipe.set([row,0], PWOF.formatInst(line))
        PWOF.InstructionFetch(lines,pc)
        PWOF.RegisterFetch(lines, pc)
        PWOF.Execute(lines,pc)
        PWOF.Memory(lines,pc)
        PWOF.WriteBack(line,pc) 
    }
}
PWOF.run = (lines, tags)=>
{
    PWOF.reset()
    if(lines==null)
    {
        return PWOF.pipe
    } 
    let index = 268500992
    for(let i=0; i<lines.length; i++)
    {
        let line = lines[i]
        if(line.includes(":"))
        {
            line.splice(0,1)
        }
        if(line!="" && line.includes(".word"))//only for storing integers
        {
            //tags.set(lines[i][0], i)
            for(let j=1; j<line.length; j++, index=index+4)
            {
                let value = parseInt(lines[i][j])
                PWOF.setInitialMemory(index, value)
            }
        }
    }
    while(!PWOF.isInst(lines[PWOF.pc]))
    {
        PWOF.pc++
        PWOF.prevPC++
        PWOF.prevprevPC++
        if(PWOF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
        {
            return PWOF.pipe
        }
    }
    do{
        if(lines==null)
        {
            break;
        } 
        while(!PWOF.isInst(lines[PWOF.pc]))
        {
            PWOF.pc++
            if(PWOF.pc===lines.length)//if pc has reached the end of the lines pf code, return
            {
                return PWOF.pipe
            }
        }
        PWOF.updateMatrix(lines,PWOF.pc)
        PWOF.prevprevPC = PWOF.prevPC
        PWOF.prevPC = PWOF.pc
        PWOF.pc = local.exe(lines, tags, PWOF.pc, PWOF)
    }while(PWOF.pc!=0)
    return PWOF.pipe
}
export default PWOF