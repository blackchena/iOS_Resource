#include <stdlib.h>
#include <string.h>
#include <stdio.h>



int main(int argc, char **args) {

if (argc != 2) return -1;

int ival = 0;

sscanf(args[1], "%x", &ival);


printf("%d\n", ival);


return 0;
}