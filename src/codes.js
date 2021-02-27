class Codes{

    bubbleSort = '#procedure:    bubbleSort\n# Objective:    sort an array of integer elements in nondecreasing order\n# Input:        an address of an array of integers\n# Output:       an array sorted in nondecreasing order\n# Please observe the data segment before and after running the program to observe the sorted array\n\n.data\narray:\n	.word 90, 67, 30, 1, 45, 50, 11, 33, 67, 19, 2\n.text.globl mainmain:\n\nbubbleSort:\n\n\nlui     $t0, 0x1001\nli      $t1, 0     # i = 0;\nli      $t2, 0      # j = 0;\nli      $s1, 10      # array length\nloop:\nbeq     $t1, $s1, exit       # exit if i == length of array -1\nlui     $t0, 0x1001\nli      $t2, 0      # j = 0;\nforLoop:\nbeq     $t2, $s1, exitForLoop   # exit loop if j==length of array -1\nlw      $a0, 0($t0)         # a0 = array[j]\nlw      $a1, 4($t0)         # a1 = array[j+1]\nble     $a0, $a1, update        # if array[j]<=array[j+1] skip\nsw      $a1, 0($t0)         # a[j+1] = a[j]\nsw      $a0, 4($t0)         # a[j] = a[j+1]\nupdate:\naddiu   $t2, $t2, 1         # j++\n#sll     $t3, $t2, 2         # t3 = j*4\naddiu    $t0, $t0, 4        # point to next element -->\nj       forLoop\nexitForLoop:\naddiu   $t1, $t1, 1  # i++;\nj   loop\nexit:\njr      $ra';

    testcode = 'li $v0, 4\nli $a0, 20\nsrl $a0, $a0, 1\nsll $a0, $a0, 1\nsyscall\nli $v0, 1\nli $a0, 5\nsyscall\nli $v0, 10\nli $a0, 5\nsyscall';

    // return (bubbleSort);
}
 
export default Codes;