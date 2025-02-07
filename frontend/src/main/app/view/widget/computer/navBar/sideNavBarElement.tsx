import React from "react";
import { Link } from "react-router-dom";

import '../../../../../res/css/NavBar.css'

/**
 * Props interface for the side navigation bar child component.
 */
interface SideNavBarElementProps {
    /**
     * Navigation item label
     */
    navBarLabel: string

    /**
     * Navigation item icon
     */
    image: any

    /**
     * Navigation selected element
     */
    selectedElement: number

    /**
     * Navigation update on selected element function based off its index
     * @param {number} newIndex Newly selected element index
     * @returns {void}
     */
    updateSelectedNumber: (newIndex: number) => void

    /**
     * URL path link to the component
     */
    componentPath: string

    /**
     * Element index
     */
    id: number

    /**
     * Class id of the element (the label)
     */
    classId: string
}

/**
 * View class for the side navigation bar child component.
 * @param {SideNavBarElementProps} props elements passed from the navigation bar
 * @returns {React.JSX.Element} View component rendered in the browser.
 */
export default function SideNavBarElement (props: SideNavBarElementProps): React.JSX.Element {
    const classNames = props.id === props.selectedElement ? "sidebarNavElement selected" : "sidebarNavElement";
    return (
        <div
            className={classNames}
            id={`sideNavBarElement${props.id}`}
            onClick={()=>{props.updateSelectedNumber(props.id)}}
        >
            <Link
                to={{
                    pathname: props.componentPath
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
