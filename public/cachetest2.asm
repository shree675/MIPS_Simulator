# Sample program to test cache writes

.data
    .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
    
.text
.globl main

main:

    li $s0, 0x10010000
    
    lw $t0, 0($s0)          # read 1
    lw $t0, 20($s0)         # read 6
    
    sw $t0, 4($s0)          # write 6 into 2
    
    sw $t0, 0($s0)          # write 6 into 1
    
    lw $t0, 36($s0)         # read 10
    lw $t0, 4($s0)          # read 6 (updated value)
    lw $t0, 16($s0)         # read 5
    addi $t0, $t0, 17
    
    sw $t0, 36($s0)         # write 22 into 10
    
    addi $t0, $zero, 1245
    
    sw $t0, 28($s0)         # write 1245 into 8