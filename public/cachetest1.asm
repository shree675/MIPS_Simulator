# Sample program to test cache reads

.data
    .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
    
.text
.globl main

main:

    li $s0, 0x10010000

    lw $t0, 0($s0)      # read 1
    lw $t0, 8($s0)      # read 3
    lw $t0, 20($s0)     # read 20
    lw $t0, 4($s0)      # access 2 from L1
    lw $t0, 32($s0)     # read 9
    lw $t0, 16($s0)     # read 5
    lw $t0, 48($s0)     # read 13
    lw $t0, 0($s0)      # access 1 from L2
    lw $t0, 64($s0)     # read 17
    lw $t0, 12($s0)     # access 4 from L1