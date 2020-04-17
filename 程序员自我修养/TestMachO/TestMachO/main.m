//
//  main.m
//  TestMachO
//
//  Created by chensiyu on 2020/4/7.
//  Copyright © 2020 Gioneco. All rights reserved.
//

//__attribute__((section("__DATA,FOO"))) int global = 42;
int global_init_var = 84;
long int global_uninit_var;
void func1(int i) {
    printf("%lu\n", sizeof(global_uninit_var));
}

int main(int argc, const char * argv[]) {
    /* code */

    static int static_var = 85;
    static int static_var2;
    int a = 1;
    int b;
    func1(static_var + static_var2 + a + b);
    return 0;
}
