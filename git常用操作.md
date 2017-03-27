# git常用bash操作


## 上传到远程服务器

1. git add .
2. git commit -m "【此处为注释】"  
3. git push origin master 【master分支】


## 从远程的分支获取最新的版本到本地

【temp为临时分支】

```bash
$ git fetch origin master:temp 
```

```bash
$ git diff temp
```

```bash
$ git merge temp
```

## 删除某个分支

【以temp分支为例】

```bash
$ git branch -d temp 
```


## 放弃本地所有未提交修改 

```bash
$ git checkout .
```

## 获取远程所有分支，并强制指向 master

```bash
$ git fetch --all
```

```bash
$ git reset --hard origin/master
```


## 代码回滚到任意版本

```bash
$ git log -3
```

【该分支从log日志中查询所得】

```bash
$ git reset --hard e377f60e28c8b84158 
```

【强制提交】

```bash
$ git push -f origin master 
```

## 为分支打tag

### 列出标签

【在控制台打印出当前仓库的所有标签】

```bash
$ Git tag 
```

【搜索符合模式的标签】

```bash
$ git tag -l "v0.1.*" 
```

### 创建附注标签

```bash
git tag -a v0.1.2 -m "0.1.2版本"
```

### 提交标签到github

```bash
git push origin v0.1.2
```

### 切换到标签

```bash
git checkout [tagname]
```

### 查看标签信息

```bash
git show [tagname]
```