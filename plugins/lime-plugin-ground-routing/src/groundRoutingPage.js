import { Trans } from "@lingui/macro";
import { useState } from "preact/hooks";

import { Button } from "components/buttons/button";
import { GlobeIcon } from "components/icons/globeIcon";
import { ChevronDownIcon } from "components/icons/teenny/chevron-down";
import { ChevronUpIcon } from "components/icons/teenny/chevron-up";
import Loading from "components/loading";

import { useGroundRouting } from "./groundRoutingQueries";
import "./style.less";

const ConfigSection = ({ title, children, isOpen, onToggle }) => (
    <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {isOpen ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
        </button>
        {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
);

const InfoCard = ({ label, value, icon = null, isActive = false }) => (
    <div
        className={`p-4 rounded-lg border ${
            isActive
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
        }`}
    >
        <div className="flex items-center space-x-3">
            {icon && <div className="text-gray-600">{icon}</div>}
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-600">{label}</div>
                <div
                    className={`text-lg font-semibold ${
                        isActive ? "text-green-800" : "text-gray-800"
                    }`}
                >
                    {value || (
                        <span className="text-gray-400">Not configured</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

const StatusBadge = ({ enabled }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
    >
        <span
            className={`w-2 h-2 rounded-full mr-2 ${
                enabled ? "bg-green-400" : "bg-red-400"
            }`}
        />
        {enabled ? "Enabled" : "Disabled"}
    </span>
);

const RoutesTable = ({ routes }) => {
    if (!routes || routes.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Trans>No custom routes configured</Trans>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Trans>Destination</Trans>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Trans>Gateway</Trans>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Trans>Metric</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {routes.map((route, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {route.destination || "0.0.0.0/0"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {route.gateway || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {route.metric || "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Page = () => {
    const {
        data: configuration,
        isLoading,
        isError,
        refetch,
    } = useGroundRouting();
    const [expandedSections, setExpandedSections] = useState({
        overview: true,
        network: false,
        routes: false,
        advanced: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center py-16">
                    <Loading />
                    <p className="mt-4 text-lg text-gray-600">
                        <Trans>Loading ground routing configuration...</Trans>
                    </p>
                </div>
            </div>
        );
    }

    if (isError || !configuration) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-5 h-5 text-red-400">⚠</div>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-semibold text-red-800">
                                <Trans>Configuration Not Available</Trans>
                            </h3>
                            <p className="text-red-700 mt-2">
                                <Trans>
                                    Ground routing configuration could not be
                                    loaded. This might be because:
                                </Trans>
                            </p>
                            <ul className="list-disc list-inside text-red-700 mt-2 space-y-1">
                                <li>
                                    <Trans>
                                        The lime-groundrouting service is not
                                        running
                                    </Trans>
                                </li>
                                <li>
                                    <Trans>
                                        No ground routing is configured on this
                                        node
                                    </Trans>
                                </li>
                                <li>
                                    <Trans>Network connectivity issues</Trans>
                                </li>
                            </ul>
                            <div className="mt-4">
                                <Button
                                    onClick={() => refetch()}
                                    disabled={isLoading}
                                >
                                    <Trans>Try Again</Trans>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary-100 rounded-lg">
                            <GlobeIcon className="w-8 h-8 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                <Trans>Ground Routing</Trans>
                            </h1>
                            <p className="text-gray-600 mt-1">
                                <Trans>
                                    Internet connectivity and routing
                                    configuration
                                </Trans>
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => refetch()} disabled={isLoading}>
                        <Trans>Refresh</Trans>
                    </Button>
                </div>
            </div>

            {/* Overview Section */}
            <ConfigSection
                title={<Trans>Overview</Trans>}
                isOpen={expandedSections.overview}
                onToggle={() => toggleSection("overview")}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoCard
                        label={<Trans>Status</Trans>}
                        value={<StatusBadge enabled={configuration.enabled} />}
                        isActive={configuration.enabled}
                    />
                    <InfoCard
                        label={<Trans>Routing Table</Trans>}
                        value={configuration.routing_table || "main"}
                    />
                    <InfoCard
                        label={<Trans>Metric</Trans>}
                        value={configuration.metric || "100"}
                    />
                    <InfoCard
                        label={<Trans>DHCP</Trans>}
                        value={configuration.use_dhcp ? "Enabled" : "Disabled"}
                        isActive={configuration.use_dhcp}
                    />
                    <InfoCard
                        label={<Trans>Interfaces</Trans>}
                        value={
                            Array.isArray(configuration.interfaces)
                                ? configuration.interfaces.join(", ")
                                : configuration.interfaces || "None"
                        }
                    />
                </div>
            </ConfigSection>

            {/* Network Configuration */}
            <ConfigSection
                title={<Trans>Network Configuration</Trans>}
                isOpen={expandedSections.network}
                onToggle={() => toggleSection("network")}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard
                        label={<Trans>Gateway</Trans>}
                        value={configuration.gateway}
                        isActive={!!configuration.gateway}
                    />
                    <InfoCard
                        label={<Trans>DNS Servers</Trans>}
                        value={
                            Array.isArray(configuration.dns_servers)
                                ? configuration.dns_servers.join(", ")
                                : configuration.dns_servers
                        }
                        isActive={!!configuration.dns_servers}
                    />
                </div>
            </ConfigSection>

            {/* Routes Section */}
            <ConfigSection
                title={<Trans>Custom Routes</Trans>}
                isOpen={expandedSections.routes}
                onToggle={() => toggleSection("routes")}
            >
                <RoutesTable routes={configuration.routes} />
            </ConfigSection>

            {/* Advanced Section */}
            <ConfigSection
                title={<Trans>Advanced Configuration</Trans>}
                isOpen={expandedSections.advanced}
                onToggle={() => toggleSection("advanced")}
            >
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        <Trans>Raw Configuration (JSON)</Trans>
                    </h4>
                    <pre className="bg-white border border-gray-200 rounded p-4 text-sm overflow-x-auto">
                        {JSON.stringify(configuration, null, 2)}
                    </pre>
                </div>
            </ConfigSection>
        </div>
    );
};

export default Page;
