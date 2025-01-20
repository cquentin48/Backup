import { Link } from "react-router-dom";

/**
 * Props interface for the side navigation bar child component.
 */
interface SideNavBarElementProps {
    navBarLabel: string;
    image: any;
    selectedElement: Number;
    updateSelectedNumber: (newIndex: Number) => void;
    componentPath: string;
    id: Number;
    classId:string;
}

/**
 * View class for the side navigation bar child component.
 * @param props elements passed from the navigation bar
 * @returns View component rendered in the browser.
 */
export default function SideNavBarElement(props: SideNavBarElementProps) {
    const classNames = props.id === props.selectedElement ? "sideBarNavElement selected" : "sideBarNavElement";
    return (
        <div className={classNames}>
            <Link to={{
                pathname: props.componentPath,
            }} style={{
                textDecoration: 'none'
            }}>
                <div id={`${props.classId}Icon`}>
                    {props.image}
                </div>
                <span
                    className="navBarLabel"
                    style={{
                        verticalAlign: 'middle',
                        display: 'inline-block',
                        color: 'black'
                    }}
                    >
                        <div id={`${props.classId}Label`}>
                            {props.navBarLabel}
                        </div>
                    </span>
            </Link>
        </div>
    )
}