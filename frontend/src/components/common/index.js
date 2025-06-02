// Import components
import UntitledComponents from './UntitledUI';

// Export all common components
export { default as Card } from './Card';
export { default as PageHeader } from './PageHeader';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorAlert } from './ErrorAlert';
export { default as ActionButton } from './ActionButton';

// Export Untitled UI components
export { default as UnifiedTable } from './UnifiedTable';

// Re-export the individual components
export const UntitledPageHeader = UntitledComponents.PageHeader;
export const StatsCard = UntitledComponents.StatsCard;
export const TableToolbar = UntitledComponents.TableToolbar;
export const UntitledTabs = UntitledComponents.UntitledTabs;
export const DataCard = UntitledComponents.DataCard;
export const PrimaryButton = UntitledComponents.PrimaryButton;
export const SecondaryButton = UntitledComponents.SecondaryButton;
