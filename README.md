# Matrix Distances Finder

Purpose of this app is to find distances to 1s in binary matrices supplied from the input stream.

For a matrix:
```shell
0 0 0 1
0 0 1 1
0 1 1 0
```
It will calculate distances to nearest 1s as follows:
```shell
3 2 1 0
2 1 0 0
1 0 0 1
```

# Getting started

```shell
npm i
npm start
```

# Input format

App reads input from standard input (stdin) in the following format:
```shell
3 # number of test cases
4 4 # space separated dimensions: rows columns
0011 # row with columns, no spaces
1000 # row with columns, no spaces
1010 # row with columns, no spaces
0101 # row with columns, no spaces
# new line in between test cases
2 3 # space separated dimensions: rows columns
010 # row with columns, no spaces
101 # row with columns, no spaces
# new line in between test cases
4 4 # space separated dimensions: rows columns
1100 # row with columns, no spaces
0011 # row with columns, no spaces
1100 # row with columns, no spaces
0011 # row with columns, no spaces
```

There are limits set for the input data:
- Max number of test cases: 1000
- Max dimensions of the matrix: 182x182

# Output format

For the correct input, app will give output in the following format:
```shell
// TODO
```
