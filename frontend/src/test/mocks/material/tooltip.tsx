
import { forwardRef, ReactNode, useState } from "react"

/**
 * Element passed into the tooltip
 */
interface MockedTooltipProps {
    /**
     * Every children of the tooltip
     */
    children: Array<ReactNode> | ReactNode

    /**
     * Name of the class
     */
    className: string,

    /**
     * Tooltip displayed text
     */
    title: string,

    /**
     * Tooltip ID
     */
    id: string
};

// Jest Tooltip mock function
/*const mockedTooltip = forwardRef(({
    children,
    className,
    title,
    id
}: {
    children: Array<ReactNode>
    className: string,
    title: string,
    id: string
}, ref: any) => (
    <div className={className}
        onClick={children["props"]["onClick"]}
        id={id}
    >
        {children}
    </div>
));*/

const mockedTooltip = forwardRef(({
    children,
    className,
    title,
    id
}: MockedTooltipProps, ref: any) => (
    <MockedTooltip
        children={children}
        className={className}
        id={id}
        title={title}
    />
));

const MockedTooltip = (props: MockedTooltipProps): ReactNode => {
    const [displayed, setDisplayedStatus] = useState(false);

    const className = props.className;
    const id = props.id;
    const children = props.children;
    const displayedTooltipLegend = props.title;

    const hasMultipleChildren = Array.isArray(children)

    return (
        <div className={className}
            id={id}
            onMouseEnter={()=>{
                setDisplayedStatus(true);
            }}
            onMouseLeave={()=>{
                setDisplayedStatus(false);
            }}
        >
            {hasMultipleChildren? children.map((child)=>{
                return child
            }) : children}
            {displayed && <p>{displayedTooltipLegend}</p>}
        </div>
    )
}

export default mockedTooltip;