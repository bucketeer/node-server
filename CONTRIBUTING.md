# How to Contribute

### Step 1: Fork  

Fork the project [on GitHub](https://github.com/username/repo) and check out your
copy locally.  

```text
$ git clone git@github.com:username/repo.git
$ cd repo
$ git remote add upstream git://github.com/username/repo.git
```  

### Step 2: Branch  

```text
$ git checkout -b my-branch -t origin/master
```  

### Step 3: Commit  

```text
$ git add my/changed/files
$ git commit
```  

### Step 4: Rebase  

```text
$ git fetch upstream
$ git rebase upstream/master
```  

### Step 5: Test  

```text
$ npm test
```  

### Step 6: Push  

```text
$ git push origin my-branch
```  


### Step 7: Open Pull Request  

Go to https://github.com/yourusername/repo and select your branch.
Click the 'Pull Request' button and fill out the form. Thats It! 
Someone will then review your request within a few days.