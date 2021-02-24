# MIPS_Simulator
**MIPSploration.asm** is a web-based assembly language simulator that shows you how your MIPS assembly code alters the registers, memory and other related entities, step by step.
This project was developed as a part of the Computer Organization Lab course and aims to provide a exploratory experience of MIPS and related basic concepts of Computer Organization. 

###Get Started
This Simulator has been developed using React. To host it locally, run the following
1. Download the zip file
2. run "npm install"
3. run "npm start"
*Node and npm are required to run Simulator locally

###How to use it?
1. Enter your MIPS assembly code in the integrated code editor provided either by typing or using the Upload option
2. Click on RUN to process the entire code altogether 
    or
   Click on STEP to execute each line of code step by step
3. Observe the REGISTERS changing values in the panel on the left. 
4. Switch to the MEMORY display to observe the contents of the data segment.
5. Print outputs appear on the read-only console present at the bottom.
5. Click on CLEAR ALL to clear the editor, console, registers and memory.

###Instructions supported by MIPSploration.asm

.word
add $1,$2,$3
sub $1,$2,$3 
addi $1,$2,100 
bne $1,$2,100
lw $1,100($2)
sw $1,100($2)
lui $1,100 
li $1,100 
beq $1,$2,100
ble $1,$2,100
addiu $1,$2,100
addu $1,$2,$3
j loop:
syscall

###Note:
1. It is recommended to strictly follow the syntax and formatting conventions of MIPS to avoid unforseen errors. Avoid using registers that are not allowed for user such as the $at register.
2. Refreshing the page will result in loss of contents of the editor, registers and memory.

