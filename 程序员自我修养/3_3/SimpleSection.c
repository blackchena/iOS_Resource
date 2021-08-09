/* 
 * SimpleSection.c
 * 
 * Linux:
 *   gcc -c SimpleSection.c
 *
 * Windows:
 *   cl SimpleSection.c /c /Za
 */

int printf( const char* format, ... );

int global_init_var = 84;
int global_uninit_var;

void func1( int i ) 
{
  printf( "%d\n",  i );
}

int main(void)
{
    static int static_var = 85;
 static int static_var2;

    int a = 1;
    int b; 

    func1( static_var + static_var2 + a + b );

    return a; 
}

/*
OVERVIEW: llvm object file dumper

USAGE: objdump [options] <input object files>

OPTIONS:

Generic Options:

  --help                           - Display available options (--help-hidden for more)
  --help-list                      - Display list of available options (--help-list-hidden for more)
  --version                        - Display the version of this program

llvm-objdump MachO Specific Options:

  --arch=<string>                  - architecture(s) from a Mach-O file to dump
  --archive-member-offsets         - Print the offset to each archive member for Mach-O archives (requires -macho and -archive-headers)
  --bind                           - Display mach-o binding info
  --data-in-code                   - Print the data in code table for Mach-O objects (requires -macho)
  --dis-symname=<string>           - disassemble just this symbol's instructions (requires -macho)
  --dsym=<string>                  - Use .dSYM file for debug info
  --dylib-id                       - Print the shared library's id for the dylib Mach-O file (requires -macho)
  --dylibs-used                    - Print the shared libraries used for linked Mach-O files (requires -macho)
  --exports-trie                   - Display mach-o exported symbols
  --full-leading-addr              - Print full leading address
  -g                               - Print line information from debug info if available
  --indirect-symbols               - Print indirect symbol table for Mach-O objects (requires -macho)
  --info-plist                     - Print the info plist section as strings for Mach-O objects (requires -macho)
  --lazy-bind                      - Display mach-o lazy binding info
  --link-opt-hints                 - Print the linker optimization hints for Mach-O objects (requires -macho)
  --no-leading-headers             - Print no leading headers
  --no-symbolic-operands           - do not symbolic operands when disassembling (requires -macho)
  --non-verbose                    - Print the info for Mach-O objects in non-verbose or numeric form (requires -macho)
  --objc-meta-data                 - Print the Objective-C runtime meta data for Mach-O files (requires -macho)
  --private-header                 - Display only the first format specific file header
  --rebase                         - Display mach-o rebasing info
  --universal-headers              - Print Mach-O universal headers (requires -macho)
  --weak-bind                      - Display mach-o weak binding info

llvm-objdump Options:

  -C                               - Alias for --demangle
  -D                               - Alias for --disassemble-all
  -M                               - Alias for --disassembler-options
  -R                               - Alias for --dynamic-reloc
  -S                               - Alias for -source
  -a                               - Alias for --archive-headers
  --adjust-vma=<offset>            - Increase the displayed address by the specified offset
  --all-headers                    - Display all available header information
  --arch-name=<string>             - Target arch to disassemble for, see -version for available targets
  --archive-headers                - Display archive header information
  -d                               - Alias for --disassemble
  --demangle                       - Demangle symbols names
  --disassemble                    - Display assembler mnemonics for the machine instructions
  --disassemble-all                - Display assembler mnemonics for the machine instructions
  --disassemble-functions=<string> - List of functions to disassemble. Accept demangled names when --demangle is specified, otherwise accept mangled names
  --disassemble-zeroes             - Do not skip blocks of zeroes when disassembling
  --disassembler-options=<options> - Pass target specific disassembler options
  --dwarf=<value>                  - Dump of dwarf debug sections:
    =frames                        -   .debug_frame
  --dynamic-reloc                  - Display the dynamic relocation entries in the file
  -f                               - Alias for --file-headers
  --fault-map-section              - Display contents of faultmap section
  --file-headers                   - Display the contents of the overall file header
  --full-contents                  - Display the content of each section
  -h                               - Alias for --section-headers
  --headers                        - Alias for --section-headers
  -j                               - Alias for --section
  -l                               - Alias for --line-numbers
  --line-numbers                   - Display source line numbers with disassembly. Implies disassemble object
  -m                               - Alias for --macho
  --macho                          - Use MachO specific object file parser
  --mattr=<a1,+a2,-a3,...>         - Target specific attributes
  --mcpu=<cpu-name>                - Target a specific cpu type (-mcpu=help for details)
  --no-leading-addr                - Print no leading address
  --no-show-raw-insn               - When disassembling instructions, do not print the instruction bytes.
  -p                               - Alias for --private-headers
  --print-imm-hex                  - Use hex format for immediate values
  --private-headers                - Display format specific file headers
  -r                               - Alias for --reloc
  --raw-clang-ast                  - Dump the raw binary contents of the clang AST section
  --reloc                          - Display the relocation entries in the file
  -s                               - Alias for --full-contents
  --section=<string>               - Operate on the specified sections only. With -macho dump segment,section
  --section-headers                - Display summaries of the headers for each section.
  --show-lma                       - Display LMA column when dumping ELF section headers
  --source                         - Display source inlined with disassembly. Implies disassemble object
  --start-address=<address>        - Disassemble beginning at address
  --stop-address=<address>         - Stop disassembly at address
  --syms                           - Display the symbol table
  -t                               - Alias for --syms
  --triple=<string>                - Target triple to disassemble for, see -version for available targets
  -u                               - Alias for --unwind-info
  --unwind-info                    - Display unwind information
  --wide                           - Ignored for compatibility with GNU objdump
  -x                               - Alias for --all-headers
  -z                               - Alias for --disassemble-zeroes

Pass @FILE as argument to read options from FILE.
*/