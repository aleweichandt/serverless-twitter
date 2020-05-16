const hashExpression = /#(\w+)/g
export const globalTopic = '#'

export async function topicsFor(text: string): Promise<string[]> {
  const topics = text.match(hashExpression) as string[]
  return !!topics ? [globalTopic, ...topics] : [globalTopic]
}
