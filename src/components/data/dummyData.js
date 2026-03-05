import { 
  Inbox, 
  Activity,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Package,
  AlertCircle,
  User,
  LayoutDashboard,
  ShoppingCart
} from 'lucide-react'

export const dummyStats = [
  { title: 'Pending Orders', value: '24', change: '+4.5%', positive: true, icon: Inbox },
  { title: 'Processing', value: '156', change: '+12.2%', positive: true, icon: Activity },
  { title: 'Total Earnings', value: '₹12,450.80', change: '−2.1%', positive: false, icon: DollarSign },
]

export const dummyOrders = [
  { id: 'ORD-9281', printType: 'DTG Printing', quantity: 45, deadline: 'Today, 5:00 PM', isToday: true },
  { id: 'ORD-9285', printType: 'Screen Print', quantity: 250, deadline: 'Oct 24', isToday: false },
  { id: 'ORD-9302', printType: 'Embroidery', quantity: 12, deadline: 'Oct 25', isToday: false },
  { id: 'ORD-9311', printType: 'Large Format', quantity: 5, deadline: 'Oct 26', isToday: false },
  { id: 'ORD-9318', printType: 'DTG Printing', quantity: 88, deadline: 'Oct 27', isToday: false },
]

export const dummyResources = [
  { name: 'DTG Printer Cluster A', percentage: 88 },
  { name: 'Screen Print Station 4', percentage: 42 },
  { name: 'Black Ink Inventory', percentage: 12, alert: true },
]

export const mobileMetrics = [
  { title: 'Active Orders', value: '12', color: '#9BCBBF', icon: ShoppingBag },
  { title: 'Completed', value: '145', color: '#22C55E', icon: CheckCircle2 },
  { title: 'Products Listed', value: '24', color: '#3B82F6', icon: Package },
  { title: 'Alert', value: 'Pending KYC', color: '#EF4444', icon: AlertCircle },
]

export const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Incoming Orders', icon: Inbox, badge: '3 New' },
  { name: 'Order Management', icon: ShoppingCart },
  { name: 'Product Management', icon: Package },
  { name: 'Profile & KYC', icon: User },
]

export const mobileMenuItems = [
  { name: 'Incoming Orders', icon: Inbox, badge: '3 New', active: true },
  { name: 'All Orders', icon: ShoppingCart },
  { name: 'Manage Products', icon: Package },
  { name: 'My Profile', icon: User },
]
