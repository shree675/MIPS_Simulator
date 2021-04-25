<p>
    <img src="https://img.shields.io/badge/react-v17.0.1-brightgreen">&emsp;
    <img src="https://img.shields.io/badge/JavaScript-89.1%25-informational">&emsp;
    <img src="https://img.shields.io/badge/deployement-vercel-lightgrey">&emsp;
    <img src="https://img.shields.io/badge/dependencies-3%20out%20of%20date-orange">
</p>

# MIPSploration.asm
<img src="readme_assets/asmIcon.svg" height="150" width="150">

*MIPSploration.asm* is a web-based assembly language simulator that shows you how your MIPS assembly code alters the registers, memory and other related entities, step by step.
This project was developed as a part of the Computer Organization Lab course and aims to provide a exploratory experience of MIPS and related basic concepts of Computer Organization. 

## Get Started
This Simulator has been developed using React. To host it locally, run the following
1. Download the zip file (or) fork this repository and use ```git clone``` to clone it on your local desktop
2. Run ```npm install```
3. Run ```npm start```
<p>*Node and npm are required to run Simulator locally</p>

## How to use it
1. Enter your MIPS assembly code in the integrated code editor provided either by typing or using the Upload option.
2. Click on RUN to process the entire code altogether and generate the pipeline
    (or)
   Click on STEP to execute each line of code step by step.
3. Observe the REGISTERS changing values in the panel on the left. 
4. Switch to the MEMORY display to observe the contents of the data segment.
5. Print outputs appear on the read-only console present at the bottom.
6. On clicking on RUN, two versions of the pipeline are generated - with forwarding and without forwarding.
7. The two pipeline tables along with the IPC and the number of stalls are displayed in the console region. Navigate to the two versions by clicking on either 'Pipeline-Forwarding' or 'Pipeline-NoForwarding' buttons next to 'Console' button.
8. Switch to the Cache segment to enable/disable cache with appropriate settings.
9. Click on STEP to see the changes in the caches in real time, or click on RUN to generate the final cache table configurations.
10. Click on CLEAR ALL to clear the editor, console, pipeline, registers and memory.

## More on Pipeline
* There are five stages in the pipeline:                                                                                                                        
Instruction Fetch (IF), Instruction Decode/Register Fetch (IDRF), Execute (EX), Memory (MEM) and Write Back (WB).
* The types of forwarding allowed are EX-MEM to ID/RF-EX and MEM-WB to ID/RF-EXE.
* In this simulator, syscall requires the correct values of registers $a0 and $v0 at the EXE stage. A failed IDRF stage is considered to be a STALL, hence IDRF stage occurs only once per instruction.

Note:
1. Large files may take up to 1 minute to execute. If an unresponsive page prompt is thrown, then please click on Wait until it finishes executing.
2. The pipeline tables displayed will be trimmed to fit within 200 columns or 100 rows, in the case of long pipelines.

## More on Cache
* There are two levels of cache: L1 and L2. Each level cache can be tuned independent of the other, according to the requirements.
* The replacement policy followed in both levels of cache is [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#:~:text=LRU%2C%20like%20many%20other%20replacement,charged%20particle%20placed%20in%20it.) (Least Recently Used).
* This multi-level cache adheres to [non-inclusive](https://en.wikipedia.org/wiki/Cache_inclusion_policy#:~:text=NINE%20Policy,-Figure%203.&text=for%20block%20X.-,If%20the%20block%20is%20found%20in%20L1%20cache%2C%20then%20the,and%20returned%20to%20the%20processor.&text=If%20the%20block%20is%20not%20found%20in%20both%20L1%20and,there%20is%20no%20back%20invalidation.) inclusion policy.
* [Write-through](https://www.geeksforgeeks.org/write-through-and-write-back-in-cache/#:~:text=In%20write%20through%2C%20data%20is,power%20outage%20or%20system%20failure) write strategy has been adopted by this simulator.
- [x] Hypothetical Ideal Case:

On selecting this option in the cache settings, the cache is completely disabled and MEM latency is assumed to be 1 clock cycle. This option has been incoorporated to portray the significant difference in the IPC in the ideal case vs the real-world case.


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

## Additional Notes
1. It is recommended to strictly follow the syntax and formatting conventions of MIPS to avoid unforseen errors. Avoid using registers that are not allowed for user such as the $at register.
2. Refreshing the page or navigating to the instructions page will result in loss of contents of the editor, registers and memory.

## Framework
This simulator has been built using React. Visit [React dev](https://reactjs.org/).

Icons, SVGs, templates and design are custom built on the platform [Figma](https://www.figma.com/files/recent?fuid=923224080357619403).

This simulator has been deployed on [Vercel](https://vercel.com).
