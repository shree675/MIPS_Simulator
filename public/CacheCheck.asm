.data
array:
    .word 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

main:
    lui $s1, 0x1001
    li $s0, 0    #store sum here
    li $t1, 10   #counter
    li $t0, 0

loop:
    beq $t0, $t1, end
    lw $t2, 0($s1)      #load number into register
    addi $t1, $t1, -1   #decrement counter
    add $s0, $s0, $t2   #add to current sum
    addi $s1, $s1, 4    #increment address register
    j loop

end:
    li $v0, 1
    add $a0, $zero, $s0 
    syscall
    li $v0, 10
    syscall
