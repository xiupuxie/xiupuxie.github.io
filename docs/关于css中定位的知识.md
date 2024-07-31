在 CSS 中，定位（Positioning）是控制元素在文档流中的位置的重要方式。CSS 中的定位主要有以下几种方式：

1. **Static（静态定位）**：
   - 这是所有元素的默认定位方式。元素按照它们在 HTML 中出现的顺序依次排列，不受 `top`, `bottom`, `left`, `right` 的影响。

   ```css
   position: static;
   ```

2. **Relative（相对定位）**：
   - 相对定位会使元素相对于其在文档流中的原始位置进行移动。移动时不会影响其他元素的位置，因此原始位置仍然被保留。

   ```css
   position: relative;
   ```

   - 可以通过设置 `top`, `bottom`, `left`, `right` 属性来调整元素的位置。例如：

   ```css
   position: relative;
   top: 10px;
   left: 20px;
   ```

3. **Absolute（绝对定位）**：
   - 绝对定位会使元素脱离文档流，并相对于其最近的已定位祖先元素（父级元素或更高级别的祖先元素，如果没有则相对于初始包含块）进行定位。

   ```css
   position: absolute;
   ```

   - 同样可以使用 `top`, `bottom`, `left`, `right` 属性来调整元素的位置。

4. **Fixed（固定定位）**：
   - 固定定位会使元素相对于浏览器窗口进行定位，即使页面滚动也不会改变其位置。

   ```css
   position: fixed;
   ```

   - 同样可以使用 `top`, `bottom`, `left`, `right` 属性来调整元素的位置。

5. **Sticky（粘性定位）**：
   - 粘性定位是相对定位和固定定位的混合。元素在跨越特定阈值前表现为相对定位，之后表现为固定定位。

   ```css
   position: sticky;
   ```

   - 需要配合 `top`, `bottom`, `left`, `right` 属性和 `z-index` 使用，以确定元素在屏幕上的具体位置。

这些定位方式可以帮助开发者精确地控制元素在页面中的位置和布局，视项目需求和设计而选择合适的定位方式。