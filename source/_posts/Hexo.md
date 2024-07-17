---
title: Hexo安装、配置与日常使用
abbrlink: e12db737
date: 2021-11-12 00:15:22
tags: hexo
---

本站建立记录

<!-- more -->

## 安装 install

### 环境 env

- Ubuntu20.04

### 预先准备 prerequisites

- git 

  ```shell
  sudo apt install git
  #git --version #查看安装版本
  git config --global user.name "Your Name"
  git config --global user.email "youremail@domain.com"
  #git config --global --list #查看全局设置
  ```

- github

  - 创建名为`$USER_NAME.github.io`的仓库，其中`$USER_NAME`为自己的GitHub用户名，GitHub会自动启用pages服务
  - 配置ssh_key

- Node.js [参考](https://developer.aliyun.com/article/760687)

  - snap安装nodejs版本较低，还需要再手动安装npm
  - 自定版本安装，官方NodeSource：[安装](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)

  ```shell
  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
  #node --version #查看安装版本 #高版本nodejs包含npm
  #npm --version
  #安装必要工具
  sudo apt install build-essential
  ```
  - 使用NVM(Node Version Manager)安装Node.js和npm

### 正式安装 install hexo

- 安装hexo命令接口

  ```shell
  sudo npm install hexo-cli -g
  ```

- 创建工作文件夹

  ```shell
  sudo mkdir xxx
  #进入文件夹
  cd xxx 
  ```

- Hexo本体安装

  ```shell
  hexo init
  #安装hexo以及node模块
  npm install
  #ls #查看标准文件
  ```

- next-theme主题安装 [github](https://github.com/next-theme/hexo-theme-next)

  __注意不要装成theme-next__ [ref](https://github.com/next-theme/hexo-theme-next/issues/4#issuecomment-626205848)

  ```shell
  npm install hexo-theme-next@latest
  #后续可以用npm更新主题版本
  ```

__至此主要组件安装完成__

```shell
#查看版本
hexo -v
INFO  Validating config
INFO  ==================================
  ███╗   ██╗███████╗██╗  ██╗████████╗
  ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝
  ██╔██╗ ██║█████╗   ╚███╔╝    ██║
  ██║╚██╗██║██╔══╝   ██╔██╗    ██║
  ██║ ╚████║███████╗██╔╝ ██╗   ██║
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝
========================================
NexT version 8.8.1
Documentation: https://theme-next.js.org
========================================
hexo: 5.4.0
hexo-cli: 4.3.0
os: linux 5.11.0-40-generic Ubuntu 20.04.3 LTS (Focal Fossa)
node: 16.13.0
v8: 9.4.146.19-node.13
uv: 1.42.0
zlib: 1.2.11
brotli: 1.0.9
ares: 1.17.2
modules: 93
nghttp2: 1.45.1
napi: 8
llhttp: 6.0.4
openssl: 1.1.1l+quic
cldr: 39.0
icu: 69.1
tz: 2021a
unicode: 13.0
ngtcp2: 0.1.0-DEV
nghttp3: 0.1.0-DEV
```



## 配置 config

想要发布主页到`github pages`以及设计出个性化的主页，需要：

- 对博客根目录下的`_config.yml`进行参数修改

- 利用hexo5.0以后的新特性对主题配置文件进行Alternate后再修改

  ```shell
  cp node_modules/hexo-theme-next/_config.yml _config.next.yml
  ```

- __注意冒号后要空格__

### Hexo本体配置 

`_config.yml` [官方文档](https://hexo.io/docs/configuration)

```yaml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site 博客基本信息
title: Hexo
subtitle: ''
description: ''
keywords:
author: John Doe
language: en #zh-CN
timezone: 'Asia/Shanghai'

# URL 网址设置
## Set your site url here. For example, if you use GitHub Page, set url as 'https://username.github.io/project'
url: http://example.com
permalink: :year/:month/:day/:title/ #文章永久链接
permalink_defaults:
pretty_urls:
  trailing_index: true # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: true # Set to false to remove trailing '.html' from permalinks

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link:
  enable: true # Open external links in new tab
  field: site # Apply to the whole site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  enable: false
  preprocess: true
  line_number: true
  tab_replace: ''

# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Metadata elements
## https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
meta_generator: true

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'mtime'

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

# Include / Exclude file(s)
## include:/exclude: options only apply to the 'source/' folder
include:
exclude:
ignore:

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: 'git'
  repo: git@github.com:xxx.git # 你的Github仓库地址
  branch: master
```

### NexT主题配置 

`_config.next.yml` [官方文档](https://theme-next.js.org/docs/theme-settings/)

```yaml
# ===============================================================
# It's recommended to use Alternate Theme Config to configure NexT
# Modifying this file may result in merge conflict
# See: https://theme-next.js.org/docs/getting-started/configuration
# ===============================================================

# ---------------------------------------------------------------
# Theme Core Configuration Settings
# See: https://theme-next.js.org/docs/theme-settings/
# ---------------------------------------------------------------

# Allow to cache content generation.
cache:
  enable: true

# Remove unnecessary files after hexo generate.
minify: true

# Define custom file paths.
# Create your custom files in site directory `source/_data` and uncomment needed files below.
custom_file_path:
  #head: source/_data/head.njk
  #header: source/_data/header.njk
  #sidebar: source/_data/sidebar.njk
  #postMeta: source/_data/post-meta.njk
  #postBodyEnd: source/_data/post-body-end.njk
  #footer: source/_data/footer.njk
  #bodyEnd: source/_data/body-end.njk
  #variable: source/_data/variables.styl
  #mixin: source/_data/mixins.styl
  #style: source/_data/styles.styl


# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# Schemes
#scheme: Muse
#scheme: Mist
#scheme: Pisces
scheme: Gemini

# Dark Mode
darkmode: false
...主题设置内容太多 具体可参考官网 https://theme-next.js.org/docs/theme-settings/
```

### 插件安装

//待续

- 搜索
- 

### 主页手动创建

```shell
hexo new page tags /about /categories
```

## 管理与日常使用

### 管理 

我们使用github.io仓库的master分支来存储hexo生成的静态页面文件，开一个名为hexo的分支来存放博客原始文件，方便在其他电脑上更新博客时git clone下来使用。

### 日常使用

- 更新博客

  - 安装git、node.js、hexo-cli
  - 下载github.io仓库的hexo分支
  - hexo new post ‘name’
  - hexo clean
  - hexo g -d

- 配置主页显示一篇文章的部分

  - 在想要断开的位置插入`<!--more-->`

- 更新配置与升级hexo

  - git push -f
  - npm update

  

