import { lazy, Suspense } from "preact/compat";
import { ComponentChildren } from "preact";
import { Loading } from "components/loading";

// Lazy load react-leaflet components
// @ts-ignore - Lazy loading compatibility
const MapContainer = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.MapContainer,
    }))
);

// @ts-ignore - Lazy loading compatibility
const TileLayer = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.TileLayer,
    }))
);

// @ts-ignore - Lazy loading compatibility
const Marker = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.Marker,
    }))
);

// @ts-ignore - Lazy loading compatibility
const LayersControl = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.LayersControl,
    }))
);

// @ts-ignore - Lazy loading compatibility
const LayerGroup = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.LayerGroup,
    }))
);

// @ts-ignore - Lazy loading compatibility
const Polyline = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.Polyline,
    }))
);

// @ts-ignore - Lazy loading compatibility
const Tooltip = lazy(() =>
    import("react-leaflet").then((module) => ({
        default: module.Tooltip,
    }))
);

// Lazy load leaflet core
const leafletLoader = lazy(() => import("leaflet"));

// Wrapper components that handle the lazy loading
interface LazyMapContainerProps {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
    className?: string;
    ref?: any;
    children?: ComponentChildren;
}

export const LazyMapContainer = (props: LazyMapContainerProps) => (
    <Suspense fallback={<Loading />}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <MapContainer {...props} />
    </Suspense>
);

export const LazyTileLayer = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <TileLayer {...props} />
    </Suspense>
);

export const LazyMarker = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <Marker {...props} />
    </Suspense>
);

export const LazyLayersControl = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <LayersControl {...props} />
    </Suspense>
);

LazyLayersControl.BaseLayer = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <LayersControl.BaseLayer {...props} />
    </Suspense>
);

LazyLayersControl.Overlay = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <LayersControl.Overlay {...props} />
    </Suspense>
);

export const LazyLayerGroup = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <LayerGroup {...props} />
    </Suspense>
);

export const LazyPolyline = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <Polyline {...props} />
    </Suspense>
);

export const LazyTooltip = (props: any) => (
    <Suspense fallback={null}>
        {/* @ts-ignore - Lazy loading compatibility */}
        <Tooltip {...props} />
    </Suspense>
);

// Hook for lazy loading leaflet
export const useLeafletLazy = () => {
    return leafletLoader;
};