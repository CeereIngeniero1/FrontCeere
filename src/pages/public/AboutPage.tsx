import { Card } from '../../components/ui/Card'
import { companyInfo } from '../../data/company'

export function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Nosotros</h1>
        <p className="section-lead">{companyInfo.whatWeDo}</p>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <Card>
            <h2>Quiénes somos</h2>
            <p>{companyInfo.description}</p>
            <p>{companyInfo.aboutLong}</p>
            <p>
              Durante {companyInfo.experienceYears} años hemos establecido relaciones
              de confianza y responsabilidad con nuestros clientes.
            </p>
          </Card>
          <Card>
            <h2>Lo que hacemos</h2>
            <p>Actualmente contamos con una línea de productos orientada a:</p>
            <ul>
              {companyInfo.productLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <Card>
            <h2>Nuestra misión</h2>
            <p>{companyInfo.mission}</p>
          </Card>
          <Card>
            <h2>Nuestra visión</h2>
            <p>{companyInfo.vision}</p>
          </Card>
        </div>

        <Card>
          <h2>Principios</h2>
          <div className="grid-3">
            {companyInfo.principles.map((principle) => (
              <div key={principle} className="feature-card">
                <h3 style={{ fontSize: '1rem' }}>{principle}</h3>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
