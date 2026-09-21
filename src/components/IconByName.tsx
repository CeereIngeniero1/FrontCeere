import {
  Activity,
  BarChart3,
  Calendar,
  ClipboardList,
  Code2,
  FileText,
  Globe,
  HandCoins,
  Headphones,
  Network,
  Package,
  Pill,
  Receipt,
  Share2,
  Shield,
  Stethoscope,
  Truck,
  User,
  UserCog,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  'file-text': FileText,
  'clipboard-list': ClipboardList,
  'share-2': Share2,
  'code-2': Code2,
  globe: Globe,
  network: Network,
  headphones: Headphones,
  user: User,
  'user-cog': UserCog,
  calendar: Calendar,
  receipt: Receipt,
  package: Package,
  pill: Pill,
  activity: Activity,
  'bar-chart-3': BarChart3,
  shield: Shield,
  wallet: Wallet,
  'hand-coins': HandCoins,
  truck: Truck,
}

interface IconByNameProps {
  name: string
  size?: number
  className?: string
}

export function IconByName({ name, size = 22, className }: IconByNameProps) {
  const Icon = iconMap[name] ?? Activity
  return <Icon size={size} className={className} aria-hidden />
}
