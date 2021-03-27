# MIPS_Simulator
*MIPSploration.asm* is a web-based assembly language simulator that shows you how your MIPS assembly code alters the registers, memory and other related entities, step by step.
This project was developed as a part of the Computer Organization Lab course and aims to provide a exploratory experience of MIPS and related basic concepts of Computer Organization. 

## Get Started
This Simulator has been developed using React. To host it locally, run the following
1. Download the zip file
2. run ```npm install```
3. run ```npm start```
<p>*Node and npm are required to run Simulator locally</p>

## How to use it
1. Enter your MIPS assembly code in the integrated code editor provided either by typing or using the Upload option.
2. Click on RUN to process the entire code altogether and generate the pipeline
    or
   Click on STEP to execute each line of code step by step.
3. Observe the REGISTERS changing values in the panel on the left. 
4. Switch to the MEMORY display to observe the contents of the data segment.
5. Print outputs appear on the read-only console present at the bottom.
6. On clicking on RUN, two versions of the pipeline are generated - with forwarding and without forwarding.
7. The two pipeline tables along with the IPC and the number of stalls are displayed in the console region. Navigate to the two versions by clicking on either 'Pipeline-Forwarding' or 'Pipeline-NoForwarding' buttons next to 'Console' button.
8. Click on CLEAR ALL to clear the editor, console, pipeline, registers and memory.

## Instructions supported by MIPSploration.asm

><p>.word</p>
><p>add $1,$2,$3</p>
><p>sub $1,$2,$3</p>
><p>subu $1,$2,$3 </p>
><p>addi $1,$2,100</p>
><p>bne $1,$2,100</p>
><p>lw $1,100($2)</p>
><p>sw $1,100($2)</p>
><p>lui $1,100</p>
><p>li $1,100</p>
><p>beq $1,$2,100</p>
><p>ble $1,$2,100</p>
><p>addiu $1,$2,100</p>
><p>addu $1,$2,$3</p>
><p>j loop</p>
><p>srl $a0,$a0,1</p>
><p>sll $a0,$a0,1</p>
><p>syscall</p>

## Note
1. It is recommended to strictly follow the syntax and formatting conventions of MIPS to avoid unforseen errors. Avoid using registers that are not allowed for user such as the $at register.
2. Refreshing the page or navigating to the instructions page will result in loss of contents of the editor, registers and memory.
