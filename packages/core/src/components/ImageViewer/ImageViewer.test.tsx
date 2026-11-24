import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ImageViewer, type ImageViewerImage } from "./ImageViewer";

const pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const images: ImageViewerImage[] = [
  { src: `${pixel}#one`, alt: "图片一" },
  { src: `${pixel}#two`, alt: "图片二" },
  { src: `${pixel}#three`, alt: "图片三", downloadName: "third.gif" },
];

describe("ImageViewer", () => {
  it("opens with the first image, the counter and the toolbar", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    const dialog = await screen.findByRole("dialog", { name: "图片预览" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "图片一" })).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "图片操作" })).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "上一张" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "下一张" })).toBeEnabled();
  });

  it("closes from the close button", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.click(screen.getByRole("button", { name: "关闭" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes on a press outside the image", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(backdrop).not.toBeNull();
    await userEvent.click(backdrop as HTMLElement);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes with Escape", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("reports a controlled open change without closing", async () => {
    const onOpenChange = vi.fn();
    render(<ImageViewer open images={images} onOpenChange={onOpenChange} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.click(screen.getByRole("button", { name: "关闭" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog", { name: "图片预览" })).toBeInTheDocument();
  });

  it("zooms in, out and resets", async () => {
    render(<ImageViewer defaultOpen images={[images[0]]} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    expect(screen.getByText("100%")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "放大" }));
    expect(screen.getByText("110%")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "缩小" }));
    expect(screen.getByText("100%")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "放大" }));
    await userEvent.click(screen.getByRole("button", { name: "重置" }));
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("rotates counterclockwise and reset restores the rotation", async () => {
    render(<ImageViewer defaultOpen images={[images[0]]} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    const image = screen.getByRole("img", { name: "图片一" });

    await userEvent.click(screen.getByRole("button", { name: "向左旋转" }));
    expect(image).toHaveAttribute("data-rotation", "270");
    expect(image.className).toContain("-rotate-90");

    await userEvent.click(screen.getByRole("button", { name: "重置" }));
    expect(image).toHaveAttribute("data-rotation", "0");
  });

  it("navigates between images with the next and previous buttons", async () => {
    const onIndexChange = vi.fn();
    render(<ImageViewer defaultOpen images={images} onIndexChange={onIndexChange} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.click(screen.getByRole("button", { name: "下一张" }));

    expect(screen.getByRole("img", { name: "图片二" })).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(onIndexChange).toHaveBeenCalledWith(1);

    await userEvent.click(screen.getByRole("button", { name: "上一张" }));
    expect(screen.getByRole("img", { name: "图片一" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("button", { name: "下一张" })).toBeDisabled();
  });

  it("navigates and zooms with the keyboard", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    // Focus a toolbar control so the key events stay inside the dialog.
    screen.getByRole("button", { name: "放大" }).focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: "图片二" })).toBeInTheDocument();

    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("img", { name: "图片一" })).toBeInTheDocument();

    await userEvent.keyboard("+");
    expect(screen.getByText("110%")).toBeInTheDocument();

    await userEvent.keyboard("0");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("names a single image without an alt after the viewer, without an index", async () => {
    render(<ImageViewer defaultOpen src={pixel} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    expect(screen.getByRole("img", { name: "图片预览" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "图片预览 1" })).not.toBeInTheDocument();
  });

  it("hides navigation and the counter for a single image", async () => {
    render(<ImageViewer defaultOpen src={images[0].src} alt="单张图片" />);

    await screen.findByRole("dialog", { name: "图片预览" });
    expect(screen.getByRole("img", { name: "单张图片" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "上一张" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "下一张" })).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
  });

  it("offers a download link for the current image", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    const link = screen.getByRole("link", { name: "下载" });
    expect(link).toHaveAttribute("href", images[0].src);
    expect(link).toHaveAttribute("download");

    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    expect(screen.getByRole("link", { name: "下载" })).toHaveAttribute("download", "third.gif");
  });

  it("renders custom toolbar actions and content", async () => {
    const onEdit = vi.fn();
    render(
      <ImageViewer
        defaultOpen
        images={[images[0]]}
        toolbarExtra={
          <button type="button" onClick={onEdit}>
            编辑
          </button>
        }
      >
        <span>项目截图</span>
      </ImageViewer>,
    );

    await screen.findByRole("dialog", { name: "图片预览" });
    expect(screen.getByText("项目截图")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "编辑" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("supports a controlled index", async () => {
    const onIndexChange = vi.fn();
    render(<ImageViewer defaultOpen images={images} index={1} onIndexChange={onIndexChange} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    expect(screen.getByRole("img", { name: "图片二" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("img", { name: "图片二" })).toBeInTheDocument();
  });

  it("resets zoom and rotation when a controlled index changes", async () => {
    const { rerender } = render(<ImageViewer defaultOpen images={images} index={0} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.click(screen.getByRole("button", { name: "放大" }));
    await userEvent.click(screen.getByRole("button", { name: "向左旋转" }));
    expect(screen.getByText("110%")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "图片一" })).toHaveAttribute("data-rotation", "270");

    rerender(<ImageViewer defaultOpen images={images} index={1} />);

    expect(await screen.findByRole("img", { name: "图片二" })).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "图片二" })).toHaveAttribute("data-rotation", "0");
  });

  it("resets zoom and rotation when a single image src changes", async () => {
    const { rerender } = render(<ImageViewer defaultOpen src={images[0].src} alt="第一张" />);

    await screen.findByRole("dialog", { name: "图片预览" });
    await userEvent.click(screen.getByRole("button", { name: "放大" }));
    await userEvent.click(screen.getByRole("button", { name: "向左旋转" }));
    expect(screen.getByText("110%")).toBeInTheDocument();

    rerender(<ImageViewer defaultOpen src={images[1].src} alt="第二张" />);

    expect(await screen.findByRole("img", { name: "第二张" })).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "第二张" })).toHaveAttribute("data-rotation", "0");
  });

  it("shows the UD failed-loading placeholder for a broken image", async () => {
    render(<ImageViewer defaultOpen images={[{ src: `${pixel}#broken`, alt: "坏掉的图片" }]} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    fireEvent.error(screen.getByRole("img", { name: "坏掉的图片" }));

    expect(await screen.findByRole("img", { name: "加载失败" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "坏掉的图片" })).not.toBeInTheDocument();
  });

  it("keeps the failed placeholder visible on the dark viewer in dark mode", async () => {
    document.documentElement.dataset.theme = "dark";
    try {
      render(<ImageViewer defaultOpen images={[{ src: `${pixel}#broken`, alt: "坏掉的图片" }]} />);

      await screen.findByRole("dialog", { name: "图片预览" });
      fireEvent.error(screen.getByRole("img", { name: "坏掉的图片" }));
      const placeholder = await screen.findByRole("img", { name: "加载失败" });
      expect(placeholder).toHaveClass("text-white/70");

      // Compare with the same utility outside the component so the assertion
      // is independent of Tailwind's colour syntax (rgb vs oklab).
      const reference = document.createElement("span");
      reference.className = "text-white/70";
      document.body.appendChild(reference);
      try {
        expect(getComputedStyle(placeholder).color).toBe(getComputedStyle(reference).color);
      } finally {
        reference.remove();
      }
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("recovers when navigating away from a broken image", async () => {
    render(
      <ImageViewer
        defaultOpen
        images={[
          { src: `${pixel}#broken`, alt: "坏掉的图片" },
          { src: `${pixel}#fine`, alt: "正常的图片" },
        ]}
      />,
    );

    await screen.findByRole("dialog", { name: "图片预览" });
    fireEvent.error(screen.getByRole("img", { name: "坏掉的图片" }));
    expect(await screen.findByRole("img", { name: "加载失败" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "下一张" }));
    expect(await screen.findByRole("img", { name: "正常的图片" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "加载失败" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "上一张" }));
    expect(await screen.findByRole("img", { name: "加载失败" })).toBeInTheDocument();
  });

  it("retries a failed image when the viewer is reopened", async () => {
    const broken = [{ src: `${pixel}#broken`, alt: "坏掉的图片" }];
    const { rerender } = render(<ImageViewer open images={broken} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    fireEvent.error(screen.getByRole("img", { name: "坏掉的图片" }));
    expect(await screen.findByRole("img", { name: "加载失败" })).toBeInTheDocument();

    rerender(<ImageViewer open={false} images={broken} />);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    rerender(<ImageViewer open images={broken} />);
    expect(await screen.findByRole("img", { name: "坏掉的图片" })).toBeInTheDocument();
  });

  it("anchors the toolbar and close button to the viewport", async () => {
    render(<ImageViewer defaultOpen images={images} />);

    await screen.findByRole("dialog", { name: "图片预览" });
    const close = screen.getByRole("button", { name: "关闭" });
    const toolbar = screen.getByRole("toolbar", { name: "图片操作" });
    const dialog = screen.getByRole("dialog", { name: "图片预览" });
    const image = screen.getByRole("img", { name: "图片一" });
    const closeRect = close.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    expect(Math.round(closeRect.top)).toBe(20);
    expect(Math.round(window.innerWidth - closeRect.right)).toBe(20);
    expect(Math.round(window.innerHeight - toolbarRect.bottom)).toBe(20);
    expect(Math.round(toolbarRect.left + toolbarRect.width / 2)).toBe(
      Math.round(window.innerWidth / 2),
    );

    // The content is image-sized and centered, so the backdrop stays clickable.
    expect(dialogRect.width).toBeLessThan(window.innerWidth);
    expect(dialogRect.height).toBeLessThan(window.innerHeight);
    expect(imageRect.left + imageRect.width / 2).toBeCloseTo(window.innerWidth / 2, 0);
    expect(imageRect.top + imageRect.height / 2).toBeCloseTo(window.innerHeight / 2, 0);
  });
});
