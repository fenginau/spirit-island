interface FlippableImageCardProps {
    frontImage: string | null
    backImage?: string | null
    frontAlt: string
    backAlt?: string
    flipped: boolean
    onToggle: () => void
    canFlip: boolean
    aspectRatioClass: string
    maxWidthClass?: string
    frontFallbackText?: string
    backFallbackText?: string
    onFrontError?: () => void
    onBackError?: () => void
}

export default function FlippableImageCard({
    frontImage,
    backImage = null,
    frontAlt,
    backAlt = 'Back side',
    flipped,
    onToggle,
    canFlip,
    aspectRatioClass,
    maxWidthClass = 'max-w-xl',
    frontFallbackText = 'Unable to load front side.',
    backFallbackText = 'Unable to load back side.',
    onFrontError,
    onBackError
}: FlippableImageCardProps) {
    return (
        <div className={`mx-auto w-full ${maxWidthClass} [perspective:1400px]`}>
            <button
                type='button'
                onClick={() => {
                    if (canFlip) {
                        onToggle()
                    }
                }}
                className={`w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                    canFlip ? 'cursor-pointer' : 'cursor-default'
                }`}>
                <div
                    className={`relative ${aspectRatioClass} w-full transition-transform duration-700 [transform-style:preserve-3d]`}
                    style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    <div className='absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden]'>
                        {frontImage ? (
                            <img
                                src={frontImage}
                                alt={frontAlt}
                                className='h-full w-full object-contain'
                                referrerPolicy='no-referrer'
                                onError={onFrontError}
                            />
                        ) : (
                            <div className='h-full grid place-items-center text-sm text-slate-400 px-6 text-center'>
                                {frontFallbackText}
                            </div>
                        )}
                    </div>
                    {canFlip && (
                        <div className='absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]'>
                            {backImage ? (
                                <img
                                    src={backImage}
                                    alt={backAlt}
                                    className='h-full w-full object-contain'
                                    referrerPolicy='no-referrer'
                                    onError={onBackError}
                                />
                            ) : (
                                <div className='h-full grid place-items-center text-sm text-slate-400 px-6 text-center'>
                                    {backFallbackText}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </button>
        </div>
    )
}
