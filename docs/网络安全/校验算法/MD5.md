# MD5算法介绍

## 1 参考资料

[RFC1321](https://www.rfc-editor.org/rfc/rfc1321.html)

## 2 MD5算法的作用

> The algorithm takes as input a message of arbitrary length and produces as output a 128-bit "fingerprint" or "message digest" of the input

## 3 术语和符号

- word → 32个bit的数
- byte → 8个bit的数
- 一个比特串可以表示为一个字节序列，对于每个字节，最高阶的位在最左边
- 一个比特串可以表示为一个字序列，字采用小端的方式来读取
- `+` → 模 $2^{32}$ 加法
- `X <<<s` → 循环移位（`<<<` 表示循环左移）
- `not(X)` → X的反码
- `X v Y` → X按位或Y
- `X xor Y` → X按位异或Y
- `XY` → X按位与Y

## 4 算法流程

假设有b-bit长的message(记为M)（b大于等于0）

### 4.1 填充bit位

对message进行填充，使其位数模512后结果为448（就算message本身就达到了这个要求，也要进行填充，所以最少填充一个位，最多填充512位）。填充方法位：首先填一个bit位，其值为1，其余的bit位全部填0（如果有的话）

### 4.2 填充message的长度信息

再填充一个64位的比特串，这个比特串表示原始message的位数（如果 $b > 2^{64}$，则填充b的低64位）

### 4.3 初始化MD缓冲区

四个字的缓冲区（A, B, C, D）被用来计算消息摘要。A、B、C、D是四个32位的寄存器，它们的初始值为：

```
word A: 01 23 45 67
word B: 89 ab cd ef
word C: fe dc ba 98
word D: 76 54 32 10
```

### 4.4 以16个字的块为单位处理message

首先定义四个辅助函数，它们的输入是三个字，输出是一个字

```
F(X, Y, Z) = XY v not(X) Z
G(X, Y, Z) = XZ v Y not(Z)
H(X, Y, Z) = X xor Y xor Z
I(X, Y, Z) = Y xor (X v not(Z))
```

这个阶段使用了一个含有六十四个元素的表 $T[1 ... 64]$，它是由正弦函数构造的，即： $T[i]=4294967296 \times |{\sin(i)}|$，其中，$i$ 的单位是弧度。

然后，进行以下操作：

```
/* Process each 16-word block. */
For i = 0 to N/16-1 do
  /* Copy block i into X. */
  For j = 0 to 15 do 
    Set X[j] to M[i*16+j].
  end /* of loop on j */

/* Save A as AA, B as BB, C as CC, and D as DD. */
  AA = A
  BB = B
  CC = C
  DD = D
  
/* Round 1. */
/* Let [abcd k s i] denote the operation
    a = b + ((a + F(b,c,d) + X[k] + T[i]) <<< s). */
/* Do the following 16 operations. */
  [ABCD  0 7  1] [DABC  1 12  2] [CDAB  2 17  3] [BCDA  3 22  4]
  [ABCD  4 7  5] [DABC  5 12  6] [CDAB  6 17  7] [BCDA  7 22  8]
  [ABCD  8 7  9] [DABC  9 12 10] [CDAB 10 17 11] [BCDA 11 22 12]
  [ABCD 12 7 13] [DABC 13 12 14] [CDAB 14 17 15] [BCDA 15 22 16]
/* Round 2. */
/* Let [abcd k s i] denote the operation
    a = b + ((a + G(b,c,d) + X[k] + T[i]) <<< s). */
/* Do the following 16 operations. */
  [ABCD  1 5 17] [DABC  6 9 18] [CDAB 11 14 19] [BCDA  0 20 20]
  [ABCD  5 5 21] [DABC 10 9 22] [CDAB 15 14 23] [BCDA  4 20 24]
  [ABCD  9 5 25] [DABC 14 9 26] [CDAB  3 14 27] [BCDA  8 20 28]
  [ABCD 13 5 29] [DABC  2 9 30] [CDAB  7 14 31] [BCDA 12 20 32]

/* Round 3. */
/* Let [abcd k s t] denote the operation
    a = b + ((a + H(b,c,d) + X[k] + T[i]) <<< s). */
/* Do the following 16 operations. */
  [ABCD  5 4 33] [DABC  8 11 34] [CDAB 11 16 35] [BCDA 14 23 36]
  [ABCD  1 4 37] [DABC  4 11 38] [CDAB  7 16 39] [BCDA 10 23 40]
  [ABCD 13 4 41] [DABC  0 11 42] [CDAB  3 16 43] [BCDA  6 23 44]
  [ABCD  9 4 45] [DABC 12 11 46] [CDAB 15 16 47] [BCDA  2 23 48]

/* Round 4. */
/* Let [abcd k s t] denote the operation
    a = b + ((a + I(b,c,d) + X[k] + T[i]) <<< s). */
/* Do the following 16 operations. */
  [ABCD  0 6 49] [DABC  7 10 50] [CDAB 14 15 51] [BCDA  5 21 52]
  [ABCD 12 6 53] [DABC  3 10 54] [CDAB 10 15 55] [BCDA  1 21 56]
  [ABCD  8 6 57] [DABC 15 10 58] [CDAB  6 15 59] [BCDA 13 21 60]
  [ABCD  4 6 61] [DABC 11 10 62] [CDAB  2 15 63] [BCDA  9 21 64]

/* Then perform the following additions. (That is increment each
    of the four registers by the value it had before this block
    was started.) */
  A = A + AA
  B = B + BB
  C = C + CC
  D = D + DD
end /* of loop on i */
```

### 4.5 输出结果

将A，B，C，D拼接起来（从A开始），这就是最终结果了（128个bit）

## 5 MD5是否安全

MD5（Message-Digest Algorithm 5）已经不被视为安全的加密散列函数，尤其在需要高安全性保障的领域。自2000年代以来，研究人员已经发现了多种方法来生成不同输入具有相同的MD5哈希值，即碰撞攻击。这使得MD5在数字签名、证书及其他需要确保数据完整性和真实性的应用中不再可靠
