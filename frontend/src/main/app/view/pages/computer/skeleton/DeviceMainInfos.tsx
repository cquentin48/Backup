import DeviceMainInfosHeaderSkeleton from "./DeviceMainInfosHeader";
import DeviceSpecsMainInfosSkeleton from "./DeviceSpecsMainInfos";

export default function DeviceMainInfosSkeleton () {
    return (
        <div id="computerMainInfos">
            <DeviceMainInfosHeaderSkeleton/>
            <DeviceSpecsMainInfosSkeleton/>
            <br />
        </div>
    )
}