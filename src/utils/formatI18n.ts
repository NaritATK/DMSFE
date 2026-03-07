export const formatI18n = (
  template: string,
  params: Record<string, string | number>
) => template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => (key in params ? String(params[key]) : match))
