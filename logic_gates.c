// Logic Gate Simulator (C)
// Compile: gcc logic.c -o logic
// Run: ./logic

#include <stdio.h>

// Basic Gate Functions
int AND(int a, int b) { return a && b; }
int OR(int a, int b)  { return a || b; }
int NOT(int a)        { return !a; }

int main() {
    int inputA = 1, inputB = 0;
    
    printf("--- Logic Gate Simulator ---\n");
    printf("Inputs: A=%d, B=%d\n", inputA, inputB);
    printf("A AND B = %d\n", AND(inputA, inputB));
    printf("A OR B  = %d\n", OR(inputA, inputB));
    printf("NOT A   = %d\n", NOT(inputA));
    
    return 0;
}
