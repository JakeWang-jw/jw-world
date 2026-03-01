# RSA加密算法

## 1 名称来源

以它的发明者命名：**Ron Rivest**, **Adi Shamir**, **Leonard Adleman**

## 2 产生公钥和私钥的流程

**第一步**

选择两个非常大的质数：$p$ 和 $q$。数越大，RSA越难被破解，编码和解码的时间越长。RSA laboratories推荐的p和q所占的位数为1024位

**第二步**

计算 $n = pq$ 和 $z = (p-1)(q-1)$

**第三步**

选择一个小于 $n$ 的数 $e$，它和 $z$ 除了1以外没有其它的公因子（即 $e$ 和 $z$ 是互质的）

**第四步**

选择一个数 $d$，使得 $ed - 1$ 可以被 $z$ 整除，即 $ed\ mod\ z = 1$

**第五步**

公钥 $K_B^+$​​ 即为数对 $(n, e)$，私钥 $K_B^-$ ​​即为数对 $(n, d)$

## 3 加密流程

假设 $A$ 想要发送一个以整数 $m$ ($m<n$，非常长的字符串可以分开加密) 表示的位串 $B$。$A$ 首先计算 $m^e$​​，然后计算 $m^e\ mod\ n$，令 $c=m^e\ mod\ n$，则 $c$ 就是发送给 $B$ 的密文

## 4 解密流程

对于密文 $c$，$B$ 计算 $m = c^d\ mod\ n$，则 $m$ 就是解密过后的明文

## 5 数学理论支撑

首先，有如下几个性质：
$$
\begin{align}
[(a\ mod\ n)+(b\ mod\ n)]\ mod\ n=(a+b)\ mod \ n \\
[(a\ mod\ n)-(b\ mod\ n)]\ mod\ n=(a-b)\ mod\ n \\
[(a\ mod\ n)\cdot(b\ mod\ n)]\ mod\ n=(a\cdot b)\ mod\ n
\end{align}
$$
所以
$$
\begin{align}
(a\ mod\ n)^d\ mod\ n &=((a\ mod\ n)\ mod\ n)^d\ (性质(3)) \\
                      &=((a\ mod\ n - 0\ mod\ n)\ mod\ n)^d\ (性质(2))\\
                      &=(a\ mod\ n)^d\ (性质(3))\\ &=a^d\ mod\ n
\end{align}
$$
所以对于上述 $m$，
$$
m=c^d\bmod n=(m^e\bmod n)^d\bmod n=m^{ed}\bmod n
$$
数论中有一个定理

如果 $p$ 和 $q$ 是互质的，$n=pq,z=(p-1)(q-1)$，则$\ x^y\ mod\ n=x^{(y\ mod\ z)}\ mod\ n$

由于之前选取了 $ed\ mod\ z=1$，所以
$$
m^{ed}\ mod\ n=m^1\ mod\ n=m
$$

## 6 RSA为什么是安全的

目前没有已知的可以把 $n$ 快速分解为两个质数 $p$ 和 $q$ 的算法

## 7 使用示例

```bash
jw@jwdesktop [17:42:13] [~/test/openssl_rsa_test] 
-> % openssl genrsa -out mykey.pem 2048          

jw@jwdesktop [17:42:30] [~/test/openssl_rsa_test] 
-> % openssl rsa -in mykey.pem -pubout -out mypubkey.pem
writing RSA key

jw@jwdesktop [17:42:55] [~/test/openssl_rsa_test] 
-> % openssl rsa -in mykey.pem -check -nout             
rsa: Unknown cipher: nout
rsa: Use -help for summary.

jw@jwdesktop [17:43:17] [~/test/openssl_rsa_test] 
-> % openssl rsa -in mykey.pem -check -noout
RSA key ok

jw@jwdesktop [17:43:23] [~/test/openssl_rsa_test] 
-> % openssl rsa -pubin -in mypubkey.pem -text
Public-Key: (2048 bit)
Modulus:
    00:b9:2c:0b:c2:9c:19:93:1e:eb:20:08:02:dd:48:
    b7:9c:65:78:dd:3b:28:b3:6b:ad:35:22:e5:7e:c1:
    64:4a:1f:b5:dd:31:c2:fe:7c:c6:0c:6a:a6:36:41:
    41:44:1c:4b:8a:ad:fe:23:e2:e1:c8:07:27:40:48:
    e7:db:0d:68:7c:c6:99:f8:9a:e1:18:43:11:d2:bf:
    ce:b1:8a:c7:4d:f8:70:d6:b5:86:9c:90:7e:5e:ae:
    22:9b:74:fb:21:c8:0b:65:fc:ab:e1:ce:d0:ac:39:
    64:5d:42:bb:b8:f1:03:d3:28:0f:ad:c7:55:b2:91:
    24:0f:d8:49:1c:c0:a0:fe:c0:3c:9a:c4:d2:55:69:
    e7:8f:1a:53:d2:d2:6c:e0:82:8a:01:78:82:bb:29:
    88:5c:9c:68:41:a2:92:b2:0e:3c:eb:14:73:31:25:
    c9:29:fb:c8:a4:84:54:25:db:9e:f7:d1:1c:32:f5:
    c1:03:f8:21:8a:4d:df:fb:4f:21:9b:96:38:58:6b:
    56:01:e1:da:1e:5a:3c:33:ad:94:38:ff:1b:4f:0b:
    19:31:06:a5:1d:89:21:9c:57:5b:db:01:36:d2:22:
    aa:17:ac:ea:4a:8a:49:20:48:b6:06:d8:89:84:41:
    3c:09:32:7b:16:7f:7b:50:7a:e4:bb:87:5f:1e:36:
    83:13
Exponent: 65537 (0x10001)
writing RSA key
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuSwLwpwZkx7rIAgC3Ui3
nGV43Tsos2utNSLlfsFkSh+13THC/nzGDGqmNkFBRBxLiq3+I+LhyAcnQEjn2w1o
fMaZ+JrhGEMR0r/OsYrHTfhw1rWGnJB+Xq4im3T7IcgLZfyr4c7QrDlkXUK7uPED
0ygPrcdVspEkD9hJHMCg/sA8msTSVWnnjxpT0tJs4IKKAXiCuymIXJxoQaKSsg48
6xRzMSXJKfvIpIRUJdue99EcMvXBA/ghik3f+08hm5Y4WGtWAeHaHlo8M62UOP8b
TwsZMQalHYkhnFdb2wE20iKqF6zqSopJIEi2BtiJhEE8CTJ7Fn97UHrku4dfHjaD
EwIDAQAB
-----END PUBLIC KEY-----

jw@jwdesktop [17:43:36] [~/test/openssl_rsa_test] 
-> % echo "hello" >> plain.txt

jw@jwdesktop [17:44:07] [~/test/openssl_rsa_test] 
-> % openssl pkeyutl -encrypt -inkey mykey.pem -in plain.txt -out cipher.txt
jw@jwdesktop [17:44:49] [~/test/openssl_rsa_test] 

-> % openssl pkeyutl -decrypt -inkey mykey.pem -in cipher.txt
hello
```