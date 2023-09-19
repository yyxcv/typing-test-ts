import React, {useEffect, useRef, useState} from "react";
import styles from "../resources/style/Tooltip.module.css"
import useWindowSize from "../hooks/useWindowResize";

interface TooltipProps {
    innerHtml: React.ReactElement;
    isVisible: boolean;
}

interface Offsets {
    left: number
}

export default function Tooltip({isVisible, innerHtml}: TooltipProps) {

    const [windowWidth, _] = useWindowSize();
    const [offsets, setOffsets] = useState<Offsets>({left: 0});
    const wrapperRef = useRef<HTMLDivElement>(null)
    const toolTipRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const wrapperRect = wrapperRef.current ? wrapperRef.current.getBoundingClientRect() : null;
        const toolTipRect = toolTipRef.current ? toolTipRef.current.getBoundingClientRect() : null;

        if (wrapperRect && toolTipRect) {
            setOffsets(calculateOffsets(windowWidth, wrapperRect, toolTipRect))
        }
    }, [isVisible]);

    return isVisible ?
        <div className={styles.toolTipWrapper}
             ref={wrapperRef}
        >
            <div
                className={styles.toolTip}
                style={{left: offsets.left}}
                ref={toolTipRef}
            >
                {innerHtml}
            </div>
        </div>
        : null;
}


const calculateOffsets = function (
    windowWidth: number,
    wrapperRect: DOMRect,
    toolTipRect: DOMRect
) {

    const padding = 10;
    const offsets: Offsets = {
        left: 0,
    }

    //right alignment
    if (wrapperRect.x + toolTipRect.width > windowWidth) {
        offsets.left = -(wrapperRect.x + toolTipRect.width - windowWidth) - padding;
    }

    return offsets;
}