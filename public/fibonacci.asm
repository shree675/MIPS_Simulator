.data
.word 6

.text
.globl main

main:
	
	li $t0, 0x10010000
	lw $s0, 0($t0)

	addi $s0, $s0, 1				# $s0=n+1

	addi $s1, $s1, 1				# $s1=1 always

	addi $t0, $zero, 1				# loop variable i=1

	addi $t1, $t1, 0				# prev1
	addi $t2, $t2, 0				# prev2

	addi $s2, $s2, 1				# result
	
Loop:
	
	beq $t0, $s0, Exit

	beq $t0, $s1, One
	j Exitone

	One:
		addi $t1, $t1, 1
		addi $t0, $t0, 1
		j Loop

	Exitone:
		add $s1, $t1, $t2
		addi $t0, $t0, 1
		addi $t2, $t1, 0
		addi $t1, $s1, 0
		j Loop

Exit:
	
	li $v0, 1
	addi $a0, $s1, 0
	syscall

	jr $ra
