import React from "react";
import DeviceMainInfosHeaderSkeleton from "./DeviceMainInfosHeader";
import DeviceSpecsMainInfosSkeleton from "./DeviceSpecsMainInfos";

/**
 * Device main informations skeleton component. Rendered before device data is loaded
 * @returns {React.JSX.Element} Rendered web component
 */
export default function DeviceMainInfosSkeleton (): React.JSX.Element {
    return (
        <div id="computerMainInfos">
            <DeviceMainInfosHeaderSkeleton/>
            <DeviceSpecsMainInfosSkeleton/>
            <br />
        </div>
    )
}
