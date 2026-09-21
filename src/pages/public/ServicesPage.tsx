import { Link } from 'react-router-dom'
import { IconByName } from '../../components/IconByName'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { services } from '../../data/services'

export function ServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Servicios</h1>
        <p className="section-lead">
          Soluciones de software y acompañamiento tecnológico para organizaciones
          del sector salud y empresas que requieren desarrollos a la medida.
        </p>

        <div className="grid-3">
          {services.map((service) => (
            <Card key={service.id} className="service-card" as="article">
              <div className="feature-icon">
                <IconByName name={service.icon} />
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <Link to={`/contacto?servicio=${service.id}`}>
                <Button variant="outline" size="sm">
                  Más información
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
