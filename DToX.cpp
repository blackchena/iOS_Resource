#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main(int argc, char **args) {

if (argc != 2) return -1;

int ival = atoi(args[1]);

printf("%08x\n", ival);


return 0;
}