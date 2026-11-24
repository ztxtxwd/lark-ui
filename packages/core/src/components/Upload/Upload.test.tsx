import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Upload, type UploadChangeInfo, type UploadRequestOptions } from "./Upload";

function pdf(name = "report.pdf", content = "hello") {
  return new File([content], name, { type: "application/pdf" });
}

describe("Upload", () => {
  it("collects a chosen file without uploading it automatically", async () => {
    const onChange = vi.fn();
    render(<Upload onChange={onChange} />);

    await userEvent.upload(screen.getByLabelText("选择文件"), pdf());

    expect(await screen.findByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText(/待上传/)).toBeInTheDocument();

    const info = onChange.mock.calls.at(-1)?.[0] as UploadChangeInfo;
    expect(info.file.name).toBe("report.pdf");
    expect(info.file.status).toBe("ready");
    expect(info.fileList).toHaveLength(1);
  });

  it("rejects a file over maxSize and keeps the list empty", async () => {
    const onChange = vi.fn();
    render(<Upload maxSize={4} onChange={onChange} />);

    await userEvent.upload(screen.getByLabelText("选择文件"), pdf("large.pdf", "too large"));

    expect(screen.queryByText("large.pdf")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("stops at maxCount when several files are chosen", async () => {
    const onChange = vi.fn();
    render(<Upload multiple maxCount={2} onChange={onChange} />);

    await userEvent.upload(screen.getByLabelText("选择文件"), [
      pdf("a.pdf"),
      pdf("b.pdf"),
      pdf("c.pdf"),
    ]);

    expect(await screen.findByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
    expect(screen.queryByText("c.pdf")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "上传文件" })).toBeDisabled();

    const info = onChange.mock.calls.at(-1)?.[0] as UploadChangeInfo;
    expect(info.fileList.map((file) => file.name)).toEqual(["a.pdf", "b.pdf"]);
  });

  it("treats a */* accept rule as every file type", async () => {
    render(<Upload accept="*/*" />);

    const input = screen.getByLabelText("选择文件") as HTMLInputElement;
    const file = pdf("anything.pdf");
    // userEvent filters against the native accept attribute, so set the files directly.
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    fireEvent.change(input);

    expect(await screen.findByText("anything.pdf")).toBeInTheDocument();
  });

  it("adds files dropped on the drag area and clears the drag state", async () => {
    render(<Upload drag />);
    const dropzone = screen.getByRole("button", {
      name: "点击或拖拽文件到此处上传",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(pdf("dropped.pdf"));

    act(() => {
      fireEvent.dragOver(dropzone, { dataTransfer });
    });
    expect(dropzone).toHaveAttribute("data-dragging");

    act(() => {
      dropzone.dispatchEvent(
        new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
      );
    });

    expect(await screen.findByText("dropped.pdf")).toBeInTheDocument();
    await waitFor(() => expect(dropzone).not.toHaveAttribute("data-dragging"));
  });

  it("uses defined theme tokens for the picture tile and drag border", () => {
    const { container } = render(
      <Upload
        drag
        listType="picture"
        defaultFileList={[{ uid: "p", name: "p.png", status: "done" }]}
      />,
    );

    const tile = container.querySelector('[data-slot="upload-picture"]');
    const dropzone = screen.getByRole("button", {
      name: "点击或拖拽文件到此处上传",
    });
    if (!(tile instanceof HTMLElement)) {
      throw new Error("Expected the picture tile");
    }

    expect(getComputedStyle(tile).backgroundColor).toBe("rgb(239, 240, 241)");
    expect(getComputedStyle(dropzone).borderColor).toBe("rgb(208, 211, 214)");
  });

  it("keeps error styling stable on hover and readable in dark mode", async () => {
    render(
      <Upload
        defaultFileList={[
          { uid: "bad", name: "bad.pdf", size: 10, status: "error", error: "网络错误" },
        ]}
      />,
    );
    const row = screen.getByText("bad.pdf").closest('[data-slot="upload-file"]');
    const error = screen.getByText("网络错误");
    if (!(row instanceof HTMLElement)) {
      throw new Error("Expected the error row");
    }

    await userEvent.hover(row);
    await waitFor(() => expect(getComputedStyle(row).borderColor).toBe("rgb(245, 74, 69)"));

    document.documentElement.dataset.theme = "dark";
    try {
      await waitFor(() => expect(getComputedStyle(error).color).toBe("rgb(240, 91, 86)"));
    } finally {
      delete document.documentElement.dataset.theme;
    }
  });

  it("lets beforeUpload reject a file", async () => {
    const beforeUpload = vi.fn(() => false);
    const onChange = vi.fn();
    render(<Upload beforeUpload={beforeUpload} onChange={onChange} />);

    await userEvent.upload(screen.getByLabelText("选择文件"), pdf("blocked.pdf"));

    expect(beforeUpload).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("blocked.pdf")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes a file and reports its removed status", async () => {
    const onChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <Upload
        defaultFileList={[{ uid: "old", name: "old.pdf", size: 1024, status: "done" }]}
        onChange={onChange}
        onRemove={onRemove}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "移除 old.pdf" }));

    await waitFor(() => expect(screen.queryByText("old.pdf")).not.toBeInTheDocument());
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ uid: "old" }));

    const info = onChange.mock.calls.at(-1)?.[0] as UploadChangeInfo;
    expect(info.file.status).toBe("removed");
    expect(info.fileList).toEqual([]);
  });

  it("renders statuses and a progress bar from a controlled file list", () => {
    render(
      <Upload
        progress={{ showInfo: true }}
        fileList={[
          { uid: "up", name: "uploading.pdf", size: 2048, status: "uploading", percent: 42 },
          { uid: "bad", name: "failed.pdf", size: 1024, status: "error", error: "网络错误" },
          { uid: "ok", name: "done.pdf", status: "done", percent: 100 },
        ]}
      />,
    );

    const bar = screen.getByRole("progressbar", { name: "uploading.pdf 上传进度" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuetext", "42%");
    expect(screen.getByText(/上传中/)).toBeInTheDocument();
    // The percent lives in the subtitle row, not beside the bar.
    expect(screen.getByText("2 KB · 上传中 · 42%")).toBeInTheDocument();
    expect(screen.getByText(/网络错误/)).toBeInTheDocument();
    expect(screen.getByText(/已上传/)).toBeInTheDocument();
  });

  it("keeps the text-item bar a bare line pinned to the bottom edge", () => {
    const { container } = render(
      <Upload
        progress={{ showInfo: true }}
        fileList={[{ uid: "up", name: "big.zip", status: "uploading", percent: 32 }]}
      />,
    );

    const item = container.querySelector('[data-slot="upload-file"]') as HTMLElement;
    expect(item.className).toContain("relative");
    const bar = within(item).getByRole("progressbar", { name: "big.zip 上传进度" });
    expect(bar.className).toContain("absolute");
    expect(bar.className).toContain("bottom-0");
    // No percent text is rendered inside the bar row.
    expect(within(bar).queryByText("32%")).not.toBeInTheDocument();
  });

  it("drives progress and success through customRequest", async () => {
    let options: UploadRequestOptions | undefined;
    const customRequest = vi.fn((next: UploadRequestOptions) => {
      options = next;
      return { abort: vi.fn() };
    });

    render(<Upload customRequest={customRequest} />);
    await userEvent.upload(screen.getByLabelText("选择文件"), pdf());

    await waitFor(() => expect(customRequest).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/上传中/)).toBeInTheDocument();

    act(() => options?.onProgress(40));
    expect(screen.getByRole("progressbar", { name: "report.pdf 上传进度" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );

    act(() => options?.onSuccess("ok"));
    expect(screen.getByText(/已上传/)).toBeInTheDocument();
  });

  it("shows an error and retries it with the same request", async () => {
    let options: UploadRequestOptions | undefined;
    const customRequest = vi.fn((next: UploadRequestOptions) => {
      options = next;
      return { abort: vi.fn() };
    });

    render(<Upload customRequest={customRequest} />);
    await userEvent.upload(screen.getByLabelText("选择文件"), pdf());

    await waitFor(() => expect(customRequest).toHaveBeenCalledTimes(1));
    act(() => options?.onError(new Error("网络错误")));

    expect(await screen.findByText(/网络错误/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "重试 report.pdf" }));

    await waitFor(() => expect(customRequest).toHaveBeenCalledTimes(2));
    expect(screen.getByText(/上传中/)).toBeInTheDocument();
  });

  it("opens the picker from the keyboard", async () => {
    render(<Upload />);
    const input = screen.getByLabelText("选择文件") as HTMLInputElement;
    const click = vi.spyOn(input, "click").mockImplementation(() => {});

    try {
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "上传文件" })).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      expect(click).toHaveBeenCalledTimes(1);
    } finally {
      click.mockRestore();
    }
  });

  it("aborts an in-flight request when the file is removed", async () => {
    const abort = vi.fn();
    const customRequest = vi.fn(() => ({ abort }));

    render(<Upload customRequest={customRequest} />);
    await userEvent.upload(screen.getByLabelText("选择文件"), pdf());
    await waitFor(() => expect(customRequest).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole("button", { name: "移除 report.pdf" }));

    await waitFor(() => expect(abort).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();
  });

  it("leaves a controlled list unchanged until the owner updates it", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Upload fileList={[]} onChange={onChange} />);

    await userEvent.upload(screen.getByLabelText("选择文件"), pdf());
    await waitFor(() => expect(onChange).toHaveBeenCalled());

    expect(screen.queryByText("report.pdf")).not.toBeInTheDocument();
    const info = onChange.mock.calls.at(-1)?.[0] as UploadChangeInfo | undefined;
    if (!info) {
      throw new Error("Expected the controlled upload to report its files");
    }
    rerender(<Upload fileList={info.fileList} onChange={onChange} />);
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
  });

  it("revokes the preview object URL when a picture is removed", async () => {
    const create = vi.spyOn(URL, "createObjectURL");
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const image = new File(["image"], "preview.png", { type: "image/png" });

    render(
      <Upload
        listType="picture"
        defaultFileList={[{ uid: "img", name: "preview.png", status: "done", originFile: image }]}
      />,
    );

    try {
      await waitFor(() => expect(create).toHaveBeenCalled());
      const created = create.mock.results[0]?.value as string;
      expect(screen.getByRole("listitem").querySelector("img")?.src).toBe(created);

      await userEvent.click(screen.getByRole("button", { name: "移除 preview.png" }));
      await waitFor(() => expect(revoke).toHaveBeenCalledWith(created));
    } finally {
      create.mockRestore();
      revoke.mockRestore();
    }
  });

  it("disables the trigger, picker and row actions", () => {
    render(
      <Upload
        disabled
        defaultFileList={[{ uid: "one", name: "one.pdf", status: "done", size: 12 }]}
      />,
    );

    expect(screen.getByRole("button", { name: "上传文件" })).toBeDisabled();
    expect(screen.getByLabelText("选择文件")).toBeDisabled();
    expect(screen.getByRole("button", { name: "移除 one.pdf" })).toBeDisabled();
  });

  it("renders the picture list with an accessible remove action", () => {
    render(
      <Upload
        listType="picture"
        defaultFileList={[{ uid: "photo", name: "photo.png", status: "done", size: 2048 }]}
      />,
    );

    const list = screen.getByRole("list", { name: "文件列表" });
    expect(within(list).getByText("photo.png")).toBeInTheDocument();
    expect(within(list).getByRole("button", { name: "移除 photo.png" })).toBeInTheDocument();
  });

  it("centers the picture progress line over a dimmed tile", () => {
    const { container } = render(
      <Upload
        listType="picture"
        progress={{ showInfo: true }}
        defaultFileList={[{ uid: "photo", name: "photo.png", status: "uploading", percent: 35 }]}
      />,
    );

    const tile = container.querySelector('[data-slot="upload-picture"]') as HTMLElement;
    const bar = within(tile).getByRole("progressbar", { name: "photo.png 上传进度" });
    // The design doc centers the line over a dimmed tile; no bottom pinning.
    expect(bar.className).toContain("top-1/2");
    expect(bar.className).not.toContain("bottom-0");
    const mask = container.querySelector('[data-slot="upload-picture"] span[aria-hidden="true"]');
    expect(mask).not.toBeNull();
    // The percent sits below the centered bar as plain text.
    expect(within(tile).getByText("35%")).toBeInTheDocument();
  });
});
