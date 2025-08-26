export function mapLegacyStatus(legacy) {
    return legacy === 'Active' ? 'PUBLISHED' : 'DRAFT';
}
export function mapLegacyFeatured(legacy) {
    return legacy === 'Yes';
}
