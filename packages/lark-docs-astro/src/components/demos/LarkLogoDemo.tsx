import { LarkLogo } from "@lark-ui/core";

export function LarkLogoBasicDemo() {
  return <LarkLogo className="size-16" />;
}

export function LarkLogoColorVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <LarkLogo className="size-12" color="color" />
      <LarkLogo className="size-12" color="teal" />
      <LarkLogo className="size-12" color="dark" />
      <LarkLogo className="size-12" color="blue" />
      <LarkLogo className="size-12" color="black" />
      <div className="rounded-lg bg-lark-contrast p-3">
        <LarkLogo className="size-12" color="white" />
      </div>
    </div>
  );
}

export function LarkLogoSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <LarkLogo className="size-6" />
      <LarkLogo className="size-10" />
      <LarkLogo className="size-16" />
      <LarkLogo className="size-24" />
    </div>
  );
}
