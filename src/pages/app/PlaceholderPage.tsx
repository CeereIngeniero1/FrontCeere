import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'

interface PlaceholderPageProps {
  title: string
  description: string
  phaseHint: string
}

export function PlaceholderPage({ title, description, phaseHint }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <p style={{ margin: 0 }}>
          Esta pantalla estará disponible en {phaseHint}. La ruta y los permisos de menú
          ya están definidos.
        </p>
      </Card>
    </div>
  )
}
