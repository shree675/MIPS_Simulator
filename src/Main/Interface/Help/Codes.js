// this file contains all the asm program codes
// it provides the appropriate code the HELP panel demands

class Codes{

    bubbleSort = '# procedure:    bubbleSort\n# Objective:    sort an array of integer elements in nondecreasing order\n# Input:        an address of an array of integers\n# Output:       an array sorted in nondecreasing order\n# Please observe the data segment before and after running the program to observe the sorted array\n\n.data\narray:\n	.word 90, 67, 30, 1, 45, 50, 11, 33, 67, 19, 2\n.text\n.globl main\nmain:\n\nbubbleSort:\n\n\n\tlui     $t0, 0x1001\n\tli      $t1, 0     # i = 0;\n\tli      $t2, 0      # j = 0;\n\tli      $s1, 10      # array length\nloop:\n\tbeq     $t1, $s1, exit       # exit if i == length of array -1\n\tlui     $t0, 0x1001\n\tli      $t2, 0      # j = 0;\nforLoop:\n\tbeq     $t2, $s1, exitForLoop   # exit loop if j==length of array -1\n\tlw      $a0, 0($t0)         # a0 = array[j]\n\tlw      $a1, 4($t0)         # a1 = array[j+1]\n\tble     $a0, $a1, update        # if array[j]<=array[j+1] skip\n\tsw      $a1, 0($t0)         # a[j+1] = a[j]\n\tsw      $a0, 4($t0)         # a[j] = a[j+1]\nupdate:\n\taddiu   $t2, $t2, 1         # j++\n\taddiu    $t0, $t0, 4        # point to next element -->\n\tj       forLoop\nexitForLoop:\n\taddiu   $t1, $t1, 1  # i++;\n\tj   loop\nexit:\n\tjr      $ra';

    testcode = '# A program to check sll, srl, li and syscall commands\n.data\n\n.text\n\nmain:\n\tli $v0, 4\n\tli $a0, 20\n\tsrl $a0, $a0, 1\t# dividing by 2\n\tsll $a0, $a0, 1\t# multiply by 2\n\tsyscall\n\tli $v0, 1\n\tli $a0, 5\n\tsyscall\t\t\t# printing 5 on the console\n\tli $v0, 10\n\tli $a0, 5\n\tsyscall';

    fibonacci = '.data\n\t.word 6\n\n.text\n.globl main\n\nmain:\n\n\tli $t0, 0x10010000\n\tlw $s0, 0($t0)\n\n\taddi $s0, $s0, 1				# $s0=n+1\n\n\taddi $s1, $s1, 1				# $s1=1 always\n\n\taddi $t0, $zero, 1				# loop variable i=1\n\n\taddi $t1, $t1, 0				# prev1\n\taddi $t2, $t2, 0				# prev2\n\n\taddi $s2, $s2, 1				# result\n\nLoop:\n\n\tbeq $t0, $s0, Exit\n\n\tbeq $t0, $s1, One\n\tj Exitone\n\nOne:\n\taddi $t1, $t1, 1\n\taddi $t0, $t0, 1\n\tj Loop\n\nExitone:\n\tadd $s1, $t1, $t2\n\taddi $t0, $t0, 1\n\taddi $t2, $t1, 0\n\taddi $t1, $s1, 0\n\tj Loop\n\nExit:\n\n\tli $v0, 1\n\taddi $a0, $s1, 0\n\tsyscall\n\n\tjr $ra\n';

    arithmetic = '# addition and subtraction of two numbers\n.data\n\n.text\n\nmain:\n\taddi $t0, $t0, 5        # load 5\n\taddi $t1, $t1, 10       # load 10\n\n\tadd $t2, $t0, $t1       # 5+10\n\tsub $t3, $t0, $t1       # 5-10\n\n\tli $v0, 1               # print results\n\taddi $a0, $t2, 0\n\tsyscall\n\taddi $a0, $t3, 0\n\tsyscall';

    piptest1 = '.data\n\t.word 12, 14, 16, 15\n\n.text\n.globl main\n\nmain:\n\tli $t2, 0x10010000\n\taddi $t3, $t3, 12\n\tlw $t1, 0($t2)\n\tbeq $t1, $t3, Address\n\nAddress:\n\tadd $t1, $t2, $t3\n\tsub $t3, $t1, $t2\n\tsub $t4, $t1, $t3\n\tli $t3, 0x10010004\n\tlw $t4, 0($t3)\n\tadd $t1, $t4, $t2\n\tsw $t1, 0($t3)\n\tlw $t2, 0($t3)\n\taddi $t3, $t3, 4\n\tlw $t6, 0($t3)\n\tsub $t5, $t6, $t3\n\tbeq $t1, $t2, Loop\n\nLoop:\n\tsw $t5, 0($t3)\n\tjr $ra';

    piptest2 = '.data\n\t	.word 12\n\n.text\n.globl main\n\nmain:\n\n\t	li $t4, 0x10010000\n\n\t	add $t1, $t2, $t3\n\t	sub $t3, $t1, $t2\n\t	sub $t2, $t1, $t2\n\t	lw $t1, 0($t4)\n\t	add $t2, $t1, $zero\n\t	sw $t2, 0($t4)\n\t	lw $t3, 0($t4)\n\t	add $t1, $t2, $t1\n\t	lw $t5, 0($t4)\n\t	sw $t5, 4($t4)\n\n\t	jr $ra\n';

    piptest3 = '.data\n.word 268500996, 8\n\n.text\n.globl main\n\nmain:\n\t    li $t3, 0x10010000\n\t	add $t1, $t2, $zero\n\t	beq $t1, $zero, Next\n\nNext:\n\t	sub $t2, $t1, $t2\n\t	lw $t1, 0($t3)\n\t	lw $t2, 0($t1)\n\t	bne $t1, $t2, Next2\n\nNext2:\n\t	addi $t1, $zero, 0\n\t	beq $zero, $zero, Next3\n\nNext3:\n\t    sw $t1, 0($t3)\n\t	jr $ra';

}
 
export default Codes;