import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RedirectStatic: () => null = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(location.pathname)
        if (location.pathname.includes("/static") && !location.pathname.startsWith('/static')) {
            // const urlPath = location.pathname.split('/')
            // const staticFolderIndex = urlPath.lastIndexOf('static')
            const newPath = location.pathname.replace('/route/static', '/static');
            navigate(newPath, { replace: true })
        }
    }, [location, navigate]);

    return null;
}

export default RedirectStatic;
