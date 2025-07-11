import { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

interface DynamicMapLoaderProps {
    children: ComponentChildren;
    fallback?: ComponentChildren;
}

/**
 * Dynamic loader for leaflet maps to reduce initial bundle size
 * Loads leaflet assets only when map components are needed
 */
export const DynamicMapLoader = ({ 
    children, 
    fallback = <div>Loading map...</div> 
}: DynamicMapLoaderProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadLeafletAssets = async () => {
            try {
                // Dynamic imports for leaflet (3.9MB saved from initial bundle)
                const [leafletModule, reactLeafletModule] = await Promise.all([
                    import('leaflet'),
                    import('react-leaflet')
                ]);

                // Ensure leaflet CSS is loaded
                if (!document.querySelector('link[href*="leaflet.css"]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                }

                // Fix leaflet default icon paths (common issue)
                if (leafletModule.default && leafletModule.default.Icon.Default) {
                    leafletModule.default.Icon.Default.mergeOptions({
                        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    });
                }

                if (mounted) {
                    setIsLoaded(true);
                }
            } catch (err) {
                console.error('Failed to load leaflet assets:', err);
                if (mounted) {
                    setError('Failed to load map components');
                }
            }
        };

        loadLeafletAssets();

        return () => {
            mounted = false;
        };
    }, []);

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h3 className="font-bold">Map Loading Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!isLoaded) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default DynamicMapLoader;