import { Link } from "react-router-dom";

import '../../../../res/css/NavBar.css'

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
    classId: string;
}

/**
 * View class for the side navigation bar child component.
 * @param props elements passed from the navigation bar
 * @returns View component rendered in the browser.
 */
export default function SideNavBarElement(props: SideNavBarElementProps) {
    const classNames = props.id === props.selectedElement ? "sidebarNavElement selected" : "sidebarNavElement";
    return (
        <div className={classNames}>
            <Link
                to={{
                    pathname: props.componentPath,
                }}
                style={{
                    textDecoration: 'none',
                    display: 'flex',
                    padding: '6px 0px',
                    alignItems: 'center'
                }}
            >
                <div id={`${props.classId}Icon`}>
                    {props.image}
                </div>
                <span className="navBarLabel">
                        <div>
                            {props.navBarLabel}
                        </div>
                </span>
            </Link>
        </div>
    )
}