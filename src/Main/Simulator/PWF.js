import { matrix } from 'mathjs'
import local from './localEXE.js'
//Simulates the entire MIPS code and cache and for each valid instruction, generates a new row in the pipeline diagram with forwarding
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

var PWF = 
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
PWF.updateCacheSettings = (l1_size, l1_block, l1_asso, l2_size, l2_block, l2_asso, l1_latency, l2_latency, mm_latency, idealcase) => {
    PWF.L1Size = l1_size
    PWF.L1BlockSize = l1_block
    PWF.L1Associativity = l1_asso
    PWF.L2Size = l2_size
    PWF.L2BlockSize = l2_block
    PWF.L2Associativity = l2_asso
    PWF.L1Latency = l1_latency
    PWF.L2Latency = l2_latency
    PWF.MMLatency = mm_latency
    PWF.isIdealCase = idealcase
}
PWF.initializeCache = () => {
    //initializing data array for L1
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    PWF.L1 = matrix().resize([l1_sets,l1_blocks,l1_block_size])

    //initializing tags and priority for L1
    PWF.L1Tags = matrix().resize([l1_sets,l1_blocks], -1)
    PWF.L1Priority = matrix().resize([l1_sets,l1_blocks], -1)

    //initializing data array for L2
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    PWF.L2 = matrix().resize([l2_sets,l2_blocks,l2_block_size])

    //initializing tags and priority for L2
    PWF.L2Tags = matrix().resize([l2_sets,l2_blocks], -1)
    PWF.L2Priority = matrix().resize([l2_sets,l2_blocks], -1)
}
PWF.updateCache = (wordAddress, store) =>
{
    //most recently used will have priority value 0, least recently used will have priority value [no of blocks in a set-1]
    let index = (wordAddress-268500992)/4
    let data = PWF.memory[index]
    //search L1, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L1
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    let l1_flag = 0
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            //search successful, found in this set
            l1_flag=1
            let currentP1 = PWF.L1Priority.get([l1set_index,i])
            if(PWF.L1Priority.get([l1set_index,i]) != 0)
            {
                for(let j=0; j<l1_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWF.L1Priority.get([l1set_index,j]) != -1 && PWF.L1Priority.get([l1set_index,j])<currentP1)
                    {
                        let t = PWF.L1Priority.get([l1set_index,j])
                        PWF.L1Priority.set([l1set_index,j], t+1)
                    }
                }
                PWF.L1Priority.set([l1set_index,i],0)
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
                    PWF.L1.set([l1set_index, i, j], PWF.memory[t+j])
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
            if(PWF.L1Priority.get([l1set_index,i]) != -1)
            {
                let t = PWF.L1Priority.get([l1set_index,i])
                PWF.L1Priority.set([l1set_index,i], t+1)
            }                
        }
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWF.L1Priority.get([l1set_index,i]) == -1 || PWF.L1Priority.get([l1set_index,i]) > l1_blocks-1)
            {
                PWF.L1Priority.set([l1set_index,i], 0)
                PWF.L1Tags.set([l1set_index,i], l1block_index)
                for(let j=0; j<l1_block_size; j++)//parsing through the block
                {
                    let t = l1block_index*l1_block_size
                    PWF.L1.set([l1set_index, i, j], PWF.memory[t+j])
                }
                break
            }         
        }
    }
    //************************************************************************************* */
    //search L2, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L2
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    let l2_flag = 0
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            l2_flag=1
            let currentP2 = PWF.L2Priority.get([l2set_index,i])
            if(PWF.L2Priority.get([l2set_index,i]) != 0 && (store || !l1_flag))
            {
                for(let j=0; j<l2_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWF.L2Priority.get([l2set_index,j]) != -1 && PWF.L2Priority.get([l2set_index,j])<currentP2)
                    {
                        let t = PWF.L2Priority.get([l2set_index,j])
                        PWF.L2Priority.set([l2set_index,j], t+1)
                    }
                }
                PWF.L2Priority.set([l2set_index,i],0)
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
                    PWF.L2.set([l2set_index, i, j], PWF.memory[t+j])
                }
            }
            break
        }
    }
    if(!l2_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(PWF.L2Priority.get([l2set_index,i]) != -1)
            {
                let t = PWF.L2Priority.get([l2set_index,i])
                PWF.L2Priority.set([l2set_index,i], t+1)
            }                
        }
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWF.L2Priority.get([l2set_index,i]) == -1 || PWF.L2Priority.get([l2set_index,i]) > l2_blocks-1)
            {
                PWF.L2Priority.set([l2set_index,i], 0)
                PWF.L2Tags.set([l2set_index,i], l2block_index)
                for(let j=0; j<l2_block_size; j++)//parsing through the block
                {
                    let t = l2block_index*l2_block_size
                    PWF.L2.set([l2set_index, i, j], PWF.memory[t+j])
                }
                break
            }    
        }
    }
} 
PWF.stallTime = (wordAddress) =>
{
    //this function takes an address, check L1, L2 and returns number of stall cycles accordingly
    //if hit in L1, return L1Latency
    //else if hit in L2, return L2Latency +L1Latency
    //else return MMLatency + L1Latency +L2Latency
    let index = (wordAddress-268500992)/4
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            return PWF.L1Latency
        }
    }
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            return PWF.L2Latency + PWF.L1Latency
        }
    }
    return PWF.MMLatency + PWF.L2Latency + PWF.L1Latency
}
PWF.setInitialMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0 //this method is called while initialising the main memory during preprocessing stage
    let index = (wordAddress-268500992)/4
    PWF.memory[index]=value
}
PWF.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWF.memory[index]=value
    PWF.updateCache(wordAddress, true) 

}
PWF.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    PWF.updateCache(wordAddress, false) 
    return PWF.memory[index]
} 
PWF.setRegister = (reg, num) => {
    if(reg==='r0' || reg==='zero')
        PWF.registers.set('r0', 0)
    else
        PWF.registers.set(reg, num)
}
PWF.getRegister = (reg) => {
    if(reg === "zero" || reg==='r0'){
        return 0;
    }
    return PWF.registers.get(reg)
}
PWF.reset = () => {    
    PWF.memory = new Array(1024).fill(0) 
    PWF.pc = 0
    PWF.prevPC = 0
    PWF.prevprevPC = 0
    PWF.pipe =  null
    PWF.registers = new Map(
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
    PWF.initializeCache()
}
PWF.isInst = (line)=>
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
PWF.returnMem = (line)=> //returns the address of the word to be accessed if it is a memory instruction like sw or lw
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
            let src2 = offset + PWF.getRegister(src1)
            return src2
        } 
    }
    return -1//returns flag -1 if not a memory instruction
}
PWF.isBranchInst = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of branchInst)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isTwoSource = (line)=>
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
PWF.isOneSource = (line)=>
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
PWF.isExeWrite = (line)=>
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
PWF.appendColumn = () =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    PWF.pipe.resize([row, col+1], empty)
}
PWF.formatInst = (line)=>
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
PWF.isBranchDependent = (lines, pc) => //Here we check all cases that result in one stall, we check both previous and prev prev pc
{
    let line1 = lines[PWF.prevprevPC]
    let line2 = lines[PWF.prevPC]
    let line3 = lines[pc]
    if(line1.indexOf("#")>=0)
        line1.length = line1.indexOf("#")
    if(line2.indexOf("#")>=0)
        line2.length = line2.indexOf("#")
    if(line3.indexOf("#")>=0)
        line3.length = line3.indexOf("#")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line3.includes(":"))
        line3.splice(0,1)//removes the tag from the beginning hence extracting the instruction

    let dep1 = line3[1]
    let dep2 = line3[2]
    //when line two is of Exe-write type
    if(PWF.isExeWrite(line2))
    {
        let dest = line2[1]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false           
    }
    else if(line1.includes("lw"))
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
PWF.isBranchMemDependent = (lines, pc) => //Here we check all cases that result in two stall i.e. when the previous instruction is an "lw"
{
    let line1 = lines[PWF.prevPC]
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
PWF.isMemDependent = (lines, pc) =>//Here we check if the previous instruction is a lw which makes the exe stage of the current line wait till MEM is completed
{
    let line1 = lines[PWF.prevPC]
    let line2 = lines[pc]
    if(line1.indexOf("#")>=0)
        line1.length = line1.indexOf("#")
    if(line2.indexOf("#")>=0)
        line2.length = line2.indexOf("#")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(!line1.includes("lw"))
    {
        return false
    }
    if(PWF.isBranchInst(line2))
    {
        return false
    }
    let dest = line1[1]
    if(PWF.isOneSource(line2))
    {
        let dep1 = line2[2]
        if(dest===dep1)
        {
            return true
        }
        return false   
    }
    if(PWF.isTwoSource(line2))
    {
        let dep1 = line2[2]
        let dep2 = line2[3]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false 
    }
    if(line2.includes("lw")||line2.includes("lui"))
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
}
PWF.InstructionFetch = (lines,pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    row=row-1//row refers to index now
    let i = row+1
    if(!PWF.isBranchInst(lines[PWF.prevPC]))
    {
        while(PWF.pipe.get([row-1,i])!=IDRF)
        {
            i++
        }
        PWF.pipe.set([row,i], IF)
    }
    else
    {
        while(PWF.pipe.get([row-1,i])!=EXE)
        {
            i++
        }
        PWF.pipe.set([row,i], IF)   
    }

}
PWF.RegisterFetch = (lines, pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    row=row-1//row refers to index now
        let i = row+1
        while(PWF.pipe.get([row,i])!=IF)
        {
            i++
        }
        i++
        let j = row+1
        if(PWF.isBranchInst(lines[pc]))
        {
            if(PWF.isBranchMemDependent(lines, pc))//2 stalls case
            {
                while(PWF.pipe.get([row-1,j])!=WB)
                {
                    j++
                }
            }
            else if(PWF.isBranchDependent(lines, pc))//1 stall case
            {
                while(PWF.pipe.get([row-1,j])!=MEM)
                {
                    j++
                }
                if(j<i)
                {
                    while(PWF.pipe.get([row-1,j])!=WB)
                    {
                        j++
                    }
                }  
            }
            else//no stall case
            {
                while(PWF.pipe.get([row-1,j])!=EXE)
                {
                    j++
                } 
                if(j<i)
                {
                    while(PWF.pipe.get([row-1,j])!=MEM)
                    {
                        j++
                    }
                }
                if(j<i)
                {
                    while(PWF.pipe.get([row-1,j])!=WB)
                    {
                        j++
                    }
                }                  
            }
        }
        else//same as no stall case
        {
            while(PWF.pipe.get([row-1,j])!=EXE)
            {
                j++
            } 
            if(j<i)
            {
                while(PWF.pipe.get([row-1,j])!=MEM)
                {
                    j++
                }
            }
            if(j<i)
            {
                while(PWF.pipe.get([row-1,j])!=WB)
                {
                    j++
                }
            }  
        }
        while(i<j)
        {
            if(PWF.pipe.get([row,i])==empty)
                PWF.pipe.set([row,i], stall)
            i++
        }
        PWF.pipe.set([row,i], IDRF)
}
PWF.Execute = (lines,pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    row=row-1//row refers to index now
    let i = row+1
    while(PWF.pipe.get([row,i])!=IDRF)
    {
        i++
    }
    i++
    if(PWF.isMemDependent(lines, pc))
    {
        let j = row+1
        while(PWF.pipe.get([row-1,j])!=WB)
        {
            j++
        }
        while(i<j)
        {
            PWF.pipe.set([row,i], stall)
            i++
        }
        if(i>j)
        {
            PWF.appendColumn()
        }
        PWF.pipe.set([row,i], EXE)
    }
    else
    {
        let j = row+1
        while(PWF.pipe.get([row-1,j])!=MEM)
        {
            j++
        }
        if(i>j)
        {
            while(PWF.pipe.get([row-1,j])!=WB)
            {
                j++
            }   
        }
        while(i<j)
        {
            PWF.pipe.set([row,i], stall)
            i++
        }
        if(i>j)
        {
            PWF.appendColumn()
        }
        PWF.pipe.set([row,i], EXE)
    }
}
PWF.Memory = (lines, pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    let numOfCycles = 1;
    let address = PWF.returnMem(lines[pc])
    if(!PWF.isIdealCase && address!=-1)
    {
        numOfCycles = PWF.stallTime(address)
    }
    row=row-1//row refers to index now
    let i = row+1
    while(PWF.pipe.get([row,i])!=EXE)
    {
        i++
    }
    i++
    let j = row+1
    while(PWF.pipe.get([row-1,j])!=WB)
    {
        j++
    }
    while(i<j)
    {
        PWF.pipe.set([row,i], stall)
        i++
    }
    if(i>j)
    {
        PWF.appendColumn()
    }
    for(let k=0; k<numOfCycles; k++)
    {
        let col = PWF.pipe.size()[1]
        if(i>=col)
        {
            PWF.appendColumn()
        }
        PWF.pipe.set([row,i++], MEM)
    }
    
}
PWF.WriteBack = (line,pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    row=row-1//row refers to index now
    //find MEM of the current line, if there are any remaining column, fill them with stalls, then append a column and enter WB
    let i = row+1
    while(PWF.pipe.get([row,i])!=MEM)
    {
        i++
    }
    while(i<col && PWF.pipe.get([row,i])==MEM)
    {
        i++
    }   
    PWF.appendColumn()
    PWF.pipe.set([row,i], WB)
}
PWF.updateMatrix = (lines, pc)=>
{
    //updating matrix with a line
    let line = lines[pc]
    if(PWF.pipe==null)
    {
        //for the first line
        PWF.pipe = matrix([[empty, empty, empty, empty, empty, empty]])
        PWF.pipe.set([0,0], PWF.formatInst(line))
        PWF.pipe.set([0,1], IF)
        PWF.pipe.set([0,2], IDRF)
        PWF.pipe.set([0,3], EXE)
        PWF.pipe.set([0,4], MEM)
        PWF.pipe.set([0,5], WB)
    }
    else
    {
        let row = PWF.pipe.size()[0]
        let col = PWF.pipe.size()[1]
        PWF.pipe.resize([row+1, col], empty)
        PWF.pipe.set([row,0], PWF.formatInst(line))
        PWF.InstructionFetch(lines,pc)
        PWF.RegisterFetch(lines, pc)
        PWF.Execute(lines,pc)
        PWF.Memory(lines,pc)
        PWF.WriteBack(line,pc) 
    }
}
PWF.run = (lines, tags)=>
{
    PWF.reset()
    if(lines==null)
    {
        return PWF.pipe
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
            for(let j=1; j<line.length; j++, index=index+4)
            {
                let value = parseInt(lines[i][j])
                PWF.setInitialMemory(index, value)
            }
        }
    }
    while(!PWF.isInst(lines[PWF.pc]))
    {
        PWF.pc++
        PWF.prevPC++
        PWF.prevprevPC++
        if(PWF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
        {
            return PWF.pipe
        }
    }
    do{
        if(lines==null)
        {
            break;
        } 
        while(!PWF.isInst(lines[PWF.pc]))
        {
            PWF.pc++
            if(PWF.pc===lines.length)//if pc has reached the end of the lines pf code return
            {
                return PWF.pipe
            }
        }
        PWF.updateMatrix(lines,PWF.pc)
        PWF.prevprevPC = PWF.prevPC
        PWF.prevPC = PWF.pc
        PWF.pc = local.exe(lines, tags, PWF.pc, PWF)
    }while(PWF.pc!=0)
    return PWF.pipe
}
export default PWF

