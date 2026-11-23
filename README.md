# 文件鸽 Lite · Chrome / Edge 下载文件自动重命名扩展

从技术资料库下载设备维护手册，网站给的文件名却是 `880013.pdf`。文件鸽 Lite 会在保存时，用网页标题和站点名把它改成 `设备维护手册_技术资料库.pdf`。下次找文件，直接搜「设备维护」就行。基础命名在本机运行，安装后无需配置。

> **[在 Chrome 应用商店安装文件鸽完整版](https://chromewebstore.google.com/detail/pigeonhole/ikjdcjgnlbealhahlogjidahhhlbcdhp?hl=zh-CN)**
>
> 想把下载自动放进不同的项目文件夹？完整版支持按自定义规则、浏览器标签组或 AI 建议归档，也能从最近记录更换文件夹。内置 AI 无需自备 API Key。

## 按网页标题重命名 PDF、附件和图片

Lite 用本地正则识别通用文件名、纯数字、UUID、相机或聊天软件生成的流水号。有明确名称的文件保留原名。下面是关闭 AI 时的下载结果。

| 下载原名 | 来源网页标题 | 保存后的文件名 |
| --- | --- | --- |
| `880013.pdf` | 设备维护手册 - 技术资料库 | `设备维护手册_技术资料库.pdf` |
| `附件1 (2).docx` | 实习申请表 \| 学生事务中心 | `实习申请表_学生事务中心.docx` |
| `IMG_0012.jpg` | 春季花展 — 城市植物园 | `春季花展_城市植物园.jpg` |
| `采购清单.xlsx` | 采购资料下载 | `采购清单.xlsx` |

命名时保留原文件后缀。遇到同名文件，浏览器会自动编号。如果下载只提供了来源域名，或 Lite 无法确认来源标签页，就沿用浏览器给出的文件名。规则只在新下载发生时运行。

## 在 Chrome 或 Edge 安装 Lite

1. 在仓库首页选择 **Code → Download ZIP** 并解压，或把仓库克隆到本机。
2. 在 Chrome 打开 `chrome://extensions`，在 Edge 打开 `edge://extensions`，开启「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择仓库中的 `extension` 目录。Lite 可以直接加载，无需构建。

## 用自己的 API Key 启用 AI 文件命名

如果希望 AI 根据网页标题和原文件名建议一个短名称，点击工具栏里的文件鸽图标，填入自己的 API Key 并保存。默认使用 OpenAI 接口。接入其他兼容服务时，在「高级配置」填写该服务的 HTTPS 地址和模型名，然后按浏览器提示授权。

只有文件名命中本地规则、能确认来源页面，且已配置密钥和服务权限时，Lite 才会向所选模型发送原文件名和网页标题。文件内容和网页正文都不会发送。服务超时或出错时继续使用本地命名，无痕下载也只使用本地规则。

密钥保存在当前浏览器配置的扩展本地存储中。在设置页点击「清除密钥并停用 AI」即可恢复纯本地命名。

## English quick start

Pigeonhole Lite is a Chrome and Edge extension that automatically renames downloads using the source page title. To install it, enable Developer mode on your browser’s extensions page and load the `extension` folder as an unpacked extension. Local naming works immediately. For AI-assisted file naming, add your own API key for an OpenAI-compatible service.

## 验证

在仓库根目录使用 Node.js 22 或更新版本运行 `node --test`。

## 使用许可

源码公开。你可以非商业自用、修改，也可以免费分发原版或修改版。分发时须保留许可全文和项目署名。商业用途须另行取得书面授权。[完整许可](LICENSE)
