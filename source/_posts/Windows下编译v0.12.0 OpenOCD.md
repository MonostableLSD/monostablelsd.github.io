---
title: Windows下编译v0.12.0 OpenOCD
categories:
  - 嵌入式
tags:
  - openocd
  - windows
mathjax: true
date: 2024-08-09 15:01:42
updated: 2024-08-09 15:01:42
---
# 安装Msys2+工具链
https://www.msys2.org/ 下载安装包并安装 一路next即可 注意打开 Mingw64这个shell
![](Windows下编译v0.12.0%20OpenOCD/image-20240809150331331.png)
```
pacman -Syu
pacman -S libtool autoconf automake texinfo pkg-config make autogen git unzip bzip2 base-devel 
```
64bit:
```
pacman -S mingw-w64-x86_64-toolchain mingw-w64-x86_64-libusb mingw-w64-x86_64-libusb-compat-git mingw-w64-x86_64-hidapi mingw-w64-x86_64-libftdi mingw-w64-x86_64-capstone
```
32bit:
```
pacman -S mingw-w64-i686-toolchain mingw-w64-i686-libusb mingw-w64-i686-libusb-compat-git mingw-w64-i686-hidapi mingw-w64-i686-libftdi mingw-w64-i686-capstone
```
# 下载openocd源码
直接git一把梭
```
git clone --recurse-submodules git@github.com:openocd-org/openocd.git
```
# 生成 makefile
```
cd xxx #进openocd根目录
./bootstrap #生成configure文件
# 可以选择mkdir一个build文件夹cd进去编译
./configure --enable-cmsis-dap 
#如果在build文件夹则 ../configure --enable-cmsis-dap
#--disable-doxygen-pdf --enable-ft232r --build=x86_64-w64-mingw32 --host=x86_64-w64-mingw32
```
具体的config配置选项可以通过 `./configure --help`查看，有些情况需要交叉编译则需要在这里指定--host与--build，我们这个情况不需要指定，有些教程还需要手动下载libusb再想办法链接进去，咱们这个都不需要，上面pacman已经装了libusb工具了  
--enable-cmsis-dap因为我需要用基于hid 的cmsis dap所以我只开启了这个，还可以disable掉其他不需要的以提高编译速度  
TIPS: 如果你用公司加密电脑，很有可能这一步不过编译器检查，我发现这一步会生成一个conftest.c并尝试编译它来验证编译器是否ok，但是这个生成的会被加密软件加锁，导致链接失败，具体根因不确定是不是这个，反正我公司电脑这一步怎么都过不了，但是家里的电脑一次就成功了
# 编译

```
make
```

直接make一把梭，电脑cpu好的可以-j核心数，openocd比较大，要编一会

```
make install
```

生成exe文件 打包 写一个packer.sh，用msys2 shell执行，如果提示缺zip则可以pacman -S装一个

```
#! /bin/bash

OBJ_DIR=openocd-0.12.0-rc

rm -rf ${OBJ_DIR}
mkdir ${OBJ_DIR}
mkdir ${OBJ_DIR}/bin
mkdir ${OBJ_DIR}/share

# 复制主程序
cp /mingw64/bin/openocd.exe     ${OBJ_DIR}/bin/
# 复制一些依赖 DLL 文件
cp /mingw64/bin/libcapstone.dll ${OBJ_DIR}/bin/
cp /mingw64/bin/libftdi1.dll    ${OBJ_DIR}/bin/
cp /mingw64/bin/libhidapi-0.dll ${OBJ_DIR}/bin/
cp /mingw64/bin/libusb-1.0.dll  ${OBJ_DIR}/bin/

# 复制配置文件
cp /mingw64/share/openocd       ${OBJ_DIR}/share/  -r
# 打 zip 包
zip -r ${OBJ_DIR}.zip           ${OBJ_DIR}/
```

# 在windows cmd中启动openocd

写一个启动脚本： run.bat

```sh
openocd.exe -f pw.cfg -d4  # -f 配置文件 -d4 开启4级log输出 正常使用可以删掉
pause
```

用于验证paris jtag的cfg文件参考： pw.cfg

```
adapter driver cmsis-dap
transport select jtag

adapter speed 1000

set _CHINPNAME custom

jtag newtap custom tap -irlen 8  -expected-id 0x00000000

init

# idcode命令
irscan custom.tap 0xFE
drscan custom.tap 32 0x00000000 

# bypass命令
irscan custom.tap 0xFF
drscan custom.tap 32 0x55555555
drscan custom.tap 32 0xAAAAAAAA
drscan custom.tap 32 0x55555555

# 选通jtag2apb 向0x00600028写入0x55bbcc11
irscan custom.tap 0x00
drscan custom.tap 8 0xF0
drscan custom.tap 40 0x0000600028 
drscan custom.tap 32 0x55bbcc11
drscan custom.tap 35 0x0 #respond

# 选通jtag2apb 从0x00600028读取
irscan custom.tap 0x00
drscan custom.tap 8 0xF1
drscan custom.tap 40 0x0000600028 
drscan custom.tap 35 0x0 #respond
```
# telnet连接OpenOCD命令行

openocd启动后会本地起一个localhost：4444端口的telnet server，可以通过windows自带的telnet连接进去以实时输入openocd命令

前提是打开windows的telnet客户端功能：
![](Windows下编译v0.12.0%20OpenOCD/image-20240809151048958.png)

直接win+r cmd启动！
```
telnet localhost 4444
```
连接成功即可愉快操作openocd