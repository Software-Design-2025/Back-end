import React from 'react';

const Animation = ({ children, type = 'fade', duration = 500 }) => {
    // Use React state to trigger animation after mount
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(false);
        const timeout = setTimeout(() => setMounted(true), 10);
        return () => clearTimeout(timeout);
    }, [type]);

    // Đảm bảo initialStyles có opacity cho mọi hiệu ứng
    const initialStyles = {
        fade: { opacity: 0 },
        slide: { transform: 'translateY(40px)', opacity: 0.01 },
        zoom: { transform: 'scale(0.5)', opacity: 0.01 },
        flip: { transform: 'rotateY(90deg)', opacity: 0.01 },
        bounce: { transform: 'translateY(40px)', opacity: 0.01 },
        rotate: { transform: 'rotate(-90deg)', opacity: 0.01 },
        slideLeft: { transform: 'translateX(-40px)', opacity: 0.01 },
        slideRight: { transform: 'translateX(40px)', opacity: 0.01 },
        fadeUp: { opacity: 0, transform: 'translateY(40px)' },
        fadeDown: { opacity: 0, transform: 'translateY(-40px)' },
        scaleUp: { transform: 'scale(0.8)', opacity: 0.01 },
        scaleDown: { transform: 'scale(1.2)', opacity: 0.01 },
        rotateIn: { transform: 'rotate(-90deg) scale(0.5)', opacity: 0.01 },
        flipX: { transform: 'rotateX(90deg)', opacity: 0.01 },
        flipY: { transform: 'rotateY(90deg)', opacity: 0.01 },
    };

    const animationStyles = {
        fade: {
            transition: `opacity ${duration}ms`,
            opacity: mounted ? 1 : 0,
        },
        slide: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            opacity: mounted ? 1 : 0.01,
        },
        zoom: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'scale(1)' : 'scale(0.5)',
            opacity: mounted ? 1 : 0.01,
        },
        flip: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'rotateY(0deg)' : 'rotateY(90deg)',
            opacity: mounted ? 1 : 0.01,
        },
        bounce: {
            transition: `transform ${duration}ms cubic-bezier(.68,-0.55,.27,1.55), opacity ${duration}ms`,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            opacity: mounted ? 1 : 0.01,
        },
        rotate: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'rotate(0deg)' : 'rotate(-90deg)',
            opacity: mounted ? 1 : 0.01,
        },
        slideLeft: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'translateX(0)' : 'translateX(-40px)',
            opacity: mounted ? 1 : 0.01,
        },
        slideRight: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'translateX(0)' : 'translateX(40px)',
            opacity: mounted ? 1 : 0.01,
        },
        fadeUp: {
            transition: `opacity ${duration}ms, transform ${duration}ms`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
        },
        fadeDown: {
            transition: `opacity ${duration}ms, transform ${duration}ms`,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-40px)',
        },
        scaleUp: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'scale(1.1)' : 'scale(0.8)',
            opacity: mounted ? 1 : 0.01,
        },
        scaleDown: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'scale(0.9)' : 'scale(1.2)',
            opacity: mounted ? 1 : 0.01,
        },
        rotateIn: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
            opacity: mounted ? 1 : 0.01,
        },
        flipX: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'rotateX(0deg)' : 'rotateX(90deg)',
            opacity: mounted ? 1 : 0.01,
        },
        flipY: {
            transition: `transform ${duration}ms, opacity ${duration}ms`,
            transform: mounted ? 'rotateY(0deg)' : 'rotateY(90deg)',
            opacity: mounted ? 1 : 0.01,
        },
    };

    return (
        <div style={{ ...initialStyles[type], ...animationStyles[type] }}>
            {children}
        </div>
    );
};

export function getRemotionAnimationStyle({
    type,
    localFrame,
    durationMs,
    fps,
    scaleValue
}) {
    const progress = Math.min(Math.max(localFrame / (durationMs / 1000 * fps), 0), 1);

    const getBgAnimationTransform = (type, progress) => {
        switch (type) {
            case "fade":
                return "";
            case "slide":
                return `translateY(${40 * (1 - progress)}px)`;
            case "zoom":
                return `scale(${0.5 + 0.5 * progress})`;
            case "slideLeft":
                return `translateX(${-40 * (1 - progress)}px)`;
            case "slideRight":
                return `translateX(${40 * (1 - progress)}px)`;
            case "fadeUp":
                return `translateY(${40 * (1 - progress)}px)`;
            case "fadeDown":
                return `translateY(${-40 * (1 - progress)}px)`;
            case "scaleUp":
                return `scale(${0.8 + 0.3 * progress})`;
            case "scaleDown":
                return `scale(${1.2 - 0.3 * progress})`;
            default:
                return "";
        }
    };

    const animationTransform = getBgAnimationTransform(type, progress);

    let transform = "";
    if (animationTransform.includes("scale")) {
        transform = animationTransform;
    } else if (animationTransform) {
        transform = `scale(${scaleValue}) ${animationTransform}`;
    } else {
        transform = `scale(${scaleValue})`;
    }

    const fadeLikeAnimations = [
        "fade", "fadeUp", "fadeDown", "slide", "slideLeft", "slideRight"
    ];
    let opacity = 1;
    if (fadeLikeAnimations.includes(type)) {
        opacity = progress;
    }

    return { transform, opacity };
}

export const animationOptions = [
    "fade", "slide", "zoom", "flip", "bounce", "rotate", "slideLeft", "slideRight",
    "fadeUp", "fadeDown", "scaleUp", "scaleDown", "rotateIn", "flipX", "flipY"
];

export default Animation;