# Git

- [Git](#git)
  - [Git aliases](#git-aliases)
  - [Initialize Git](#initialize-git)
  - [`add` and `commit`](#add-and-commit)
  - [`status` and `log`](#status-and-log)
  - [`checkout`](#checkout)
  - [`tag`](#tag)
  - [`restore`](#restore)
    - [Revert staging (adding)](#revert-staging-adding)
    - [Revert unstaged changes](#revert-unstaged-changes)
    - [Revert staged changes](#revert-staged-changes)
  - [Cancel or change commit](#cancel-or-change-commit)
    - [Creating a new commit with cancelled changes](#creating-a-new-commit-with-cancelled-changes)
    - [`reset`](#reset)
  - [`.git`](#git-1)
    - [`config`](#config)
    - [`HEAD`](#head)
  - [`branch`](#branch)
  - [`merge` and `rebase`](#merge-and-rebase)
  - [`clone`](#clone)
  - [`fetch`](#fetch)
    - [`branch --track`](#branch---track)
  - [`pull`](#pull)
  - [Bare repo](#bare-repo)
    - [`remote`](#remote)

***



## Git aliases

Shortcuts to the git commands, add to the bottom of `~/.bashrc`:

```bash
alias gs='git status '
alias ga='git add '
alias gb='git branch '
alias gc='git commit'
alias gd='git diff'
alias gco='git checkout '
alias gsw='git switch '
alias gf='git fetch '
alias gp='git push '
alias gl='git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short'
```

***



## Initialize Git

```bash
git init
```

During the first git usage on your machine, you'll have to enter your name nad email that will be used for signing your commits.

On the first commit, you'll be prompted to give your credentials:

```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```

On **Manjaro**, configs are located in `~/.gitconfig`.

You can check your current settings: 

```bash
git config --list
git config user.name
```

***



## `add` and `commit`

Prepare the files you want to save in Git:

```bash
git add file1 file2 file3

# all content in the current directory
git add .       # including hidden files
gid add *       # ecsluding hidden files
```

Then commit your tracked adding message describing the changes in short manner:

```bash
git commit -m 'added table on contents'
```

**Modify** the commit:

```bash
git commit --amend -m 'changed something'
```

***



## `status` and `log`

`git status` shows the changes in the current folder: 

- untracked files 
- added (and awaiting for commit) files
- deleted etc.

`git log` shows the list of commits with their hashes for which they can be distinguished.

***



## `checkout`

Reverses the files in the working tree to match the version committed before. 

```bash
# by hash
git checkout <hash>

# by tag
git checkout <tag>

# return to a branch
git checkout <branch>
```

Thus, you find the hash you need, copy it (a part of it is enough) and `checkout` to it:

```bash
git log
git checkout cfbbf9a
```

If now you `git log` now, you'll see the last commit to be the one you jumped to. To **jump back** to your real last commit (for the **master** branch), do

```bash
git checkout master
```

***

Also, you can use `^` to switch to the previous commit:

```bash
# previous to hash
git checkout <hash>^

# previous to tag
git checkout <tag>^
```

***



## `tag`

We can **tag** our commits to easily return to them later.

```bash
# Add tag
git tag <tag>

# Delete tag
git tag -d <tag>

# Delete on a remote
git push origin --delete <tag>

# List of tags
git tag
```

So we check that the `HEAD` is where we want and **tag** it:

```bash
git log
git tag v1.0
```

***




## `restore`

### Revert staging (adding)

You added files for the upcoming commit and then changed you mind: you want to **revert adding** some of them:

```bash
git restore --staged script.js
git restore -S script.js
```

You **did not** change the files, just removed their addition. 

***


### Revert unstaged changes

You want to **revert changes** to a **file** to last committed version:

```bash
git restore --worktree script.js
git restore -W script.js
```

You **changed** the files but **did not** remove their addition - the version staged earlier is still in the memory of Git and can still be committed. 

***


### Revert staged changes

You want to revert both **staging** and the **changes** to the last committed state:

```bash
git restore --staged --worktree script.js
git restore -SW script.js
```

***



## Cancel or change commit

### Creating a new commit with cancelled changes

Safe option. This changes files. The cancelled commit will **still be** in the log though.

```bash
git revert HEAD
```

You can leave the default message.

***


### `reset`

Unsafe option. Changes files to the selected version and removes commits. If we tagged our removed commits earlier, we can still refer to them by their tags though.

```bash
# reset to hash
git reset --hard <hash>

# reset to tag
git reset --hard <tag>
```

***



## `.git` 

The git working directory. 

### `config`

Configuration file. Content from here overrides the settings stored in `~/.gitconfig`. 

### `HEAD`

HEAD is a reference to the current commit (latest) on the current branch. There can only be a single HEAD at any given time (excluding git worktree).

If you are not on the latest commit - meaning that HEAD is pointing to a prior commit in history it's called **detached HEAD**.



***



## `branch`

```bash
# create new branch and switch to it
git switch -c style
# or the old way    git checkout -b style
```

***



## `merge` and `rebase`

Merge different branches into one. 

```bash
# switch to the `style` branch
git switch style

# merge `master` into the current branch
git merge master
```

You may incounter conflicts (if some parts of the two branches overlap). To resolve them, you should **manually remove/fix** conflicting parts to the state you find appropriate and then **make a commit**. 

Eventually we would want to merge our changes from the other branches back into **master**:
```
git switch master
git merge style
``` 

If the last **master** commit directly **precedes** the last commit of the **style** branch, git can merge **fast-forward** by simply moving the branch pointer forward, pointing to the same commit as the style branch.

![](img/2020-08-18-20-25-28.png)

***

`rebase` makes similar merging but rewrites the commit tree to include the commits from the merged branch. This makes the chain of commits linear and more readable: “I want to base my changes on what everybody has already done.”

`rebase` in standard mode will automatically take the commits in your current working branch and apply them **to the head of the passed branch**.

```bash
# switch to the `feature` branch
git switch feature

# merge `master` into it
git rebase master
```

![](img/2020-08-18-15-08-16.png)

**Don't use** `rebase` if:

* the branch is public and ahsred (you'll rewtire the other's work)
* the exact commit history is important (bc it rewrites the history of commits)

So basically you can use `rebase` for your local branches and then `merge` the changes into public repos. 

***



## `clone`

Cloning the repo along with all its commits

```bash
git clone project clone_project
```

You'll have new branches in the clones repo: **origin/master**, **origin/HEAD** and similar for the other branches if you had them.

![](img/2020-08-18-22-19-39.png)

You can see that the **origin** of the remote repo is the original **project** repo.

For now, **master** is the only local branch we have:

![](img/2020-08-18-22-22-41.png)

***



## `fetch`

Fetches changes from the remote but **not merges** them into the local branches. Calling fetch is **always safe**. It does not overwrite anything by itself! 

![](img/2020-08-19-16-00-48.png)

After fetching we usually want to **merge** the fetched changes into the local `master` branch.

```bash
git merge origin/master
```

***


### `branch --track`

Make local branch track the remote one.

```bash
git branch --track style origin/style
```

![](img/2020-08-19-16-35-30.png)

![](img/2020-08-19-16-37-23.png)

***



## `pull`

```bash
# this
git pull origin master

# is the full equivalent of 
git fetch origin
git merge master
```

***



## Bare repo

Repos without working directory (means there is actually only the `.git` directory of the usual repo). Usually created for sharing. 

```bash
# from the working directory outside of `project`
git clone project project.git
```

***



### `remote`

Remote is just "another repository". It can be on a server or on a local machine.

```bash
# from the `project` repo
git remote add shared ../project.git

# change URL
git remote set-url shared new_address
```




