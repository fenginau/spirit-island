import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalShellProps {
    open: boolean
    onClose: () => void
    children: ReactNode
    maxWidthClass?: string
}

export default function ModalShell({
    open,
    onClose,
    children,
    maxWidthClass = 'max-w-5xl'
}: ModalShellProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='absolute inset-0 bg-slate-950/90 backdrop-blur-md'
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full ${maxWidthClass} glass-panel rounded-3xl overflow-hidden shadow-2xl border-primary/30`}>
                        <button
                            onClick={onClose}
                            className='absolute top-5 right-5 z-10 p-2 bg-slate-900/80 rounded-full text-white hover:bg-slate-800 transition-colors border border-white/10'>
                            <X size={20} />
                        </button>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
