import { matrix } from 'mathjs'
import local from './localEXE.js'
import PWF from './PWF.js'

const IF = "  IF "
const IDRF = "IDRF "
const EXE = " EXE "
const MEM = " MEM "
const WB = "  WB "
const stall = "STALL"
const empty = "     "
const instructions = ["add", "addu", "sub", "subu", "addi", "addiu", "srl", "sll", "bne", "beq", "ble", "j", "li", "lui", "lw", "sw", "syscall"]
const memInst = ["lw", "lui"]
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
};
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

PWOF.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWOF.memory[index]=value
}
PWOF.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    return PWOF.memory[index]
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
}

PWOF.isInst = (line)=>
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
PWOF.isMemInst = (line)=>
{
    if(line.indexOf("#")>=0)
        line.length = line.indexOf("#")
    for(var i of memInst)
    {
        if(line.includes(i))
            return true
    }
    return false
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
    //console.log(PWOF.pipe)
}
PWOF.formatInst = (line)=>
{
    let output = ""
    //console.log(line)
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
    //console.log(output)
    return output
}
PWOF.isDependent = (line1, line2) =>
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
PWOF.isBranchDependent2 = (line1, line2) =>
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
PWOF.isBranchDependent = (lines, pc) => //Here we check all cases that result in one stall, we check both previous and prev prev pc
{
    let line1 = lines[PWOF.prevprevPC]
    let line2 = lines[PWOF.prevPC]
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
    if(PWOF.isExeWrite(line2))
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
    //console.log(row, col)
    row=row-1//row refers to index now
    let i = row+1
    //console.log(lines[PWOF.prevPC])
    //console.log(lines[pc])
    //console.log("*")
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


    /* let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    let i = row+1
    while(PWOF.pipe.get([row-1,i])!=IDRF)
        {
            i++
        }
        
    if(!PWOF.isBranchInst(lines[PWOF.prevPC]))
    {
        while(true)
        {
            if(PWOF.pipe.get([row-1,i])==IDRF)
            {
                PWOF.pipe.set([row,i], IF)
                break
            }
            else 
            {
                i++
            }
        }
    }
    else if(PWOF.isBranchInst(lines[PWOF.prevPC]) && PWOF.isDependent(lines[PWOF.prevprevPC], lines[PWOF.prevPC]))
    {
        let i = row+1
            while(true)
            {
                if(PWOF.pipe.get([row-1,i])==MEM)
                {
                    PWOF.pipe.set([row,i], IF)
                    break
                }
                else 
                {
                    i++
                }
            }
    }
    else
    {
        let i = row+1
            while(true)
            {
                if(PWOF.pipe.get([row-1,i])==EXE)
                {
                    PWOF.pipe.set([row,i], IF)
                    break 
                }
                else 
                {
                    i++
                }
            }

    } */
}
PWOF.RegisterFetch2 = (lines, pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("register fetch")
        let i = row+1
        while(PWOF.pipe.get([row,i])!=IF)
        {
            i++
        }
        i++
        let j = row+1
        if(PWOF.isBranchInst(lines[pc]) && PWOF.prevPC!=pc && PWOF.isBranchDependent2(lines[PWOF.prevPC], lines[pc]))//dependent on previous
        {   
            //console.log("dependent on previous")     
            while(PWOF.pipe.get([row-1,j])!=WB)
            {
                j++
            }
            //j++
            while(i<j)
            {
                PWOF.pipe.set([row,i], stall)
                i++
            }
            PWOF.appendColumn()
            PWOF.pipe.set([row,i], IDRF)  
            return
    
        }
        if(PWOF.isBranchInst(lines[pc]) && PWOF.prevprevPC!=PWOF.prevPC && PWOF.isBranchDependent2(lines[PWOF.prevprevPC], lines[pc]))
        {
            //console.log("dependent on previous previous")
            while(PWOF.pipe.get([row-2,j])!=WB)
            {
                j++
            }
            //j++
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

PWOF.RegisterFetch = (lines, pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("register fetch")
        let i = row+1
        while(PWOF.pipe.get([row,i])!=IF)
        {
            i++
        }
        i++
        let j = row+1
        if(PWOF.isBranchInst(lines[pc]))
        {
            if(PWOF.isBranchMemDependent(lines, pc))//2 stalls case
            {
                while(PWOF.pipe.get([row-1,j])!=WB)
                {
                    j++
                }
            }
            else if(PWOF.isBranchDependent(lines, pc))//1 stall case
            {
                while(PWOF.pipe.get([row-1,j])!=MEM)
                {
                    j++
                }
                if(j<i)
                {
                    while(PWOF.pipe.get([row-1,j])!=WB)
                    {
                        j++
                    }
                }  
            }
            else//no stall case
            {
                while(PWOF.pipe.get([row-1,j])!=EXE)
                {
                    j++
                } 
                if(j<i)
                {
                    while(PWOF.pipe.get([row-1,j])!=MEM)
                    {
                        j++
                    }
                }
                if(j<i)
                {
                    while(PWOF.pipe.get([row-1,j])!=WB)
                    {
                        j++
                    }
                }                  
            }
        }
        else//same as no stall case
        {
            while(PWOF.pipe.get([row-1,j])!=EXE)
            {
                j++
            } 
            if(j<i)
            {
                while(PWOF.pipe.get([row-1,j])!=MEM)
                {
                    j++
                }
            }
            if(j<i)
            {
                while(PWOF.pipe.get([row-1,j])!=WB)
                {
                    j++
                }
            }  
        }
        while(i<j)
        {
            if(PWOF.pipe.get([row,i])==empty)
                PWOF.pipe.set([row,i], stall)
            i++
        }
        PWOF.pipe.set([row,i], IDRF)

    /* let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("register fetch")
        let i = row+1
        while(PWOF.pipe.get([row,i])!=IF)
        {
            i++
        }
        i++
        let j = row+1
        while(PWOF.pipe.get([row-1,j])!=EXE)
        {
            j++
        }
        if(j<i)
        {
            while(PWOF.pipe.get([row-1,j])!=MEM)
            {
                j++
            }
        }
        if(j<i)
        {
            while(PWOF.pipe.get([row-1,j])!=WB)
            {
                j++
            }
        }
        while(i<j)
        {
            if(PWOF.pipe.get([row,i])==empty)
                PWOF.pipe.set([row,i], stall)
            i++
        }
        PWOF.pipe.set([row,i], IDRF) */
        /* while(true)
            {
                if(PWOF.pipe.get([row-1,i])==EXE)
                {
                    if(PWOF.pipe.get([row,i])==empty)
                    {
                        PWOF.pipe.set([row,i], IDRF)
                        break
                    }
                    else if(PWOF.pipe.get([row,i+1])==empty)
                    {
                        PWOF.pipe.set([row,i+1], IDRF)
                        break
                    }
                    else
                    {
                        PWOF.pipe.set([row,i+2], IDRF)
                        break
                    }    
                }
                else 
                {
                    if(PWOF.pipe.get([row,i])==empty)
                        PWOF.pipe.set([row,i], stall)
                    i++
                }
            } */


}
PWOF.Execute = (lines,pc) =>
{
    //else next to IDRF under MEM
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("execute")
    let i = row+1
    while(PWOF.pipe.get([row,i])!=IDRF)
    {
        i++
    }
    i++
    let j = row+1
    if(PWOF.prevPC!=pc && PWOF.isDependent(lines[PWOF.prevPC], lines[pc]))//dependent on previous
    {   
        //console.log("dependent on previous")     
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
        //console.log("dependent on previous previous")
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

    /* if(i>=col || PWOF.isDependent(lines[PWOF.prevPC], lines[pc]))
    {
        while(i<col)
        {
            if(PWOF.pipe.get([row,i])==empty)
            {
                PWOF.pipe.set([row,i], stall)
            }
            i++
        }
        PWOF.appendColumn()
        PWOF.pipe.set([row,i], EXE)
    }
    else if(PWOF.isDependent(lines[PWOF.prevprevPC], lines[pc]))
    {
        while(PWOF.pipe.get([row-1,i])!=WB)
        {
            if(i>=col)
            {
                PWOF.appendColumn()
                PWOF.pipe.set([row,i], EXE)  
                return
            }
            PWOF.pipe.set([row,i], stall)
            i++
        }
        if(i>=col)
        {
            PWOF.appendColumn()
            PWOF.pipe.set([row,i], EXE)  
                return
        }
        PWOF.pipe.set([row,i], EXE)        
    }
    else
    {
        while(PWOF.pipe.get([row-1,i])!=MEM)
        {
            if(i>=col)
            {
                PWOF.appendColumn()
                PWOF.pipe.set([row,i], EXE)  
                return
            }
            PWOF.pipe.set([row,i], stall)
            i++
        }
        if(i>=col)
        {
            PWOF.appendColumn()
        }
        PWOF.pipe.set([row,i], EXE) 
    } */
}
PWOF.Memory = (line, pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("memory")
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
    PWOF.pipe.set([row,i], MEM)

}
PWOF.WriteBack = (line,pc) =>
{
    let row = PWOF.pipe.size()[0]
    let col = PWOF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("write-back")
    //find MEM of the current line, if there are any remaining column, fill them with stalls, then append a column and enter WB
    let i = row+1
    while(PWOF.pipe.get([row,i])!=MEM)
    {
        i++
    }
    i++
    while(i<col)
    {
        PWOF.pipe.set([row,i], stall)
        i++
    }
    PWOF.appendColumn()
    PWOF.pipe.set([row,i], WB)
}
PWOF.updateMatrix = (lines, pc)=>
{
    //updating matrix with a line
    let line = lines[pc]
    if(PWOF.pipe==null)
    {
        //console.log("first")
        PWOF.pipe = matrix([[empty, empty, empty, empty, empty, empty]])
        //PWOF.pipe.resize([1,6], empty)
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
        //console.log(row, col)
        PWOF.pipe.resize([row+1, col], empty)
        PWOF.pipe.set([row,0], PWOF.formatInst(line))
        PWOF.InstructionFetch(lines,pc)
        //PWOF.RegisterFetch(lines, pc)
        PWOF.RegisterFetch2(lines, pc)
        PWOF.Execute(lines,pc)
        PWOF.Memory(lines,pc)
        PWOF.WriteBack(line,pc) 
    }
}

PWOF.run = (lines, tags)=>
{
    //console.log(lines)
    PWOF.reset()
    //console.log("PWOF.run")
    /*let a = matrix([["IF", "IDRF", "EXE", "MEM", "WB"]])
    console.log(a) 
    a.resize([2,6], " * ")
    a.set([1,1], "Stall")
    console.log(a) */
    if(lines==null)
        {
            return PWOF.pipe
        } 
    while(!PWOF.isInst(lines[PWOF.pc]))
    {
        PWOF.pc++
        PWOF.prevPC++
        PWOF.prevprevPC++
        if(PWOF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
        {
            /* PWOF.pc=0
            PWOF.prevPC=0
            PWOF.prevprevPC=0 */
            return PWOF.pipe
        }
        //console.log("count")
    }
    do{
        if(lines==null)
        {
            break;
        } 
        while(!PWOF.isInst(lines[PWOF.pc]))
        {
            PWOF.pc++
            if(PWOF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
            {
            /* PWOF.pc=0
            PWOF.prevPC=0
            PWOF.prevprevPC=0 */
            return PWOF.pipe
            }
            //console.log("instruction")
            //console.log(lines[PWOF.pc])
            //code to add a line to matrix
        }
        PWOF.updateMatrix(lines,PWOF.pc)
        PWOF.prevprevPC = PWOF.prevPC
        PWOF.prevPC = PWOF.pc
        PWOF.pc = local.exe(lines, tags, PWOF.pc, PWOF)
        //console.log(PWOF.registers)
        //console.log(PWOF.memory)
       // console.log(PWOF.pipe)
    }while(PWOF.pc!=0)
    return PWOF.pipe
}

export default PWOF
