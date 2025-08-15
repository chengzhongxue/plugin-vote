# Plugin Vote

一个用于创建和管理投票的 Halo 插件。

## 📃文档
https://docs.kunkunyu.com/docs/vote

## 交流群
* 添加企业微信 （备注进群）
  <img width="360" src="https://api.minio.yyds.pink/kunkunyu/files/2025/02/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250212142105-pbceif.jpg" />

* QQ群
  <img width="360" src="https://api.minio.yyds.pink/kunkunyu/files/2025/05/qq-708998089-iqowsh.webp" />

## 主题适配

### CSS 变量

以下 CSS 变量可用于自定义投票块和模态框的外观。显示的是默认浅色模式的值；深色模式的值会根据用户偏好或 `data-color-scheme` 属性自动应用。

| 变量名                                  | 描述                                         |
| ----------------------------------------- | ---------------------------------------------- |
| `--vote-text-title-color`                 | 主要标题的颜色                               |
| `--vote-text-description-color`           | 描述性文本和标签的颜色                       |
| `--vote-text-selected-color`              | 已选择（但未提交）选项的文本颜色             |
| `--vote-text-voted-color`                 | 已提交/已投票选项的文本颜色                  |
| `--vote-text-error-color`                 | 错误消息的文本颜色                           |
| `--vote-text-button-color`                | 提交按钮的文本颜色                           |
| `--vote-icon-color`                       | 图标的颜色（例如，统计图标）                 |
| `--vote-background-primary-color`         | 主要背景色（例如，卡片背景）                 |
| `--vote-background-secondary-color`       | 次要背景色（例如，默认选项背景）             |
| `--vote-background-tertiary-color`        | 第三背景色（例如，选项悬停时）               |
| `--vote-background-selected-color`        | 已选择选项的背景色                           |
| `--vote-background-voted-color`           | 已投票选项的背景色                           |
| `--vote-background-progress-color`        | 进度条的背景色（默认）                       |
| `--vote-background-progress-voted-color`  | 进度条的背景色（已投票）                     |
| `--vote-background-button-color`          | 提交按钮的背景色                             |
| `--vote-background-button-hover-color`    | 提交按钮悬停时的背景色                       |
| `--vote-background-tag-color`             | 信息标签的背景色                             |
| `--vote-background-voted-tag-color`       | "已投票"标签的背景色                         |
| `--vote-border-color`                     | 默认边框颜色                                 |
| `--vote-border-selected-color`            | 已选择选项的边框颜色                         |
| `--vote-border-voted-color`               | 已投票选项的边框颜色                         |
| `--vote-pk-option1-bg`                    | PK模式中第一个选项的背景色                   |
| `--vote-pk-option2-bg`                    | PK模式中第二个选项的背景色                   |
| `--vote-pk-progress-text-color`           | PK进度条上的文本颜色                         |
| `--vote-shadow`                           | 主容器的盒阴影                               |


### 配色切换方案

根据上面提供的 CSS 变量，也可以通过定义 CSS 变量的方式为投票提供动态切换配色的功能。
以下是实现示例，你可以根据需求自行修改选择器或者媒体查询。

``` css

@media (prefers-color-scheme: dark) {
  .color-scheme-auto,
  [data-color-scheme='auto'] friends-rss {
    color-scheme: dark;
    /* Text */
    --vote-text-title-color: #f3f4f6;
    --vote-text-description-color: #9ca3af;
    --vote-text-selected-color: #d1fae5;
    --vote-text-voted-color: #bfdbfe;
    --vote-text-error-color: #fca5a5;
    --vote-text-button-color: #dbeafe;
    --vote-icon-color: #9ca3af;

    /* Background */
    --vote-background-primary-color: #1f2937;
    --vote-background-secondary-color: #374151;
    --vote-background-tertiary-color: #4b5563;
    --vote-background-selected-color: #065f46;
    --vote-background-voted-color: #1e40af;
    --vote-background-progress-color: rgba(75, 85, 99, 0.6);
    --vote-background-progress-voted-color: rgba(59, 130, 246, 0.4);
    --vote-background-button-color: #2563eb;
    --vote-background-button-hover-color: #1d4ed8;
    --vote-background-tag-color: #374151;
    --vote-background-voted-tag-color: #1e3a8a;

    /* Border */
    --vote-border-color: #4b5563;
    --vote-border-selected-color: #10b981;
    --vote-border-voted-color: #2563eb;

    /* Shadow */
    --vote-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2);

    /* PK Progress Bar */
    --vote-pk-option1-bg: #3b82f6;
    --vote-pk-option2-bg: #f97316;
    --vote-pk-progress-text-color: #ffffff;
  }
}

.color-scheme-dark,
.dark,
[data-color-scheme='dark'] friends-rss {
    color-scheme: dark;
    /* Text */
    --vote-text-title-color: #f3f4f6;
    --vote-text-description-color: #9ca3af;
    --vote-text-selected-color: #d1fae5;
    --vote-text-voted-color: #bfdbfe;
    --vote-text-error-color: #fca5a5; 
    --vote-text-button-color: #dbeafe;
    --vote-icon-color: #9ca3af;

    /* Background */
    --vote-background-primary-color: #1f2937;
    --vote-background-secondary-color: #374151; 
    --vote-background-tertiary-color: #4b5563;
    --vote-background-selected-color: #065f46; 
    --vote-background-voted-color: #1e40af; 
    --vote-background-progress-color: rgba(75, 85, 99, 0.6);
    --vote-background-progress-voted-color: rgba(59, 130, 246, 0.4); 
    --vote-background-button-color: #2563eb;
    --vote-background-button-hover-color: #1d4ed8;
    --vote-background-tag-color: #374151;
    --vote-background-voted-tag-color: #1e3a8a;

    /* Border */
    --vote-border-color: #4b5563;
    --vote-border-selected-color: #10b981;
    --vote-border-voted-color: #2563eb;

    /* Shadow */
    --vote-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.2);

    /* PK Progress Bar */
    --vote-pk-option1-bg: #3b82f6;
    --vote-pk-option2-bg: #f97316;
    --vote-pk-progress-text-color: #ffffff;
}

```
