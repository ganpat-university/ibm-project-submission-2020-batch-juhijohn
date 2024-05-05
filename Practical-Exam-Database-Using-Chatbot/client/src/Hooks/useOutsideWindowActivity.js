import { useState, useEffect } from 'react';

function useOutsideWindowActivity() {
    const [isOutsideActivity, setIsOutsideActivity] = useState(false);

    useEffect(() => {
        const handleMouseLeave = () => {
            setIsOutsideActivity(true);
        };

        const handleWindowFocus = () => {
            setIsOutsideActivity(false);
        };

        const handleWindowBlur = () => {
            setIsOutsideActivity(true);
        };

        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('focus', handleWindowFocus);
            window.removeEventListener('blur', handleWindowBlur);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return isOutsideActivity;
}

export default useOutsideWindowActivity;
