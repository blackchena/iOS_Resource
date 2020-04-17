__attribute__((section("__DATA,FOO"))) int global = 42;
int global_init_var = 84;
long int global_uninit_var;
void func1(int i) {
	printf("%d\n", sizeof(global_uninit_var));
	printf("%d\n", sizeof(global_uninit_var));
}

int main(void)
{
	/* code */

	static int static_var = 85;
	static int static_var2;
	int a = 1;
	int b;
	func1(static_var + static_var2 + a + b);
	return 0;
}