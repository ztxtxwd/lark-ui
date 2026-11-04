/**
 * Icon registry.
 *
 * Every icon is inlined as SVG from [Phosphor Icons](https://phosphoricons.com)
 * (MIT). Each icon is imported on its own so a consumer's bundler only pulls
 * the glyphs they actually use.
 */
import type { Icon } from "@phosphor-icons/react";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowsClockwise";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { BookOpenIcon } from "@phosphor-icons/react/dist/csr/BookOpen";
import { BookmarkIcon } from "@phosphor-icons/react/dist/csr/Bookmark";
import { CalendarIcon } from "@phosphor-icons/react/dist/csr/Calendar";
import { CaretDoubleLeftIcon } from "@phosphor-icons/react/dist/csr/CaretDoubleLeft";
import { CaretDoubleRightIcon } from "@phosphor-icons/react/dist/csr/CaretDoubleRight";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/csr/CaretLeft";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CaretUpIcon } from "@phosphor-icons/react/dist/csr/CaretUp";
import { CaretUpDownIcon } from "@phosphor-icons/react/dist/csr/CaretUpDown";
import { ChatIcon } from "@phosphor-icons/react/dist/csr/Chat";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { CloudIcon } from "@phosphor-icons/react/dist/csr/Cloud";
import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { CopyIcon } from "@phosphor-icons/react/dist/csr/Copy";
import { CopySimpleIcon } from "@phosphor-icons/react/dist/csr/CopySimple";
import { DatabaseIcon } from "@phosphor-icons/react/dist/csr/Database";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsThreeVertical";
import { DownloadIcon } from "@phosphor-icons/react/dist/csr/Download";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/csr/Envelope";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/csr/EyeSlash";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { FlagIcon } from "@phosphor-icons/react/dist/csr/Flag";
import { FolderIcon } from "@phosphor-icons/react/dist/csr/Folder";
import { FunnelIcon } from "@phosphor-icons/react/dist/csr/Funnel";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { GearSixIcon } from "@phosphor-icons/react/dist/csr/GearSix";
import { GlobeHemisphereWestIcon } from "@phosphor-icons/react/dist/csr/GlobeHemisphereWest";
import { HashIcon } from "@phosphor-icons/react/dist/csr/Hash";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { ImageIcon } from "@phosphor-icons/react/dist/csr/Image";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PaletteIcon } from "@phosphor-icons/react/dist/csr/Palette";
import { PencilIcon } from "@phosphor-icons/react/dist/csr/Pencil";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import { ShareIcon } from "@phosphor-icons/react/dist/csr/Share";
import { SignOutIcon } from "@phosphor-icons/react/dist/csr/SignOut";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import { TableIcon } from "@phosphor-icons/react/dist/csr/Table";
import { TagIcon } from "@phosphor-icons/react/dist/csr/Tag";
import { TerminalIcon } from "@phosphor-icons/react/dist/csr/Terminal";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { UploadIcon } from "@phosphor-icons/react/dist/csr/Upload";
import { UserIcon } from "@phosphor-icons/react/dist/csr/User";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { WarningOctagonIcon } from "@phosphor-icons/react/dist/csr/WarningOctagon";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { XCircleIcon } from "@phosphor-icons/react/dist/csr/XCircle";

import type { LarkIconName } from "./icon-names";

/**
 * Name → icon component map used by `LarkIcon`.
 *
 * The `Record<LarkIconName, Icon>` annotation keeps the map and the published
 * name list in sync: a name without an icon (or an icon without a name) is a
 * compile error.
 */
export const LARK_ICONS = {
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-square-out": ArrowSquareOutIcon,
  "arrow-up": ArrowUpIcon,
  "arrows-clockwise": ArrowsClockwiseIcon,
  bell: BellIcon,
  "book-open": BookOpenIcon,
  bookmark: BookmarkIcon,
  calendar: CalendarIcon,
  "caret-double-left": CaretDoubleLeftIcon,
  "caret-double-right": CaretDoubleRightIcon,
  "caret-down": CaretDownIcon,
  "caret-left": CaretLeftIcon,
  "caret-right": CaretRightIcon,
  "caret-up": CaretUpIcon,
  "caret-up-down": CaretUpDownIcon,
  chat: ChatIcon,
  check: CheckIcon,
  "check-circle": CheckCircleIcon,
  clipboard: ClipboardIcon,
  clock: ClockIcon,
  cloud: CloudIcon,
  code: CodeIcon,
  copy: CopyIcon,
  "copy-simple": CopySimpleIcon,
  database: DatabaseIcon,
  "dots-three": DotsThreeIcon,
  "dots-three-vertical": DotsThreeVerticalIcon,
  download: DownloadIcon,
  envelope: EnvelopeIcon,
  eye: EyeIcon,
  "eye-slash": EyeSlashIcon,
  file: FileIcon,
  flag: FlagIcon,
  folder: FolderIcon,
  funnel: FunnelIcon,
  gear: GearIcon,
  "gear-six": GearSixIcon,
  "globe-hemisphere-west": GlobeHemisphereWestIcon,
  hash: HashIcon,
  house: HouseIcon,
  image: ImageIcon,
  info: InfoIcon,
  lightning: LightningIcon,
  link: LinkIcon,
  list: ListIcon,
  "magnifying-glass": MagnifyingGlassIcon,
  minus: MinusIcon,
  palette: PaletteIcon,
  pencil: PencilIcon,
  plus: PlusIcon,
  question: QuestionIcon,
  share: ShareIcon,
  "sign-out": SignOutIcon,
  star: StarIcon,
  table: TableIcon,
  tag: TagIcon,
  terminal: TerminalIcon,
  trash: TrashIcon,
  upload: UploadIcon,
  user: UserIcon,
  warning: WarningIcon,
  "warning-circle": WarningCircleIcon,
  "warning-octagon": WarningOctagonIcon,
  x: XIcon,
  "x-circle": XCircleIcon,
} satisfies Record<LarkIconName, Icon>;

export {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  ArrowUpIcon,
  ArrowsClockwiseIcon,
  BellIcon,
  BookOpenIcon,
  BookmarkIcon,
  CalendarIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CaretUpDownIcon,
  ChatIcon,
  CheckIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ClockIcon,
  CloudIcon,
  CodeIcon,
  CopyIcon,
  CopySimpleIcon,
  DatabaseIcon,
  DotsThreeIcon,
  DotsThreeVerticalIcon,
  DownloadIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  FileIcon,
  FlagIcon,
  FolderIcon,
  FunnelIcon,
  GearIcon,
  GearSixIcon,
  GlobeHemisphereWestIcon,
  HashIcon,
  HouseIcon,
  ImageIcon,
  InfoIcon,
  LightningIcon,
  LinkIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PaletteIcon,
  PencilIcon,
  PlusIcon,
  QuestionIcon,
  ShareIcon,
  SignOutIcon,
  StarIcon,
  TableIcon,
  TagIcon,
  TerminalIcon,
  TrashIcon,
  UploadIcon,
  UserIcon,
  WarningIcon,
  WarningCircleIcon,
  WarningOctagonIcon,
  XIcon,
  XCircleIcon,
};
