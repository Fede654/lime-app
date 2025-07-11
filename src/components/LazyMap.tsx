// Import Leaflet core to ensure it's available globally
import L from "leaflet";
import { ComponentChildren } from "preact";
// Direct imports instead of lazy loading for development stability
import {
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Polyline,
    TileLayer,
    Tooltip,
} from "react-leaflet";

// Ensure Leaflet is available globally for react-leaflet
if (typeof window !== "undefined") {
    window.L = L;
}

// Simple wrapper components without lazy loading
interface LazyMapContainerProps {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
    className?: string;
    ref?: any;
    children?: ComponentChildren;
}

export const LazyMapContainer = (props: LazyMapContainerProps) => (
    <MapContainer {...props} />
);

export const LazyTileLayer = (props: any) => <TileLayer {...props} />;

export const LazyMarker = (props: any) => <Marker {...props} />;

export const LazyLayersControl = (props: any) => <LayersControl {...props} />;

LazyLayersControl.BaseLayer = (props: any) => (
    <LayersControl.BaseLayer {...props} />
);

LazyLayersControl.Overlay = (props: any) => (
    <LayersControl.Overlay {...props} />
);

export const LazyLayerGroup = (props: any) => <LayerGroup {...props} />;

export const LazyPolyline = (props: any) => <Polyline {...props} />;

export const LazyTooltip = (props: any) => <Tooltip {...props} />;
