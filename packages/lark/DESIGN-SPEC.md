# Lark UI design specification

Every component in `src/components/` follows the rules below. The library has
its own design system; this file is the contract that component work is
checked against, so a new component looks like the ones that already ship.

The measurements and colour values here are the ones the components are built
on. Change them here first, then in the component.

---

## Control scale

Five control sizes exist; the library exposes four of them (`xs`/`sm`/`base`/
`lg`), with `base` being the default.

| Library size | Height | Font size | Line height | Padding (button) |
| ------------ | ------ | --------- | ----------- | ---------------- |
| `xs`         | 24px   | 12px      | 20px        | 1px 7px          |
| `sm`         | 28px   | 12px      | 20px        | 3px 7px          |
| `base`       | 32px   | 14px      | 22px        | 4px 11px         |
| `lg`         | 40px   | 16px      | 24px        | 7px 15px         |

Control radius is **6px** (`rounded-md`) at every size.

Inputs use a different padding model than buttons — the padding lives on the
inner wrapper, not on the control itself:

| Size   | Input wrapper padding | Resulting height |
| ------ | --------------------- | ---------------- |
| `sm`   | `3px 3px 3px 7px`     | 28px             |
| `base` | `4px 8px 4px 11px`    | 32px             |
| `lg`   | `7px 8px 7px 11px`    | 40px             |

## Focus is a border change, not a halo

Controls drop the default outline and **do not draw a focus ring**. Focus is
communicated by the control's own styling:

- **Inputs / textareas / selects**: the border colour becomes the brand colour
  (`lark-brand`). No ring, no offset, no halo. Hover uses the exact same
  border colour, so the input turns blue on hover _and_ on focus.
- **Buttons**: `focus-visible` renders the **same** styles as `hover`.
- **Menus, list items, dialogs**: the hovered/selected background doubles as
  the focus indicator.

Tailwind equivalents: `focus-visible:` mirrors `hover:`, and `focus:ring-*`
is dropped in favour of `focus:ring-lark-brand` (a one-pixel ring that
replaces the border) for form controls.

## Component border colour

Control outlines use the `N350` neutral, which is one step darker than the
`N300` used for cards and dividers:

| Token           | Light   | Dark    | Use                              |
| --------------- | ------- | ------- | -------------------------------- |
| `lark-border`   | #d0d3d6 | #505050 | Inputs, selects, picker triggers |
| `lark-outline`  | #8f959e | #757575 | Checkbox / radio resting outline |
| `lark-line`     | #dee0e3 | #373a40 | Cards, sections, dividers        |
| `lark-hairline` | #e4e6eb | #2e3033 | Subtle separators                |

Checkboxes and radios use a darker outline than text inputs: the box uses the
`N500` neutral (`#8f959e`), while an input uses `N350` (`#d0d3d6`). Both turn
brand-coloured on hover and focus.

## Brand interaction colours

The brand blue and its interaction shades:

| Token                | Light   | Dark    | Use                       |
| -------------------- | ------- | ------- | ------------------------- |
| `lark-brand`         | #3370ff | #4c88ff | Resting brand fill        |
| `lark-brand-hover`   | #4e83fd | #669eff | Hover on a brand fill     |
| `lark-brand-pressed` | #245bdb | #75a4ff | Active/pressed brand fill |

Danger follows the same shape: `#f54a45` → hover `#f76964` → pressed
`#d83931`.

## Buttons

The button taxonomy is `filled` / `outlined` / `text` × `default` / `primary`
/ `danger`. The library's `variant` prop maps onto it:

| Library variant         | Rest                                        | Hover                            |
| ----------------------- | ------------------------------------------- | -------------------------------- |
| `primary`               | bg brand, white text                        | bg brand-hover                   |
| `secondary`             | bg base, border `lark-border`, default text | bg `lark-fill`, border unchanged |
| `destructive`           | bg danger, white text                       | bg danger-hover                  |
| `outline`               | transparent bg, border `lark-border`        | bg `lark-fill`, border unchanged |
| `secondary-destructive` | bg base, border danger, danger text         | bg danger tint, border unchanged |
| `ghost`                 | transparent                                 | bg `lark-fill-hover`             |

Buttons carry **no** border by default (the border colour is transparent); the
`outline` and `secondary` variants are the ones that draw one.

Text buttons get a minimum width so short labels still read as buttons — 48px
for `xs`/`sm`, 80px for `base`, 96px for `lg`. Icon-only (`square`/`circle`)
buttons opt out with `min-w-0` and take their width from the size instead.

## Inputs use a 1px border, not a filled pill

Every outlined control (input, textarea, select, picker trigger) is drawn the
same way: a **white** surface with a 1px `#d0d3d6` border and a 6px radius.
The border turns brand-coloured on hover _and_ on focus.

The hover rule is the important one — it is easy to miss, and it is what makes
an input feel responsive.

## Textareas

Textareas take a 1px `lark-border` outline, a 6px radius, `4px 11px` padding,
a 30px minimum height, the recessed surface fill, and `resize: vertical`.

## Disabled controls

Disabled controls keep their border colour, swap to the recessed fill, and
mute the text. They must not react to hover — the border stays put.

**Buttons** are the exception worth knowing: a disabled _filled_ button is a
**grey solid fill with white text**, not a faded brand fill. A disabled
_outlined_ button keeps its transparent background and border, with muted
text.

So: `disabled:bg-lark-disabled disabled:text-white` for the solid variants,
`disabled:text-lark-inactive` for the outlined and text ones — never
`disabled:opacity-50`.

## Loading buttons

A loading button is inert, but it is **not** visually disabled, and the
variants differ:

- **Filled** (`primary` / `destructive`) stay inside their own colour family
  and only step the fill one ramp back (`--primary-fill-loading` /
  `--function-danger-fill-loading`) while the label and spinner stay white.
  That is `bg-lark-brand-loading` (`#94b4ff` light, `#2655b6` dark) and
  `bg-lark-danger-loading`.
- **Outlined and text** (`secondary` / `outline` / `ghost`) keep their surface
  and border, and only mute the label to
  `--udtoken-component-text-disabled-loading` (Feishu N500 →
  `text-lark-placeholder`, `#8f959e` light / `#757575` dark) while the spinner
  stays brand-coloured. `secondary-destructive` mutes to
  `text-lark-danger-loading` and tints its border to match.

The grey fill above is reserved for `disabled`. The component still renders
`disabled` so the click cannot fire, but while `loading` is set (and `disabled`
is not) it appends the `LOADING_CLASSES` entry for the variant plus
`disabled:cursor-default`; `cn()` merges those over the variant's
`disabled:bg-lark-disabled` / `disabled:text-lark-inactive`. An explicitly
`disabled` button keeps the disabled styling even when `loading` is also set.

## Overlays

Every floating surface — select list, menu, popover, tooltip, modal — uses the
same elevation (`shadow-s4-down`) and a 6px radius; tooltips use an 8px radius.
Toasts also use `shadow-s4-down`, with an 8px radius, and a raised card uses
`shadow-s3-down`.

A tooltip has **no border** — its dark surface (`#1f2329`) plus the shadow
define it.

## Modals

Modals pad their sections with 24px and separate the action row with a 1px
card divider. The description sits 8px below the title. The footer buttons are
laid out `row-reverse` (the primary action sits on the right) with 12px
between them.

## Toasts and notifications

The library ships **one** floating surface for transient messages: `Toast`,
anchored at the top centre of the viewport. It follows the Feishu client's
toast design: a pale status tint with a **1px border in the status colour**,
an 8px radius, `shadow-s4-down`, 20px by 16px padding, a 16px filled status
icon, and a semibold 14px/22px message. Multiple toasts stack downwards in a
full column, 16px apart.

`Banner` is the inline counterpart, not a floating toast: a full-width compact
surface that always tints the whole background (`ud__notice--filled`) with no
border and a 6px radius. Banner has no outlined theme — the bordered treatment
belongs to Toast.

| Component | Surface                                             |
| --------- | --------------------------------------------------- |
| `Banner`  | inline, pale status tint, no border, 6px            |
| `Toast`   | floating, pale status tint + 1px status border, 8px |

The outlined border is **one scale step stronger than the status icon** — the
icon uses the 500 shade and the border the 600 shade. Lark keeps that
relationship with the `lark-*-outline` tokens.

## Date picker

Day cells are 32px circles with a 14px number, and they use the brand tint
(`#e1eaff`, the `lark-brand-tint` token) for hover and for the selected range.
The selected day is white on the brand fill; today is brand-coloured text with
a 1px brand border.

## Transitions

Colour transitions on a 100ms curve and nothing else — `color`,
`background-color` and `border-color` each ease in over 100ms.

Avoid `transition-all` — position and size changes should animate explicitly
(the tab ink bar moves with `transition-[transform,width]`).
