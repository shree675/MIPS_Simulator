var processor = {
    //running: true,
    memory: new Array(1024).fill(0),
    //instrLabels: {},
    //dataLables: {},
    // wordAddr: [],
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
    //pc: 0,
    //endOfInstr: false
}

processor.setRegister = (reg, num) => {
    if(reg==='r0' || reg==='zero')
        processor.registers.set('r0', 0)
    else
        processor.registers.set(reg, num)
}

processor.getRegister = (reg) => {
    if(reg === "zero" || reg==='r0'){//what is this?
        // console.log("getting zero")
        return 0;
    }
    return processor.registers.get(reg)
}

processor.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    processor.memory[index]=value
}
processor.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    return processor.memory[index]
} 
processor.reset = () => {
    //processor.running = true
    
    processor.memory = new Array(1024).fill(0)
    // console.log('reset',processor.memory);
    // for(var i=0;i<1024;i++){
    //     processor.memory[i]=0;
    // }
    //processor.dataLables = {}
    //processor.instrLabels = {}
    processor.pc = 0
    //processor.endOfInstr = false
    //processor.setRegister("sp", 1024*4)
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
}

export default processor 