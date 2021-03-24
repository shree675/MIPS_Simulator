.data
	.word 12, 14, 16, 15

.text
.globl main

main:
	li $t2, 0x10010000
	addi $t3, $t3, 12

	lw $t1, 0($t2)
	beq $t1, $t3, Address
Address:
	add $t1, $t2, $t3
	sub $t3, $t1, $t2
	sub $t4, $t1, $t3

	li $t3, 0x10010004

	lw $t4, 0($t3)
	add $t1, $t4, $t2
	sw $t1, 0($t3)
	lw $t2, 0($t3)
	addi $t3, $t3, 4				# add $t3, $t4, $t5
	lw $t6, 0($t3)
	sub $t5, $t6, $t3
	beq $t1, $t2, Loop
Loop:
	sw $t5, 0($t3)

	jr $ra
