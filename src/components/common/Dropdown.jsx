import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from '@/lib/utils'

export default function Dropdown({ trigger, children, align = 'right', className }) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align === 'right' ? 'end' : 'start'}
          className={cn(
            'min-w-[200px] glass-panel rounded-[var(--radius-md)] shadow-2xl shadow-black/40 py-1.5 z-50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          style={{ background: 'linear-gradient(180deg, #16161f, #0e0e15)' }}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

export function DropdownItem({ icon: Icon, children, className, onClick, ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 focus:text-white focus:bg-white/5 transition-colors text-left outline-none cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

export function DropdownDivider() {
  return <DropdownMenuPrimitive.Separator className="h-px bg-[var(--color-border)] my-1.5" />
}
