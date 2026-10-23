// Jest Tooltip mock function

import { forwardRef, ReactNode } from "react"

const mockedTooltip = forwardRef(({
    children
}: {
    children: Array<ReactNode>
}, ref: any) => (
    <div className={
        children["props"]["className"]
    }
        onClick={children["props"]["onClick"]}
    >
        {children["props"]["children"]}
    </div>
));

export default mockedTooltip;