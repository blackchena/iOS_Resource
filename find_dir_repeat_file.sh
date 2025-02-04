#!/bin/bash

# 指定目录
directory="$1"
echo $directory

# 在指定目录下查找所有子目录中重复命名的文件
cd "$directory" || exit

# 利用 find 和 sort 命令查找重复的文件名
find . -type f -exec basename {} \; | sort | uniq -d | while read -r file; do
    find . -type f -name "$file"
done
