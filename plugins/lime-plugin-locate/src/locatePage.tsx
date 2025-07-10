import { Trans } from "@lingui/macro";
import L, { LatLngExpression, icon } from "leaflet";
import { useEffect, useRef, useState } from "preact/hooks";
import { useMap } from "react-leaflet";

// Use lazy loading for map components
import {
    LazyLayersControl as LayersControl,
    LazyMapContainer as MapContainer,
    LazyMarker as Marker,
    LazyTileLayer as TileLayer,
} from "components/LazyMap";
import { Loading } from "components/loading";

import {
    useChangeLocation,
    useLoadLeaflet,
    useLocation,
    useNodesandlinks,
} from "plugins/lime-plugin-locate/src/locateQueries";

import { useBoardData } from "utils/queries";

import { getCommunityGeoJSON } from "./communityGeoJSON";
import { homeIcon } from "./leafletUtils";
import style from "./style.less";

// Component to handle map operations that need direct map access
const MapOperations = ({ 
    nodeMarker, 
    onMapReady, 
    stationLat, 
    stationLon, 
    loading,
    editting,
    communityLayer,
    setCommunityLayer,
    boardData,
    nodesData 
}) => {
    const map = useMap();
    
    useEffect(() => {
        if (onMapReady && map) {
            onMapReady(map);
        }
    }, [map, onMapReady]);

    // Set map position when map is available or location gets updated
    useEffect(() => {
        if (!loading && map && stationLat) {
            map.setView([+stationLat, +stationLon], 13);
        }
    }, [map, stationLat, stationLon, loading]);

    // Center the map on the node also when editing is turned on
    useEffect(() => {
        if (map && stationLat && editting) {
            map.setView([+stationLat, +stationLon], 13);
        }
    }, [map, editting, stationLat, stationLon]);

    return null; // This component doesn't render anything
};

const openStreetMapTileString = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
const openStreetMapAttribution =
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

const gmSatellite = "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";
const gmHybrid = "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}";
const gmSubdomains = ["mt0", "mt1", "mt2", "mt3"];

function getCommunityLayer(nodeHostname, stationLat, stationLon, nodesData) {
    /** Create a Leaflet layer with community nodes and links to be added to the map*/
    if (nodesData[nodeHostname]) {
        nodesData[nodeHostname].data.coordinates = {
            lat: stationLat,
            lon: stationLon,
        };
    }
    // Get community GeoJSON, filter out nodes in same location as station host.
    const geoJSON = getCommunityGeoJSON(nodesData, [stationLon, stationLat]);
    return L.geoJSON(geoJSON, {
        onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
                layer.bindTooltip(feature.properties.name).openTooltip();
            }
        },
    });
}

export const LocatePage = () => {
    const { data: boardData } = useBoardData();
    const {
        isError: isAssetError,
        isFetchedAfterMount: assetsLoaded,
        isLoading: isLoadingAssets,
    } = useLoadLeaflet({
        refetchOnWindowFocus: false,
    });

    const {
        data: nodeLocation,
        isLoading: isLoadingLocation,
        isFetched: locationLoaded,
    } = useLocation({
        enabled: assetsLoaded,
    });

    const { data: nodesData } = useNodesandlinks({
        enabled: locationLoaded,
    });

    const { mutate: changeLocation, isLoading: submitting } = useChangeLocation(
        {
            onSettled: () => {
                toogleEdition();
            },
        }
    );

    const loading = isLoadingLocation || isLoadingAssets;
    const isCommunityLocation = nodeLocation.default;
    const stationLat =
        nodeLocation.location.lat !== "FIXME"
            ? nodeLocation.location.lat
            : null;
    const stationLon =
        nodeLocation.location.lon !== "FIXME"
            ? nodeLocation.location.lon
            : null;
    const hasLocation = stationLat && !isCommunityLocation;

    const [editting, setEditting] = useState(false);
    const [nodeMarker, setNodeMarker] = useState<LatLngExpression>(null);
    const [communityLayer, setCommunityLayer] = useState(null);

    const mapRef = useRef<L.Map | null>();

    // Update node marker when location changes
    useEffect(() => {
        if (stationLat && stationLon) {
            setNodeMarker([+stationLat, +stationLon]);
        }
    }, [stationLat, stationLon]);

    // Callback to receive map instance from MapOperations component
    const handleMapReady = (map: L.Map) => {
        mapRef.current = map;
    };

    function onConfirmLocation() {
        if (!mapRef.current) {
            console.error("Map reference not available");
            return;
        }
        
        try {
            const position = mapRef.current.getCenter();
            changeLocation({ lat: position.lat, lon: position.lng });
            
            if (communityLayer) {
                // Hide the community view, to avoid outdated links
                toogleCommunityLayer();
            }
        } catch (error) {
            console.error("Error confirming location:", error);
        }
    }

    function toogleCommunityLayer() {
        const map = mapRef.current;
        if (!map) return;

        if (communityLayer) {
            map.removeLayer(communityLayer);
            setCommunityLayer(null);
        } else {
            const layer = getCommunityLayer(
                boardData.hostname,
                stationLat,
                stationLon,
                nodesData
            );
            layer.addTo(map);
            setCommunityLayer(layer);
        }
    }

    function isReady() {
        return !loading && typeof stationLat !== "undefined";
    }

    function toogleEdition() {
        setEditting(!editting);
    }

    if (isAssetError) {
        return (
            <div id="map-container" className={style.hasAssetError}>
                <Trans>Cannot load map, check your internet connection</Trans>
            </div>
        );
    }

    return (
        <>
            {(!isReady() || submitting) && (
                <div id="loading-container" className={style.loadingContainer}>
                    <Loading />
                </div>
            )}
            {isReady() && (
                <MapContainer
                    center={[-30, -60]}
                    zoom={3}
                    scrollWheelZoom={true}
                    className={style.mapContainer}
                >
                    <MapOperations
                        nodeMarker={nodeMarker}
                        onMapReady={handleMapReady}
                        stationLat={stationLat}
                        stationLon={stationLon}
                        loading={loading}
                        editting={editting}
                        communityLayer={communityLayer}
                        setCommunityLayer={setCommunityLayer}
                        boardData={boardData}
                        nodesData={nodesData}
                    />
                    <LayersControl position="bottomright">
                        <LayersControl.BaseLayer checked name="Open Street Map">
                            <TileLayer
                                attribution={openStreetMapAttribution}
                                url={openStreetMapTileString}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Maps Satellite">
                            <TileLayer
                                url={gmSatellite}
                                subdomains={gmSubdomains}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Google Maps Hybrid">
                            <TileLayer
                                url={gmHybrid}
                                subdomains={gmSubdomains}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    {nodeMarker && (
                        <Marker
                            position={nodeMarker}
                            icon={icon({ ...homeIcon })}
                        />
                    )}
                    {editting && (
                        <div
                            id="location-marker"
                            className={style.locationMarker}
                        />
                    )}
                </MapContainer>
            )}
            {isReady() && (
                <div id="edit-action" className={style.editAction}>
                    {editting && (
                        <button onClick={onConfirmLocation}>
                            <Trans>confirm location</Trans>
                        </button>
                    )}
                    {!editting && (
                        <button onClick={toogleCommunityLayer}>
                            {communityLayer ? (
                                <Trans>hide community</Trans>
                            ) : (
                                <Trans>show community</Trans>
                            )}
                        </button>
                    )}

                    <button onClick={toogleEdition}>
                        {editting && <Trans>cancel</Trans>}
                        {!editting && hasLocation && (
                            <Trans>edit location</Trans>
                        )}
                        {!editting && !hasLocation && (
                            <Trans>locate my node</Trans>
                        )}
                    </button>
                </div>
            )}
        </>
    );
};

export default LocatePage;
