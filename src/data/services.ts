import type { ServiceItem, SioModule } from '../types'

export const services: ServiceItem[] = [
  {
    id: 'gestion-medica',
    name: 'Software de gestión médica',
    description:
      'Soluciones para clínicas, instituciones y consultorios médicos u odontológicos que buscan administrar sus procesos de forma integral.',
    icon: 'stethoscope',
  },
  {
    id: 'facturacion',
    name: 'Facturación electrónica',
    description:
      'Acompañamiento para iniciar o fortalecer el proceso de facturación electrónica en su organización.',
    icon: 'file-text',
  },
  {
    id: 'rips',
    name: 'RIPS',
    description:
      'Apoyo en la gestión de información relacionada con el Registro Individual de Prestación de Servicios de Salud.',
    icon: 'clipboard-list',
  },
  {
    id: 'rda',
    name: 'RDA',
    description:
      'Acompañamiento en iniciativas relacionadas con el Resumen Digital de Atención y la interoperabilidad en salud.',
    icon: 'share-2',
  },
  {
    id: 'medida',
    name: 'Software a la medida',
    description:
      'Diseño y desarrollo de sistemas personalizados según las necesidades específicas de su empresa.',
    icon: 'code-2',
  },
  {
    id: 'web',
    name: 'Aplicativos y diseño web',
    description:
      'Diseño, desarrollo y optimización de sitios y aplicaciones web alineados a las necesidades de su organización.',
    icon: 'globe',
  },
  {
    id: 'integraciones',
    name: 'Integraciones de sistemas',
    description:
      'Conexión entre aplicaciones existentes para mejorar el flujo de información y reducir trabajo manual.',
    icon: 'network',
  },
  {
    id: 'soporte',
    name: 'Soporte y acompañamiento',
    description:
      'Soporte técnico y acompañamiento para el uso continuo de las soluciones implementadas.',
    icon: 'headphones',
  },
]

export const sioModules: SioModule[] = [
  {
    id: 'paciente',
    name: 'Manejo integral del paciente',
    description:
      'Registre y consulte la información relacionada con el paciente de manera organizada.',
    icon: 'user',
  },
  {
    id: 'profesional',
    name: 'Manejo integral del profesional',
    description:
      'Administre la información de los profesionales vinculados a la institución.',
    icon: 'user-cog',
  },
  {
    id: 'agenda',
    name: 'Agenda de citas y compromisos',
    description:
      'Programe y organice citas, compromisos y procedimientos del día a día.',
    icon: 'calendar',
  },
  {
    id: 'facturacion',
    name: 'Facturación electrónica',
    description:
      'Gestione procesos de facturación electrónica asociados a la prestación de servicios.',
    icon: 'receipt',
  },
  {
    id: 'inventario',
    name: 'Inventario',
    description:
      'Ingrese, registre, actualice y controle el manejo de productos dentro de la institución.',
    icon: 'package',
  },
  {
    id: 'medicamentos',
    name: 'Manejo de medicamentos',
    description:
      'Clasifique y organice lotes de medicamentos adquiridos por la institución.',
    icon: 'pill',
  },
  {
    id: 'tratamientos',
    name: 'Gestión de tratamientos',
    description:
      'Cree y personalice servicios, tratamientos, planes y procedimientos.',
    icon: 'activity',
  },
  {
    id: 'informes',
    name: 'Gestión y control de informes',
    description:
      'Acceda a informes específicos según la necesidad de la institución.',
    icon: 'bar-chart-3',
  },
  {
    id: 'seguridad',
    name: 'Seguridad y control de acceso',
    description:
      'Controle los accesos del personal autorizado al sistema.',
    icon: 'shield',
  },
  {
    id: 'cxp',
    name: 'Cuentas por pagar',
    description:
      'Controle las cuentas pendientes por cancelar por parte de la entidad.',
    icon: 'wallet',
  },
  {
    id: 'cxc',
    name: 'Cuentas por cobrar',
    description:
      'Controle las cuentas pendientes de cobro asociadas a la operación.',
    icon: 'hand-coins',
  },
  {
    id: 'proveedores',
    name: 'Manejo de proveedores',
    description:
      'Controle los procesos en los que intervienen los proveedores de la institución.',
    icon: 'truck',
  },
]

export const sioInfo = {
  title: 'Ceere SIO',
  subtitle: 'Software de gestión médica',
  description:
    'Especializado para el manejo integral del sector salud. Ceere SIO es un software para clínicas, instituciones y consultorios médicos u odontológicos, desarrollado para plataforma Windows con base de datos MS SQL y capacidad para múltiples usuarios.',
  audiences: [
    'Clínicas',
    'Consultorios médicos',
    'Consultorios odontológicos',
    'Instituciones prestadoras de servicios de salud',
  ],
  highlights: [
    'Más de 15 módulos y funcionalidades',
    'Orientado a la gestión clínica y administrativa',
    'Soporte a múltiples usuarios',
    'Plataforma Windows con base de datos MS SQL',
  ],
} as const
