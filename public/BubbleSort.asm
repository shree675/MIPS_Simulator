# Procedure:    bubbleSort
# Objective:    sort an array of integer elements in nondecreasing order
# Input:        an address of an array of integers
# Output:       an array sorted in nondecreasing order
# Please observe the data segment before and after running the program to observe the sorted array

.data
array:	
	.word 90, 67, 30, 1, 45, 50, 11, 33, 67, 19, 2
.text
.globl main
main:
 
bubbleSort:
 

lui     $t0, 0x1001
li      $t1, 0     # i = 0;
li      $t2, 0      # j = 0;
li      $s1, 10      # array length
loop:
    beq     $t1, $s1, exit       # exit if i == length of array -1
    lui     $t0, 0x1001
    li      $t2, 0      # j = 0;
    forLoop:
        beq     $t2, $s1, exitForLoop   # exit loop if j==length of array -1
        lw      $a0, 0($t0)         # a0 = array[j]
        lw      $a1, 4($t0)         # a1 = array[j+1]
        ble     $a0, $a1, update        # if array[j]<=array[j+1] skip
        sw      $a1, 0($t0)         # a[j+1] = a[j]
        sw      $a0, 4($t0)         # a[j] = a[j+1]
        update:
        addiu   $t2, $t2, 1         # j++
        #sll     $t3, $t2, 2         # t3 = j*4
        addiu    $t0, $t0, 4        # point to next element -->
        j       forLoop
    exitForLoop:
        addiu   $t1, $t1, 1  # i++;
        j   loop
exit:
    jr      $ra