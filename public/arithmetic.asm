# addition and subtraction of two numbers

.data

.text
addi $t0, $t0, 5        # load 5
addi $t1, $t1, 10       # load 10
        
add $t2, $t0, $t1       # 5+10
sub $t3, $t0, $t1       # 5-10

li $v0, 1               # print results
addi $a0, $t2, 0
syscall
addi $a0, $t3, 0
syscall
