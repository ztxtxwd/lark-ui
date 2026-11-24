import type { SVGProps } from "react";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number | string;
};

function Icon({ size = 16, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 16 16"
      width={size}
      {...props}
    />
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.25 8.25 3.1 3.1 6.4-6.7" />
    </Icon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.25 8h9.5" />
    </Icon>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3.25v9.5M3.25 8h9.5" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7.1" cy="7.1" r="4.35" />
      <path d="m10.4 10.4 2.45 2.45" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.25 6.25 3.75 3.75 3.75-3.75" />
    </Icon>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.25 9.75 3.75-3.75 3.75 3.75" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.75 4.25 6 8l3.75 3.75" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.25 4.25 10 8l-3.75 3.75" />
    </Icon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M1.9 8s2.16-3.6 6.1-3.6S14.1 8 14.1 8s-2.16 3.6-6.1 3.6S1.9 8 1.9 8Z" />
      <circle cx="8" cy="8" r="1.7" />
    </Icon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.55 4.6A6.7 6.7 0 0 1 8 4.4c3.94 0 6.1 3.6 6.1 3.6a11.4 11.4 0 0 1-1.9 2.36M4.2 5.63A11.5 11.5 0 0 0 1.9 8s2.16 3.6 6.1 3.6a6.8 6.8 0 0 0 2.1-.33" />
      <path d="m2.5 2.5 11 11M6.85 6.86a1.63 1.63 0 0 0 2.3 2.3" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 7.15v3.6M8 5.05v.04" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="m5.4 8.1 1.72 1.73 3.48-3.66" />
    </Icon>
  );
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 4.9v3.7M8 11.1v.04" />
    </Icon>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.13 2.75 1.5 12.5a1 1 0 0 0 .86 1.5h11.28a1 1 0 0 0 .86-1.5L8.87 2.75a1 1 0 0 0-1.74 0Z" />
      <path d="M8 6.1v3.25M8 11.7v.04" />
    </Icon>
  );
}

export function MoreHorizontalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="3.4" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12.6" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function SpinnerIcon({ size = 14, className, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={className ? `lark-spinner ${className}` : "lark-spinner"}
      style={{ width: size, height: size }}
      {...(props as React.HTMLAttributes<HTMLSpanElement>)}
    />
  );
}
