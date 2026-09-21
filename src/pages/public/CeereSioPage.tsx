import { Link } from 'react-router-dom'
import { IconByName } from '../../components/IconByName'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { sioInfo, sioModules } from '../../data/services'

export function CeereSioPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">
          {sioInfo.title} | {sioInfo.subtitle}
        </h1>
        <p className="section-lead">{sioInfo.description}</p>

        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <Card>
            <h2>Dirigido a</h2>
            <ul>
              {sioInfo.audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2>Aspectos destacados</h2>
            <ul>
              {sioInfo.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>

        <h2 className="section-title">Módulos y funcionalidades</h2>
        <p className="section-lead">
          Ceere SIO incluye módulos para la gestión clínica y administrativa del
          sector salud.
        </p>

        <div className="grid-3">
          {sioModules.map((module) => (
            <Card key={module.id} className="service-card" as="article">
              <div className="feature-icon">
                <IconByName name={module.icon} />
              </div>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
            </Card>
          ))}
        </div>

        <div className="cta-band" style={{ marginTop: '2.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.35rem' }}>¿Desea conocer Ceere SIO?</h2>
            <p style={{ margin: 0, color: 'var(--color-gray-500)' }}>
              Solicite una demostración y revise cómo puede apoyar la operación de
              su institución.
            </p>
          </div>
          <Link to="/contacto?servicio=gestion-medica">
            <Button size="lg">Solicitar demostración</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
