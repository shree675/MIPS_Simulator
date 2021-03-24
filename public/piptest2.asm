.data
	.word 12

.text
.globl main

main:
	
	li $t4, 0x10010000

	add $t1, $t2, $t3
	sub $t3, $t1, $t2
	sub $t2, $t1, $t2
	lw $t1, 0($t4)
	add $t2, $t1, $zero
	sw $t2, 0($t4)
	lw $t3, 0($t4)
	add $t1, $t2, $t1
	lw $t5, 0($t4)
	sw $t5, 4($t4)

	jr $ra
