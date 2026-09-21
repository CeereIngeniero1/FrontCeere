import { Link } from 'react-router-dom'
import { IconByName } from '../../components/IconByName'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { advantages, companyInfo } from '../../data/company'
import { services, sioInfo } from '../../data/services'

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>
              Software empresarial y soluciones para el sector salud
            </h1>
            <p>
              {companyInfo.description}
            </p>
            <div className="hero-actions">
              <Link to="/servicios">
                <Button size="lg">Conocer nuestras soluciones</Button>
              </Link>
              <Link to="/contacto">
                <Button size="lg" variant="secondary">
                  Solicitar demostración
                </Button>
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <h2>Líneas de trabajo</h2>
            <ul>
              {companyInfo.productLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Servicios</h2>
          <p className="section-lead">
            Soluciones orientadas a la gestión médica, el desarrollo a la medida y el
            acompañamiento tecnológico.
          </p>
          <div className="grid-3">
            {services.slice(0, 6).map((service) => (
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

      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <h2 className="section-title">Ventajas de trabajar con Ceere</h2>
          <p className="section-lead">
            Enfoque en calidad, productividad y acompañamiento para la mejora de
            procesos.
          </p>
          <div className="grid-4">
            {advantages.map((item) => (
              <Card key={item.id} className="feature-card" as="article">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sio-spotlight">
            <h2>{sioInfo.title} | {sioInfo.subtitle}</h2>
            <p>{sioInfo.description}</p>
            <div className="grid-2" style={{ marginTop: '1.25rem' }}>
              <div>
                <h3>Dirigido a</h3>
                <ul>
                  {sioInfo.audiences.map((audience) => (
                    <li key={audience}>{audience}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Características</h3>
                <ul>
                  {sioInfo.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/ceere-sio">
                <Button variant="secondary">Conocer Ceere SIO</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2 style={{ marginBottom: '0.35rem' }}>¿Tiene un proyecto o necesidad específica?</h2>
              <p style={{ margin: 0, color: 'var(--color-gray-500)' }}>
                Cuéntenos su requerimiento y exploremos juntos la mejor forma de
                acompañarlo.
              </p>
            </div>
            <Link to="/contacto">
              <Button size="lg">Solicitar demostración</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
