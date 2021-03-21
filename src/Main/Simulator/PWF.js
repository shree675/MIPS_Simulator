import { matrix } from 'mathjs'
import local from './localEXE.js'

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
};
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

PWF.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWF.memory[index]=value
}
PWF.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    return PWF.memory[index]
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
}

PWF.isInst = (line)=>
{
    if(line=="" || line[0]=="#")
        return false
    for(var i of instructions)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isMemInst = (line)=>
{
    for(var i of memInst)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isBranchInst = (line)=>
{
    for(var i of branchInst)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isTwoSource = (line)=>
{
    for(var i of TwoSource)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isOneSource = (line)=>
{
    for(var i of OneSource)
    {
        if(line.includes(i))
            return true
    }
    return false
}
PWF.isExeWrite = (line)=>
{
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
    //console.log(PWF.pipe)
}
PWF.formatInst = (line)=>
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
/* PWF.isDependent = (line1, line2) =>
{
    //console.log("****")
    if(line1.includes(":"))
        line1.splice(0,1)//removes the tag from the beginning hence extracting the instruction
    if(line2.includes(":"))
        line2.splice(0,1)//removes the tag from the beginning hence extracting the instruction

    //console.log(line1, line2)
    //console.log("****")
    if(PWF.isBranchInst(line1)|| line1.includes("sw")|| line1.includes("syscall"))
    {
        return false
    }
    if(PWF.isBranchInst(line2))
    {
        if(line2.includes("bne")||line2.includes("ble")||line2.includes("beq"))
        {
            let dep1 = line2[1]
            let dep2 = line2[2]
            let dest = line1[1]
            if(dest===dep1 || dest===dep2)
            {
                return true
            }
            return false          
        }
        else
        {//j 
            return false
        }
    }
    if(PWF.isTwoSource(line2))
    {
        let dest = line1[1]
        let dep1 = line2[2]
        let dep2 = line2[3]
        if(dest===dep1 || dest===dep2)
        {
            return true
        }
        return false

    }
    if(PWF.isOneSource(line2))
    {
        let dest = line1[1]
        let dep1 = line2[2]
        if(dest===dep1)
        {
            return true
        }
        return false
    }
} */
PWF.isBranchDependent = (lines, pc) => //Here we check all cases that result in one stall, we check both previous and prev prev pc
{
    let line1 = lines[PWF.prevprevPC]
    let line2 = lines[PWF.prevPC]
    let line3 = lines[pc]
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
        let dep1 = line2[2].split("()")[1]
        if(dest===dep1)
        {
            return true
        }
        return false  
    }
    if(line2.includes("sw"))
    {
        let dep1 = line2[1]
        let dep2 = line2[2].split("()")[1]
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
    //console.log(row, col)
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
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("register fetch")
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
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("execute")
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
PWF.Memory = (line, pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("memory")
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
    PWF.pipe.set([row,i], MEM)
}
PWF.WriteBack = (line,pc) =>
{
    let row = PWF.pipe.size()[0]
    let col = PWF.pipe.size()[1]
    //console.log(row, col)
    row=row-1//row refers to index now
    //console.log("write-back")
    //find MEM of the current line, if there are any remaining column, fill them with stalls, then append a column and enter WB
    let i = row+1
    while(PWF.pipe.get([row,i])!=MEM)
    {
        i++
    }
    i++
    while(i<col)
    {
        PWF.pipe.set([row,i], stall)
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
        //console.log("first")
        PWF.pipe = matrix([[empty, empty, empty, empty, empty, empty]])
        //PWOF.pipe.resize([1,6], empty)
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
        //console.log(row, col)
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
    //console.log(lines)
    PWF.reset()
    //console.log("PWOF.run")
    /*let a = matrix([["IF", "IDRF", "EXE", "MEM", "WB"]])
    console.log(a) 
    a.resize([2,6], " * ")
    a.set([1,1], "Stall")
    console.log(a) */
    if(lines==null)
        {
            return PWF.pipe
        } 
    while(!PWF.isInst(lines[PWF.pc]))
    {
        PWF.pc++
        PWF.prevPC++
        PWF.prevprevPC++
        if(PWF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
        {
            /* PWOF.pc=0
            PWOF.prevPC=0
            PWOF.prevprevPC=0 */
            return PWF.pipe
        }
        //console.log("count")
    }
    do{
        if(lines==null)
        {
            break;
        } 
        while(!PWF.isInst(lines[PWF.pc]))
        {
            PWF.pc++
            if(PWF.pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
            {
            /* PWOF.pc=0
            PWOF.prevPC=0
            PWOF.prevprevPC=0 */
            return PWF.pipe
            }
            //console.log("instruction")
            //console.log(lines[PWOF.pc])
            //code to add a line to matrix
        }
        PWF.updateMatrix(lines,PWF.pc)
        PWF.prevprevPC = PWF.prevPC
        PWF.prevPC = PWF.pc
        PWF.pc = local.exe(lines, tags, PWF.pc, PWF)
        //console.log(PWOF.registers)
        //console.log(PWOF.memory)
       // console.log(PWOF.pipe)
    }while(PWF.pc!=0)
    return PWF.pipe
}

export default PWF
