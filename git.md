# git

* [常用git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)
* [廖雪峰git 教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

## diff
* 使用 git diff 命令可以查看工作区与暂存区之间的差异。
* 使用 git diff <gitreversion> 命令可以查看工作区与指定版本之间的差异。
* 使用 git diff --cached 命令可以查看暂存区与当前 HEAD 指针指向版本之间的差异。
* 使用 git diff --cached <gitreversion> 命令可以查看暂存区与指定版本之间的差异。
* 使用 git diff -- <file> 可以查看特定文件在工作区与暂存区之间的差异。
* 使用 git diff <gitreversion> -- <file> 可以查看特定文件在工作区与指定版本之间的差异。
* 使用 git diff --cached -- <file> 可以查看特定文件在暂存区与当前 HEAD 指针指向版本之间的差异。
* 使用 git diff --cached <gitreversion> -- <file> 可以查看特定文件在暂存区与指定版本之间的差异。
git diff 查看工作区和暂存区的差异  git diff HEAD 查看工作区和HEAD所指提交的差异
git diff --cached --staged 看到的是提交暂存区（提交任务，stage）和版本库中文件的差异
```
               $ git diff            (1)
               $ git diff --cached   (2)
               $ git diff HEAD       (3)

           1. Changes in the working tree not yet staged for the next commit.
           2. Changes between the index and your last commit; what you would
           be committing if you run "git commit" without "-a" option.
           3. Changes in the working tree since your last commit; what you
           would be committing if you run "git commit -a"

            Comparing with arbitrary commits

               $ git diff test            (1)
               $ git diff HEAD -- ./test  (2)
               $ git diff HEAD^ HEAD      (3)

           1. Instead of using the tip of the current branch, compare with the
           tip of "test" branch.
           2. Instead of comparing with the tip of "test" branch, compare with
           the tip of the current branch, but limit the comparison to the file
           "test".
           3. Compare the version before the last commit and the last commit.
```


## git status -s
git status -s 应该是查看暂存区和工作目录的差异 或 暂存区和版本库(具体某次提交)的差异文件
* [讲git 暂存区](http://www.worldhello.net/gotgit/02-git-solo/020-git-stage.html)

## reset checkout revert

* [代码回滚：Reset、Checkout、Revert 的选择](https://github.com/geeeeeeeeek/git-recipes/wiki/5.2-%E4%BB%A3%E7%A0%81%E5%9B%9E%E6%BB%9A%EF%BC%9AReset%E3%80%81Checkout%E3%80%81Revert-%E7%9A%84%E9%80%89%E6%8B%A9)

git checkout -b <branch name> <SHA1> 针对某次提交建立一个分支

git checkout --track origin/serverfix   == git checkout -b serverfix origin/serverfix

设置本地分支与远程分支的追踪：
git branch --set-upstream-to=origin/远程分支名 本地分支名
查看本地分支与远程分支的追踪:
git branch -vv 

## fetch 

git fetch <远程主机名> <分支名>


## 从远程仓库获取最新代码合并到本地分支 
[https://blog.csdn.net/hanchao5272/article/details/79162130]

```
/查询当前远程的版本
$ git remote -v
//获取最新代码到本地(本地当前分支为[branch]，获取的远端的分支为[origin/branch])
$ git fetch origin master  [示例1：获取远端的origin/master分支]
$ git fetch origin dev [示例2：获取远端的origin/dev分支]
//查看版本差异
$ git log -p master..origin/master [示例1：查看本地master与远端origin/master的版本差异]
$ git log -p dev..origin/dev   [示例2：查看本地dev与远端origin/dev的版本差异]
//合并最新代码到本地分支
$ git merge origin/master  [示例1：合并远端分支origin/master到当前分支]
$ git merge origin/dev [示例2：合并远端分支origin/dev到当前分支]
```

## git 查看远程分支提交信息，不合并

```
git branch -r
git fetch origin xxx
git checkout origin/xxx
git log
git show 807eb3e9f7296b6f7612e84fc991d47feee57140

```

## 

```
git log remotename/branchname

git log --name-status 每次修改的文件列表, 显示状态
git log --name-only 每次修改的文件列表
git log --stat 每次修改的文件列表, 及文件修改的统计
git whatchanged 每次修改的文件列表
git whatchanged --stat 每次修改的文件列表, 及文件修改的统计
git show 显示最后一次的文件改变的具体内容
git show -5 显示最后 5 次的文件改变的具体内容
git show commitid 显示某个 commitid 改变的具体内容
git show --name-only 只看某次提交修改的文件

```