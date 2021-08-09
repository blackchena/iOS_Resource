# lldb指定格式打印内存中字节序

## 目的

查看对应地址后内存中的字节序：x/nfu addr


## 参考

* [GDB to LLDB command map — The LLDB Debugger](https://lldb.llvm.org/use/map.html)
	> LLDB now supports the GDB shorthand format syntax but there can't be space after the command
* [Memory (Debugging with GDB)](https://sourceware.org/gdb/download/onlinedocs/gdb/Memory.html#Memory)
	` x/nfu addr `
	> n, f, and u are all optional parameters that specify how much memory to display and how to format it; addr is an expression giving the address where you want to start displaying memory. If you use defaults for nfu, you need not type the slash ‘/’. Several commands set convenient defaults for addr.
* [Output Formats (Debugging with GDB)](https://sourceware.org/gdb/download/onlinedocs/gdb/Output-Formats.html#Output-Formats)
	> Print as integer in binary. The letter ‘t’ stands for “two” 二进制形式打印

* [C - Data Types - Tutorialspoint](https://www.tutorialspoint.com/cprogramming/c_data_types.htm)c语音基础数据类型的内存占用