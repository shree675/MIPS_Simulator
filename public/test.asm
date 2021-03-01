main:
li $v0, 4
li $a0, 20
srl $a0, $a0, 1
sll $a0, $a0, 1
syscall
li $v0, 1
li $a0, 5
syscall
li $v0, 10
li $a0, 5
syscall