export const removeUndefined = (instance: any) => Object.entries(instance)
    .filter(([_, value]) => !!value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
