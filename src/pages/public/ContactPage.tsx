import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { companyInfo } from '../../data/company'
import { services } from '../../data/services'
import type { ContactFormData } from '../../types'
import { isValidEmail } from '../../utils'

const emptyForm: ContactFormData = {
  name: '',
  company: '',
  phone: '',
  email: '',
  service: '',
  message: '',
}

export function ContactPage() {
  const [searchParams] = useSearchParams()
  const initialService = searchParams.get('servicio') ?? ''

  const [form, setForm] = useState<ContactFormData>({
    ...emptyForm,
    service: initialService,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [success, setSuccess] = useState(false)

  const serviceOptions = useMemo(
    () => [
      { value: '', label: 'Seleccione un servicio' },
      ...services.map((service) => ({ value: service.id, label: service.name })),
    ],
    [],
  )

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSuccess(false)
  }

  const validate = () => {
    const next: Partial<Record<keyof ContactFormData, string>> = {}
    if (!form.name.trim()) next.name = 'Ingrese su nombre.'
    if (!form.company.trim()) next.company = 'Ingrese la empresa.'
    if (!form.phone.trim()) next.phone = 'Ingrese un teléfono.'
    if (!form.email.trim()) next.email = 'Ingrese un correo.'
    else if (!isValidEmail(form.email)) next.email = 'Correo no válido.'
    if (!form.service) next.service = 'Seleccione un servicio.'
    if (!form.message.trim()) next.message = 'Escriba un mensaje.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setSuccess(true)
    setForm({ ...emptyForm, service: '' })
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Contacto</h1>
        <p className="section-lead">
          Complete el formulario. En esta versión de prueba no se enviarán datos a
          un servidor.
        </p>

        <div className="contact-grid">
          <Card>
            {success ? (
              <Alert variant="success" title="Demostración simulada">
                El formulario se validó correctamente. En producción este mensaje se
                enviaría al equipo de Ceere. Por ahora los datos no se transmiten.
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Nombre"
                name="name"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                error={errors.name}
                autoComplete="name"
                required
              />
              <Input
                label="Empresa"
                name="company"
                value={form.company}
                onChange={(event) => updateField('company', event.target.value)}
                error={errors.company}
                autoComplete="organization"
                required
              />
              <Input
                label="Teléfono"
                name="phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                error={errors.phone}
                autoComplete="tel"
                required
              />
              <Input
                label="Correo"
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                error={errors.email}
                autoComplete="email"
                required
              />
              <Select
                label="Servicio de interés"
                name="service"
                value={form.service}
                onChange={(event) => updateField('service', event.target.value)}
                options={serviceOptions}
                error={errors.service}
                required
              />
              <Textarea
                label="Mensaje"
                name="message"
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                error={errors.message}
                required
              />
              <Button type="submit">Enviar mensaje</Button>
            </form>
          </Card>

          <Card>
            <h2>Datos de contacto</h2>
            <ul className="stack-sm" style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <strong>Dirección:</strong>
                <br />
                {companyInfo.contact.address}
              </li>
              <li>
                <strong>Teléfono / soporte:</strong>
                <br />
                <a href={`tel:+${companyInfo.contact.phoneRaw}`}>
                  {companyInfo.contact.phone}
                </a>
              </li>
              <li>
                <strong>Correo:</strong>
                <br />
                <a href={`mailto:${companyInfo.contact.email}`}>
                  {companyInfo.contact.email}
                </a>
              </li>
              <li>
                <strong>Horario:</strong>
                <br />
                {companyInfo.contact.schedule.map((item) => (
                  <div key={item.day}>
                    {item.day}: {item.hours}
                  </div>
                ))}
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}
