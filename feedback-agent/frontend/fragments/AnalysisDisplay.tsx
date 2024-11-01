import { Marked } from '@ts-stack/markdown'

type AnalysisDisplayProps = {
  analysis?: string
}

export const AnalysisDisplay = ({ analysis }: AnalysisDisplayProps) => {
  return <div>{Marked.parse(analysis ?? '')}</div>
}
