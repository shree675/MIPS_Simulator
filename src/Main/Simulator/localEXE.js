var local = 
{
    //this function is a copy of execute.exe and is used by the PWF and PWOF functions to independently simulate the programs again to generate the pipeline diagrams
};
local.exe = (lines, tags, pc, processor) =>
{
    if(lines==null)
    {
        pc = 0;
        return pc;
    }
    let line = lines[pc]
    if(line[0].includes(":") && line.length!=1)
    {
        line.splice(0,1)//removes the tag from the beginning hence s=extracting the instruction
    }
    if(line[0]=="" || line[0]=="#")
    {
        pc = pc+1
    }
    else if(line[0].includes(":") && line.length===1)
    {
        pc = pc+1
    }
    else if(line[0]==="add" || line[0]==="addu")
    {
        let src1 = line[2].replace("$", "")
        let src2 = line[3].replace("$", "")
        let dest = line[1].replace("$", "")
        let val1 = processor.getRegister(src1)
        let val2 = processor.getRegister(src2)
        processor.setRegister(dest, (val1+val2))
        pc = pc+1
    }
    else if(line[0]==="sub" || line[0]==="subu")
    {
        let src1 = line[2].replace("$", "")
        let src2 = line[3].replace("$", "")
        let dest = line[1].replace("$", "")
        let val1 = processor.getRegister(src1)
        let val2 = processor.getRegister(src2)
        processor.setRegister(dest, (val1-val2))
        pc = pc+1
    }
    else if(line[0]==="addi" || line[0]==="addiu")
    {
        let src1 = line[2].replace("$", "")
        let src2 = parseInt(line[3])
        let dest = line[1].replace("$", "")
        let val1 = processor.getRegister(src1)
        let val2 = src2
        processor.setRegister(dest, (val1+val2))
        pc = pc+1
    }
    else if(line[0]==="srl")
    {
        let src1 = line[2].replace("$", "")
        let src2 = parseInt(line[3])
        let dest = line[1].replace("$", "")
        let val1 = processor.getRegister(src1)
        let val2 = src2
        processor.setRegister(dest, (val1>>val2))
        pc = pc+1
    }
    else if(line[0]==="sll")
    {
        let src1 = line[2].replace("$", "")
        let src2 = parseInt(line[3])
        let dest = line[1].replace("$", "")
        let val1 = processor.getRegister(src1)
        let val2 = src2
        processor.setRegister(dest, (val1<<val2))
        pc = pc+1
    }
    else if(line[0]==="bne")
    {
        let src1 = line[1].replace("$", "")
        let src2 = line[2].replace("$", "")
        let dest = tags.get(line[3]+":")
        let val1 = processor.getRegister(src1)
        let val2 = processor.getRegister(src2)
        if(val1!=val2)
        {
            pc = dest
        }
        else
        {
            pc = pc+1
        }
    }
    else if(line[0]==="beq")
    {
        let src1 = line[1].replace("$", "")
        let src2 = line[2].replace("$", "")
        let dest = tags.get(line[3]+":")
        let val1 = processor.getRegister(src1)
        let val2 = processor.getRegister(src2)
        if(val1===val2)
        {
            pc = dest
        }
        else
        {
            pc = pc+1
        }
    }
    else if(line[0]==="ble")
    {
        let src1 = line[1].replace("$", "")
        let src2 = line[2].replace("$", "")
        let dest = tags.get(line[3]+":")
        let val1 = processor.getRegister(src1)
        let val2 = processor.getRegister(src2)
        if(val1<=val2)
        {
            pc = dest
        }
        else
        {
            pc = pc+1
        }
    }
    else if(line[0]==="j")
    {
        let dest = tags.get(line[1]+":")
        pc = dest
    }
    else if(line[0]==="li")
    {
        let src1 = parseInt(line[2])
        let dest = line[1].replace("$", "")
        processor.setRegister(dest, src1)
        pc = pc+1
    }
    else if(line[0]==="lui")
    {
        let src1 = parseInt(line[2])
        let dest = line[1].replace("$", "")
        processor.setRegister(dest, src1*(2**16))
        pc = pc+1
    }
    else if(line[0]==="lw")
    {
        let src = line[2].split("(")
        let offset = parseInt(src[0])
        let src1 = src[1].replace("$", "").replace(")", "")
        let src2 = offset + processor.getRegister(src1)
        let dest = line[1].replace("$", "")
        let value = processor.getMemory(src2)
        processor.setRegister(dest, value)
        pc = pc+1
    }
    else if(line[0]==="sw")
    {
        let dest = line[2].split("(")
        let offset = parseInt(dest[0])
        let dest1 = dest[1].replace("$", "").replace(")", "")
        let dest2 = offset + processor.getRegister(dest1)
        let src = line[1].replace("$", "")
        let value = processor.getRegister(src)
        processor.setMemory(dest2, value)
        pc = pc+1
    }
    
    else if(line[0]==="syscall")
    {
        let code = processor.getRegister("v0")
        switch(code)
        {
            case 1:
                const text = processor.getRegister("a0")
                pc = pc+1
                break;
            case 4:
                pc = pc+1
                break;
            case 10:
                pc=0
                break;
            default:
                pc=pc+1
        }
        
    }
    else if(line[0]==="jr")
    {
        pc = pc+1
    }
    else
    {
        pc=pc+1
    }
    if(pc===lines.length)//if pc has reached the end of the lines pf code, reinitialize to 0, ready for the next step or run
    {
        pc=0
    }
    return pc
}

export default local