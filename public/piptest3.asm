.data
	.word 268500996, 8

.text
.globl main

main:
	
	li $t3, 0x10010000

	add $t1, $t2, $zero
	beq $t1, $zero, Next

Next:
	sub $t2, $t1, $t2
	lw $t1, 0($t3)
	lw $t2, 0($t1)						# not considering MEM-WB to EX-MEM forwarding
	bne $t1, $t2, Next2

Next2:
	addi $t1, $zero, 0
	beq $zero, $zero, Next3

Next3: sw $t1, 0($t3)

	jr $ra
